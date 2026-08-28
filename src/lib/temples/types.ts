export type Temple = { id: string; name: string; mainDeity?: string; city?: string; district?: string; address: string; phone?: string; latitude?: number; longitude?: number; source: string };
export type NearbyTemple = Temple & { distanceKm: number };
