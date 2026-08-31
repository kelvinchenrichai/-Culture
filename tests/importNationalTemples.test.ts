import { describe, expect, it } from 'vitest';
import {
  parseXml,
  parseRawRecords,
  normalizeRecord,
  extractDistrictFromAddress,
} from '../scripts/import-national-temples';

// 這個片段刻意比照 dataset 8203 實測下載檔（2026-08-29 由使用者從 data.gov.tw 手動下載並提供）
// 的真實形狀：根節點 ArrayOfOpenData_3、記錄節點 OpenData_3、欄位是「編號/寺廟名稱/主祀神祇/
// 行政區（其實是縣市層級）/地址/教別/登記別/統一編號（只有部分記錄有）/電話/負責人/其他/
// WGS84X/WGS84Y」，不是憑空編造的格式。
const REAL_SHAPE_XML = `﻿<?xml version="1.0" encoding="utf-8"?>
<ArrayOfOpenData_3 xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <OpenData_3>
    <編號>1746804</編號>
    <寺廟名稱>竹圍仔福德祠</寺廟名稱>
    <主祀神祇>福德正神</主祀神祇>
    <行政區>臺南市</行政區>
    <地址>臺南市白河區大竹里14鄰大排竹206號</地址>
    <教別>道教</教別>
    <登記別>補辦登記</登記別>
    <電話>06-6851562</電話>
    <負責人>錢玉珠</負責人>
    <其他 />
    <WGS84X>120.396797180176</WGS84X>
    <WGS84Y>23.3648891448975</WGS84Y>
  </OpenData_3>
  <OpenData_3>
    <編號>1746805</編號>
    <寺廟名稱>福德祠</寺廟名稱>
    <主祀神祇>福德正神</主祀神祇>
    <行政區>臺南市</行政區>
    <地址>臺南市白河區河東里3鄰糞箕湖33之2號</地址>
    <教別>道教</教別>
    <登記別>正式登記</登記別>
    <統一編號>80893869</統一編號>
    <電話>06-6858651</電話>
    <負責人>吳朝正</負責人>
    <其他 />
    <WGS84X>120.438499450684</WGS84X>
    <WGS84Y>23.3971004486084</WGS84Y>
  </OpenData_3>
  <OpenData_3>
    <編號>1746810</編號>
    <寺廟名稱>座標壞掉的廟</寺廟名稱>
    <主祀神祇>福德正神</主祀神祇>
    <行政區>連江縣</行政區>
    <地址>連江縣南竿鄉介壽村1號</地址>
    <教別>道教</教別>
    <登記別>補辦登記</登記別>
    <電話 />
    <負責人>無</負責人>
    <其他 />
    <WGS84X>0</WGS84X>
    <WGS84Y>0</WGS84Y>
  </OpenData_3>
</ArrayOfOpenData_3>`;

describe('parseXml (dataset 8203 real shape)', () => {
  it('parses all records with correct field values, including empty/self-closing tags', () => {
    const rows = parseXml(REAL_SHAPE_XML);
    expect(rows).toHaveLength(3);
    expect(rows[0]['寺廟名稱']).toBe('竹圍仔福德祠');
    expect(rows[0]['行政區']).toBe('臺南市');
    expect(rows[0]['WGS84X']).toBe('120.396797180176');
    expect(rows[0]['WGS84Y']).toBe('23.3648891448975');
    expect(rows[0]['其他']).toBe(''); // self-closing <其他 /> -> empty string, not undefined
    expect(rows[0]['統一編號']).toBeUndefined(); // 只有第二筆有這個欄位
    expect(rows[1]['統一編號']).toBe('80893869');
  });

  it('is picked automatically by parseRawRecords via .xml filename', () => {
    const rows = parseRawRecords(REAL_SHAPE_XML, 'temple.xml');
    expect(rows).toHaveLength(3);
  });

  it('falls back to sniffing the <?xml declaration even without a .xml filename', () => {
    const rows = parseRawRecords(REAL_SHAPE_XML, 'downloaded-file');
    expect(rows).toHaveLength(3);
  });
});

describe('extractDistrictFromAddress', () => {
  it('strips the city prefix and pulls the 鄉/鎮/市/區 that follows', () => {
    expect(extractDistrictFromAddress('臺南市白河區大竹里14鄰大排竹206號', '臺南市')).toBe('白河區');
    expect(extractDistrictFromAddress('連江縣南竿鄉介壽村1號', '連江縣')).toBe('南竿鄉');
  });

  it('returns undefined rather than guessing when the pattern does not match', () => {
    expect(extractDistrictFromAddress('無法解析的地址格式', '臺北市')).toBeUndefined();
  });
});

describe('normalizeRecord against the real dataset 8203 shape (行政區 is city-level, no separate 縣市 field)', () => {
  const fetchedAt = '2026-08-29T00:00:00.000Z';
  const rows = parseXml(REAL_SHAPE_XML);

  it('uses 編號 as the id (stable, present on every record) rather than 統一編號 (only ~1/4 of records have it)', () => {
    const { temple } = normalizeRecord(rows[0], 0, fetchedAt);
    expect(temple!.id).toBe('1746804');
  });

  it('treats 行政區 as the city, and derives district from the address since there is no separate district field', () => {
    const { temple } = normalizeRecord(rows[0], 0, fetchedAt);
    expect(temple!.city).toBe('臺南市');
    expect(temple!.district).toBe('白河區');
  });

  it('reads coordinates from WGS84X (longitude) / WGS84Y (latitude)', () => {
    const { temple } = normalizeRecord(rows[0], 0, fetchedAt);
    expect(temple!.lat).toBeCloseTo(23.3648891448975, 6);
    expect(temple!.lng).toBeCloseTo(120.396797180176, 6);
    expect(temple!.coordinateStatus).toBe('government');
  });

  it('treats (0,0) as an implausible coordinate, not a real one', () => {
    const { temple } = normalizeRecord(rows[2], 2, fetchedAt);
    expect(temple!.lat).toBeUndefined();
    expect(temple!.lng).toBeUndefined();
    expect(temple!.coordinateStatus).toBe('missing');
  });

  it('maps 教別 to the religion field', () => {
    const { temple } = normalizeRecord(rows[0], 0, fetchedAt);
    expect(temple!.religion).toBe('道教');
  });

  it('still supports the fixture-style shape with a separate 縣市 field (existing REAL SAMPLE fixture)', () => {
    const { temple } = normalizeRecord(
      { 統一編號: 'T001', 寺廟名稱: '艋舺龍山寺', 主祀神祇: '觀世音菩薩', 縣市: '臺北市', 行政區: '萬華區', 地址: '臺北市萬華區廣州街211號', 緯度: 25.0372, 經度: 121.4999 },
      0,
      fetchedAt,
    );
    expect(temple!.city).toBe('臺北市');
    expect(temple!.district).toBe('萬華區');
    expect(temple!.id).toBe('T001');
    expect(temple!.lat).toBeCloseTo(25.0372, 4);
  });
});
