import type { Company, DirectoryFilters } from './types';
export function parseFilters(params: URLSearchParams): DirectoryFilters {
  return {
    query: (params.get('q') || '').slice(0, 150),
    sector: params.get('sector') || '',
    area: params.get('area') || '',
    kind: params.get('kind') || '',
    hiring: params.get('hiring') === '1',
  };
}
export function filterCompanies(
  companies: Company[],
  filters: DirectoryFilters,
  hiringSlugs: string[] = [],
): Company[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return companies
    .filter(
      (c) =>
        (!query ||
          [c.name, c.description, c.sector, c.area]
            .join(' ')
            .toLocaleLowerCase()
            .includes(query)) &&
        (!filters.sector || c.sector === filters.sector) &&
        (!filters.area || c.area === filters.area) &&
        (!filters.kind || c.kind === filters.kind) &&
        (!filters.hiring || hiringSlugs.includes(c.slug)),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}
