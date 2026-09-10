export interface Company {
  slug: string;
  name: string;
  description: string;
  sector: string;
  kind: "Startup" | "Scaleup" | "Established";
  area: string;
  address: string;
  website: string;
  careersUrl: string | null;
  sourceUrl: string;
  verifiedAt: string;
  latitude: number | null;
  longitude: number | null;
  locationPrecision: "office" | "area" | "unverified";
}

export interface JobListing {
  id: string;
  companySlug: string;
  title: string;
  location: string;
  url: string;
  sourceUrl: string;
  observedAt: string;
  active: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  publisher: string;
  publishedAt: string | null;
  observedAt: string;
}

export interface DirectoryFilters {
  query: string;
  sector: string;
  area: string;
  kind: string;
  hiring: boolean;
}
