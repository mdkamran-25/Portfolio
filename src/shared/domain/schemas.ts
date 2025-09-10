/**
 * Zod Schemas for Runtime Validation
 *
 * These schemas validate data coming from external sources (APIs, JSON files)
 * and ensure type safety at runtime.
 */

import { z } from "zod";

// Technology Schema
export const TechnologySchema = z.object({
  name: z.string().min(1, "Technology name is required"),
  category: z.enum(["frontend", "backend", "database", "tool", "cloud", "mobile"]),
  proficiencyLevel: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .optional()
    .default("intermediate"),
});

// Project Review Schema
export const ProjectReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Review comment is required"),
  reviewer: z.string().min(1, "Reviewer name is required"),
  position: z.string().min(1, "Reviewer position is required"),
  date: z.coerce.date().optional(),
});

// Project Support Schema
export const ProjectSupportSchema = z.object({
  title: z.string().min(1, "Support title is required"),
  description: z.string().min(1, "Support description is required"),
  amounts: z
    .array(
      z.object({
        amount: z.number().positive("Amount must be positive"),
        label: z.string().min(1, "Amount label is required"),
        currency: z.enum(["INR", "USD", "EUR"]).default("INR"),
      })
    )
    .min(1, "At least one support amount is required"),
});

// Project Links Schema
export const ProjectLinksSchema = z
  .object({
    live: z.string().url().optional(),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    documentation: z.string().url().optional(),
  })
  .refine((links) => Object.values(links).some((link) => link !== undefined), {
    message: "At least one project link is required",
  });

// Project Metadata Schema
export const ProjectMetadataSchema = z.object({
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "maintenance", "deprecated"]).default("completed"),
  visibility: z.enum(["public", "private", "client-only"]).default("public"),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

// Core Project Schema
export const ProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(10, "Project description must be at least 10 characters"),
  longDescription: z.string().optional(),
  image: z.string().min(1, "Project image is required"),
  technologies: z.array(TechnologySchema).min(1, "At least one technology is required"),
  links: ProjectLinksSchema,
  category: z.enum(["web", "mobile", "desktop", "api", "library", "tool"]).default("web"),
  metadata: ProjectMetadataSchema.optional().default(() => ({
    featured: false,
    status: "completed" as const,
    visibility: "public" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  review: ProjectReviewSchema.optional(),
  support: ProjectSupportSchema.optional(),
});

// Freelance Project Schema
export const FreelanceProjectSchema = ProjectSchema.extend({
  client: z.string().min(1, "Client name is required"),
  role: z.string().min(1, "Role is required"),
  duration: z.string().min(1, "Duration is required"),
  budget: z
    .object({
      amount: z.number().positive("Budget amount must be positive"),
      currency: z.enum(["INR", "USD", "EUR"]).default("INR"),
      type: z.enum(["fixed", "hourly"]).default("fixed"),
    })
    .optional(),
  testimonial: z
    .object({
      quote: z.string().min(10, "Testimonial quote must be at least 10 characters"),
      clientName: z.string().min(1, "Client name is required"),
      clientPosition: z.string().min(1, "Client position is required"),
      clientCompany: z.string().min(1, "Client company is required"),
    })
    .optional(),
});

// Raw JSON Schemas (for external data sources)
export const RawProjectDataSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((val) => String(val)),
  title: z.string(),
  description: z.string(),
  longDescription: z.string().optional(),
  image: z.string(),
  technologies: z.array(
    z.union([
      z.string(), // Simple string format
      TechnologySchema, // Full object format
    ])
  ),
  links: z.union([
    ProjectLinksSchema,
    z.object({
      live: z.string().optional(),
      github: z.string().optional(),
      demo: z.string().optional(),
      documentation: z.string().optional(),
    }),
  ]),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.string().optional(),
  review: z
    .union([
      ProjectReviewSchema,
      z.object({
        rating: z.number(),
        comment: z.string(),
        reviewer: z.string(),
        position: z.string(),
      }),
    ])
    .optional(),
  support: ProjectSupportSchema.optional(),
  // Legacy fields for backward compatibility
  tech: z.array(z.string()).optional(), // Alternative to technologies
  liveUrl: z.string().optional(), // Alternative to links.live
  githubUrl: z.string().optional(), // Alternative to links.github
});

export const RawFreelanceProjectDataSchema = RawProjectDataSchema.extend({
  client: z.string(),
  role: z.string(),
  duration: z.string(),
  budget: z
    .union([
      z.number(), // Simple number format
      z.object({
        amount: z.number(),
        currency: z.string().optional(),
        type: z.string().optional(),
      }),
    ])
    .optional(),
  testimonial: z
    .object({
      quote: z.string(),
      clientName: z.string(),
      clientPosition: z.string(),
      clientCompany: z.string(),
    })
    .optional(),
});

// Type inference from schemas
export type ProjectSchemaType = z.infer<typeof ProjectSchema>;
export type FreelanceProjectSchemaType = z.infer<typeof FreelanceProjectSchema>;
export type RawProjectDataType = z.infer<typeof RawProjectDataSchema>;
export type RawFreelanceProjectDataType = z.infer<typeof RawFreelanceProjectDataSchema>;

/**
 * Validation helpers
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ProjectValidator {
  static validateProject(data: unknown): ProjectSchemaType {
    try {
      return ProjectSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        if (firstError) {
          throw new ValidationError(
            `Validation failed: ${firstError.message}`,
            firstError.path.join("."),
            firstError.code
          );
        }
        throw new ValidationError("Validation failed", "unknown", data);
      }
      throw error;
    }
  }

  static validateFreelanceProject(data: unknown): FreelanceProjectSchemaType {
    try {
      return FreelanceProjectSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        if (firstError) {
          throw new ValidationError(
            `Validation failed: ${firstError.message}`,
            firstError.path.join("."),
            firstError.code
          );
        }
        throw new ValidationError("Validation failed", "unknown", data);
      }
      throw error;
    }
  }

  static validateRawProjectData(data: unknown): RawProjectDataType {
    try {
      return RawProjectDataSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        if (firstError) {
          throw new ValidationError(
            `Raw data validation failed: ${firstError.message}`,
            firstError.path.join("."),
            firstError.code
          );
        }
        throw new ValidationError("Raw data validation failed", "unknown", data);
      }
      throw error;
    }
  }

  static safeValidateProject(
    data: unknown
  ): { success: true; data: ProjectSchemaType } | { success: false; error: ValidationError } {
    try {
      const validatedData = this.validateProject(data);
      return { success: true, data: validatedData };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ValidationError
            ? error
            : new ValidationError("Unknown validation error", "unknown", data),
      };
    }
  }
}
