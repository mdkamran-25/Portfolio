/**
 * Data Mappers for converting between DTOs and Domain Models
 *
 * Mappers handle the transformation of external data formats (JSON, API responses)
 * into clean domain models that the application can work with.
 */

import {
  Project,
  FreelanceProject,
  Technology,
  ProjectLinks,
  ProjectMetadata,
  ProjectReview,
} from "../domain/models";
import {
  RawProjectDataType,
  RawFreelanceProjectDataType,
  ProjectValidator,
} from "../domain/schemas";

/**
 * Technology Mapper
 */
export class TechnologyMapper {
  static fromString(techName: string): Technology {
    // Smart categorization based on technology name
    const name = techName.toLowerCase();
    let category: Technology["category"] = "tool";
    let proficiencyLevel: Technology["proficiencyLevel"] = "intermediate";

    // Frontend technologies
    if (
      [
        "react",
        "vue",
        "angular",
        "html",
        "css",
        "javascript",
        "typescript",
        "tailwind",
        "sass",
        "less",
      ].includes(name)
    ) {
      category = "frontend";
    }
    // Backend technologies
    else if (
      [
        "node.js",
        "express",
        "nestjs",
        "python",
        "django",
        "flask",
        "java",
        "spring",
        "php",
        "laravel",
      ].includes(name)
    ) {
      category = "backend";
    }
    // Database technologies
    else if (["mongodb", "mysql", "postgresql", "redis", "sqlite", "firebase"].includes(name)) {
      category = "database";
    }
    // Cloud technologies
    else if (["aws", "azure", "gcp", "vercel", "netlify", "heroku", "docker"].includes(name)) {
      category = "cloud";
    }
    // Mobile technologies
    else if (["react native", "flutter", "ionic", "xamarin", "swift", "kotlin"].includes(name)) {
      category = "mobile";
    }

    // Determine proficiency level (this could be enhanced with user input)
    const expertTechs = ["react", "javascript", "typescript", "node.js", "mongodb"];
    const advancedTechs = ["express", "tailwind", "firebase", "next.js"];

    if (expertTechs.includes(name)) {
      proficiencyLevel = "expert";
    } else if (advancedTechs.includes(name)) {
      proficiencyLevel = "advanced";
    }

    return {
      name: techName, // Keep original casing
      category,
      proficiencyLevel,
    };
  }

  static fromRawData(tech: string | Technology): Technology {
    if (typeof tech === "string") {
      return this.fromString(tech);
    }
    return tech;
  }
}

/**
 * Project Links Mapper
 */
export class ProjectLinksMapper {
  static fromRawData(rawData: RawProjectDataType): ProjectLinks {
    return {
      ...(rawData.links?.live || rawData.liveUrl
        ? { live: rawData.links?.live || rawData.liveUrl }
        : {}),
      ...(rawData.links?.github || rawData.githubUrl
        ? { github: rawData.links?.github || rawData.githubUrl }
        : {}),
      ...(rawData.links?.demo ? { demo: rawData.links.demo } : {}),
      ...(rawData.links?.documentation ? { documentation: rawData.links.documentation } : {}),
    };
  }
}

/**
 * Project Metadata Mapper
 */
export class ProjectMetadataMapper {
  static fromRawData(rawData: RawProjectDataType): ProjectMetadata {
    return {
      featured: rawData.featured ?? false,
      status: (rawData.status as ProjectMetadata["status"]) ?? "completed",
      visibility: "public", // Default for portfolio projects
      createdAt: new Date(), // Could be enhanced with actual creation date
      updatedAt: new Date(),
    };
  }
}

/**
 * Project Review Mapper
 */
export class ProjectReviewMapper {
  static fromRawData(rawData: any): ProjectReview | undefined {
    if (!rawData.review) return undefined;

    const review = rawData.review;
    return {
      rating: review.rating,
      comment: review.comment,
      reviewer: review.reviewer,
      position: review.position,
      date: review.date ? new Date(review.date) : new Date(),
    };
  }
}

/**
 * Main Project Mapper
 */
