import type { Company } from "@/lib/catalog/types";

// Source-backed bootstrap records. Runtime reads use the database once initialized.
// Coordinates are deliberately absent until a location can be verified.
export const verifiedCompanies: Company[] = [
  {
    slug: "agnikul-cosmos", name: "Agnikul Cosmos", sector: "Space & Deeptech", kind: "Startup",
    description: "Develops launch vehicles and launch services for small satellites.",
    area: "Taramani", address: "Rocket Factory I, A Block, IIT Madras Research Park, Chennai 600113",
    website: "https://agnikul.in/", careersUrl: "https://agnikul.in/careers/",
    sourceUrl: "https://agnikul.in/careers/", verifiedAt: "2026-09-10T00:00:00Z",
    latitude: null, longitude: null, locationPrecision: "unverified",
  },
  {
    slug: "garuda-aerospace", name: "Garuda Aerospace", sector: "Drones & Robotics", kind: "Scaleup",
    description: "Builds drones and provides drone services for agriculture, industry, and defence.",
    area: "Alwarpet", address: "24/46, Agni Business Centre, KB Dasan Road, Alwarpet, Chennai 600018",
    website: "https://www.garudaaerospace.com/", careersUrl: null,
    sourceUrl: "https://www.garudaaerospace.com/company/contact-us", verifiedAt: "2026-09-10T00:00:00Z",
    latitude: null, longitude: null, locationPrecision: "unverified",
  },
  {
    slug: "gofrugal", name: "Gofrugal", sector: "SaaS", kind: "Established",
    description: "Provides software for retail, restaurant, and distribution businesses.",
    area: "Kizhakottaiyur", address: "KRISP IT Park, 942 Kelambakkam–Vandalur Road, Kizhakottaiyur, Chennai 600127",
    website: "https://www.gofrugal.com/", careersUrl: null,
    sourceUrl: "https://www.gofrugal.com/contact.html", verifiedAt: "2026-09-10T00:00:00Z",
    latitude: null, longitude: null, locationPrecision: "unverified",
  },
  {
    slug: "hcl-guvi", name: "HCL GUVI", sector: "Edtech", kind: "Established",
    description: "Offers technology education and skills training in multiple languages; part of HCL Group.",
    area: "Taramani", address: "IITM Research Park, Phase 2, D Block, Kanagam Road, Taramani, Chennai 600113",
    website: "https://www.guvi.in/", careersUrl: null,
    sourceUrl: "https://www.guvi.in/contact/", verifiedAt: "2026-09-10T00:00:00Z",
    latitude: null, longitude: null, locationPrecision: "unverified",
  },
];
