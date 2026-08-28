import { describe, expect, it } from 'vitest';
import { ShareCardService } from '../src/lib/share/shareCardService';
it('generates an SVG card', () => expect(new ShareCardService().createSvg({ date: '2026-08-29', weekday: '星期六', lunar: { month: '七月', day: '十七', display: '七月十七' }, good: ['祭祀'], bad: ['嫁娶'], deityBirthdays: [], sources: ['test'] })).toContain('<svg'));
