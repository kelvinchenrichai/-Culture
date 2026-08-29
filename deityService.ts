import { DEITIES } from '../../data/deities/deities';
import type { Deity } from './types';
export class DeityService {
  list(): Deity[] { return [...DEITIES]; }
  find(query: string): Deity[] { return DEITIES.filter(d => [d.name, ...d.aliases].some(name => name.includes(query) || query.includes(name))); }
  birthdaysOn(lunarMonthDay: string): Deity[] { return DEITIES.filter(d => d.lunarBirthdays.includes(lunarMonthDay)); }
}
export * from './types';
