import { z } from "zod";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

export const SocialSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  icon: z.string(), // lucide or react-icons key string
});

export const ProfileSchema = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string(),
  bio: z.string(),
  location: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  resumeUrl: z.string(),
  socials: z.array(SocialSchema),
});

export const SectionMetaSchema = z.object({
  id: z.string(),
  label: z.string(),
  visible: z.boolean(),
  order: z.number().int().nonnegative(),
});

export const ExperienceItemSchema = z.object({
  id: z.string(),
  role: z.string(),
  company: z.string(),
  startDate: z.string(), // "YYYY-MM" or "YYYY"
  endDate: z.string().optional(), // omit = present
  location: z.string(),
  responsibilities: z.array(z.string()),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  tags: z.array(z.string()),
});

export const SkillGroupSchema = z.object({
  category: z.string(),
  items: z.array(z.string()),
});

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  verifyUrl: z.string().url().optional(),
  badgeUrl: z.string().optional(),
  description: z.string().optional(),
});

export const EducationSchema = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const CaseStudyBlockSchema = z.object({
  title: z.string(),
  content: z.string(),
  icon: z.string().optional(),
});

export const CaseStudySchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  blocks: z.array(CaseStudyBlockSchema),
});

export const ThemeSchema = z.object({
  defaultMode: z.enum(["dark", "light", "system"]),
  accentColor: z.string(), // HSL string e.g. "173 58% 45%"
  fontHeading: z.string(),
  fontBody: z.string(),
  blurIntensity: z.number().min(0).max(20), // px
  grainIntensity: z.number().min(0).max(10), // percent
  radius: z.number().min(0).max(2), // rem
});

export const SeoSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string().optional(),
});

export const SiteContentSchema = z.object({
  profile: ProfileSchema,
  sections: z.array(SectionMetaSchema),
  experience: z.array(ExperienceItemSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(SkillGroupSchema),
  certifications: z.array(CertificationSchema),
  education: z.array(EducationSchema),
  caseStudies: z.array(CaseStudySchema),
  theme: ThemeSchema,
  seo: SeoSchema,
});

// ─── Inferred TypeScript types ─────────────────────────────────────────────────

export type Social = z.infer<typeof SocialSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type SectionMeta = z.infer<typeof SectionMetaSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type CaseStudyBlock = z.infer<typeof CaseStudyBlockSchema>;
export type CaseStudy = z.infer<typeof CaseStudySchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Seo = z.infer<typeof SeoSchema>;
export type SiteContent = z.infer<typeof SiteContentSchema>;