export class ProjectMapper {
  /**
   * Maps raw project data to domain model
   */
  static fromRawData(rawData: RawProjectDataType): Project {
    // Validate raw data first
    const validatedData = ProjectValidator.validateRawProjectData(rawData);

    // Map technologies
    const technologies = (validatedData.technologies || validatedData.tech || []).map((tech) =>
      TechnologyMapper.fromRawData(tech)
    );

    // Map links
    const links = ProjectLinksMapper.fromRawData(validatedData);

    // Map metadata
    const metadata = ProjectMetadataMapper.fromRawData(validatedData);

    // Map review
    const review = ProjectReviewMapper.fromRawData(validatedData);

    // Determine category
    let category: Project["category"] = "web";
    if (validatedData.category) {
      const cat = validatedData.category.toLowerCase();
      if (["web", "mobile", "desktop", "api", "library", "tool"].includes(cat)) {
        category = cat as Project["category"];
      }
    }

    return {
      id: validatedData.id,
      title: validatedData.title,
      description: validatedData.description,
      longDescription: validatedData.longDescription,
      image: validatedData.image,
      technologies,
      links,
      category,
      metadata,
      review,
      support: validatedData.support,
    };
  }

  /**
   * Maps array of raw project data to domain models
   */
  static fromRawDataArray(rawDataArray: RawProjectDataType[]): Project[] {
    return rawDataArray
      .map((rawData) => {
        try {
          return this.fromRawData(rawData);
        } catch (error) {
          console.error(`Failed to map project ${rawData.id || "unknown"}:`, error);
          return null;
        }
      })
      .filter((project): project is Project => project !== null);
  }

  /**
   * Maps domain model back to DTO (for API calls)
   */
  static toDTO(project: Project): RawProjectDataType {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      image: project.image,
      technologies: [...project.technologies],
      links: { ...project.links },
      category: project.category,
      featured: project.metadata.featured,
      status: project.metadata.status,
      review: project.review,
      support: project.support
        ? {
            title: project.support.title,
            description: project.support.description,
            amounts: project.support.amounts.map((amount) => ({ ...amount })),
          }
        : undefined,
    };
  }
}

/**
 * Freelance Project Mapper
 */
export class FreelanceProjectMapper {
  /**
   * Maps raw freelance project data to domain model
   */
  static fromRawData(rawData: RawFreelanceProjectDataType): FreelanceProject {
    // First map the base project
    const baseProject = ProjectMapper.fromRawData(rawData);

    // Add freelance-specific properties
    const budget = rawData.budget
      ? {
          amount: typeof rawData.budget === "number" ? rawData.budget : rawData.budget.amount,
          currency:
            typeof rawData.budget === "object" && rawData.budget.currency
              ? (rawData.budget.currency as "INR" | "USD" | "EUR")
              : ("INR" as const),
          type:
            typeof rawData.budget === "object" && rawData.budget.type
              ? (rawData.budget.type as "fixed" | "hourly")
              : ("fixed" as const),
        }
      : undefined;

    return {
      ...baseProject,
      client: rawData.client,
      role: rawData.role,
      duration: rawData.duration,
      budget,
      testimonial: rawData.testimonial,
    };
  }

  /**
   * Maps array of raw freelance project data to domain models
   */
  static fromRawDataArray(rawDataArray: RawFreelanceProjectDataType[]): FreelanceProject[] {
    return rawDataArray
      .map((rawData) => {
        try {
          return this.fromRawData(rawData);
        } catch (error) {
          console.error(`Failed to map freelance project ${rawData.id || "unknown"}:`, error);
          return null;
        }
      })
      .filter((project): project is FreelanceProject => project !== null);
  }

  /**
   * Maps domain model back to DTO
   */
  static toDTO(project: FreelanceProject): RawFreelanceProjectDataType {
    return {
      ...ProjectMapper.toDTO(project),
      client: project.client,
      role: project.role,
      duration: project.duration,
      budget: project.budget,
      testimonial: project.testimonial,
    };
  }
}

/**
 * Mapper utilities for common transformations
 */
export class MapperUtils {
  /**
   * Safely parse date strings
   */
  static parseDate(dateInput: string | Date | undefined): Date | undefined {
    if (!dateInput) return undefined;
    if (dateInput instanceof Date) return dateInput;

    try {
      const parsed = new Date(dateInput);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch {
      return undefined;
    }
  }

  /**
   * Normalize URL format
   */
  static normalizeUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;

    // Add https:// if protocol is missing
    if (url.startsWith("//")) {
      return `https:${url}`;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }

    return url;
  }

  /**
   * Clean and validate project ID
   */
  static normalizeId(id: string | number): string {
    return String(id)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  /**
   * Extract technology names from various formats
   */
  static extractTechnologyNames(techs: (string | Technology | { name: string })[]): string[] {
    return techs.map((tech) => {
      if (typeof tech === "string") return tech;
      if ("name" in tech) return tech.name;
      return String(tech);
    });
  }
}
