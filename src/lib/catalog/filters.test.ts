import { describe, it, expect } from 'vitest';
import { verifiedCompanies } from '@/data/chennai';
import { filterCompanies, parseFilters } from './filters';
describe('directory search', () => {
  it('combines hard filters instead of silently ignoring them', () => {
    const filters = parseFilters(new URLSearchParams('q=robot&area=Puzhuthivakkam&kind=Scaleup'));
    expect(filterCompanies(verifiedCompanies, filters).map((c) => c.slug)).toEqual([
      'planys-technologies',
    ]);
    expect(filterCompanies(verifiedCompanies, { ...filters, area: 'Taramani' })).toEqual([]);
  });
  it('only treats imported open roles as hiring', () => {
    const filters = parseFilters(new URLSearchParams('hiring=1'));
    expect(filterCompanies(verifiedCompanies, filters)).toEqual([]);
    expect(
      filterCompanies(verifiedCompanies, filters, ['agnikul-cosmos']).map((c) => c.slug),
    ).toEqual(['agnikul-cosmos']);
  });
  it('handles case spaces and unknown search terms', () => {
    expect(
      filterCompanies(verifiedCompanies, parseFilters(new URLSearchParams('q=+AGNiKUL+'))),
    ).toHaveLength(1);
    expect(
      filterCompanies(verifiedCompanies, parseFilters(new URLSearchParams('q=OrbitPay'))),
    ).toHaveLength(0);
  });
});
