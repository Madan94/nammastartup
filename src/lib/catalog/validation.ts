import { z } from 'zod';
export const publicUrl = z
  .string()
  .trim()
  .max(500)
  .url()
  .refine((value) => {
    try {
      const u = new URL(value);
      return (
        u.protocol === 'https:' &&
        !u.username &&
        !u.password &&
        !u.port &&
        u.hostname.includes('.') &&
        !/^[\d.]+$/.test(u.hostname) &&
        !u.hostname.includes(':') &&
        !/\.(local|localhost|internal|test|invalid|example)$/.test(u.hostname)
      );
    } catch {
      return false;
    }
  }, 'Enter a public HTTPS website');
export const submissionSchema = z.object({
  name: z.string().trim().min(2).max(100),
  website: publicUrl,
  description: z.string().trim().min(15).max(500),
  sector: z.string().trim().min(2).max(80),
  area: z.string().trim().min(2).max(80),
  address: z.string().trim().min(10).max(300),
  email: z.string().trim().email().max(200),
  careersUrl: z.union([publicUrl, z.literal('')]).optional(),
  consent: z.literal(true),
  websiteConfirm: z.string().max(0).optional(),
});
export type CompanySubmission = z.infer<typeof submissionSchema>;
export const companySchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(100),
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().min(15).max(500),
    sector: z.string().trim().min(2).max(80),
    kind: z.enum(['Startup', 'Scaleup', 'Established']),
    area: z.string().trim().min(2).max(80),
    address: z.string().trim().min(10).max(300),
    website: publicUrl,
    careersUrl: publicUrl.nullable(),
    sourceUrl: publicUrl,
    verifiedAt: z.string().datetime(),
    latitude: z.number().min(12.5).max(13.6).nullable(),
    longitude: z.number().min(79.8).max(80.5).nullable(),
    locationPrecision: z.enum(['office', 'area', 'unverified']),
  })
  .refine(
    (c) => (c.latitude === null) === (c.longitude === null),
    'Supply both coordinates or neither',
  )
  .refine(
    (c) => (c.locationPrecision === 'unverified' ? c.latitude === null : c.latitude !== null),
    'Coordinate precision must match the location',
  );
export const correctionSchema = z.object({
  companySlug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
  description: z.string().trim().min(15).max(1500),
  sourceUrl: publicUrl,
  email: z.string().trim().email().max(200),
  consent: z.literal(true),
});
