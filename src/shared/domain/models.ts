/**
 * Core Domain Models for Portfolio Application
 *
 * These represent the business domain entities with proper typing
 * and validation. They are independent of external data sources.
 */

export interface Technology {
  readonly name: string;
  readonly category: "frontend" | "backend" | "database" | "tool" | "cloud" | "mobile";
  readonly proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface ProjectReview {
  readonly rating: number; // 1-5
  readonly comment: string;
  readonly reviewer: string;
  readonly position: string;
  readonly date?: Date;
}

export interface ProjectSupport {
  readonly title: string;
  readonly description: string;
  readonly amounts: ReadonlyArray<{
    readonly amount: number;
    readonly label: string;
    readonly currency: "INR" | "USD" | "EUR";
  }>;
}

export interface ProjectLinks {
  readonly live?: string | undefined;
  readonly github?: string | undefined;
  readonly demo?: string | undefined;
  readonly documentation?: string | undefined;
}

export interface ProjectMetadata {
  readonly featured: boolean;
  readonly status: "completed" | "in-progress" | "maintenance" | "deprecated";
  readonly visibility: "public" | "private" | "client-only";
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Core Project Domain Model
 *
 * Represents a project entity with all its properties and business rules
 */
export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly longDescription?: string | undefined;
  readonly image: string;
  readonly technologies: ReadonlyArray<Technology>;
  readonly links: ProjectLinks;
  readonly category: "web" | "mobile" | "desktop" | "api" | "library" | "tool";
  readonly metadata: ProjectMetadata;
  readonly review?: ProjectReview | undefined;
  readonly support?: ProjectSupport | undefined;
}

/**
 * Freelance Project Domain Model
 *
 * Extends Project with freelance-specific properties
 */
export interface FreelanceProject extends Project {
  readonly client: string;
  readonly role: string;
  readonly duration: string;
  readonly budget?:
    | {
        readonly amount: number;
        readonly currency: "INR" | "USD" | "EUR";
        readonly type: "fixed" | "hourly";
      }
    | undefined;
  readonly testimonial?:
    | {
        readonly quote: string;
        readonly clientName: string;
        readonly clientPosition: string;
        readonly clientCompany: string;
      }
    | undefined;
}

/**
 * Value Objects for common domain concepts
 */
export class ProjectId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("ProjectId cannot be empty");
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: ProjectId): boolean {
    return this.value === other.value;
  }
}

export class Rating {
  constructor(private readonly value: number) {
    if (value < 1 || value > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
  }

  get score(): number {
    return this.value;
  }

  isHighRating(): boolean {
    return this.value >= 4;
  }
}

/**
 * Domain Services for business logic
 */
export class ProjectDomainService {
  static isProjectFeatured(project: Project): boolean {
    return project.metadata.featured && project.metadata.status === "completed";
  }

  static getProjectScore(project: Project): number {
    let score = 0;

    // Base score from completion status
    switch (project.metadata.status) {
      case "completed":
        score += 10;
        break;
      case "in-progress":
        score += 7;
        break;
      case "maintenance":
        score += 8;
        break;
      default:
        score += 3;
    }

    // Bonus for reviews
    if (project.review) {
      score += project.review.rating * 2;
    }

    // Bonus for technology diversity
    const techCategories = new Set(project.technologies.map((t) => t.category));
    score += techCategories.size;

    // Featured projects get bonus
    if (project.metadata.featured) {
      score += 5;
    }

    return score;
  }

  static sortProjectsByImportance(projects: ReadonlyArray<Project>): ReadonlyArray<Project> {
    return [...projects].sort((a, b) => {
      const scoreA = this.getProjectScore(a);
      const scoreB = this.getProjectScore(b);
      return scoreB - scoreA;
    });
  }

  static filterProjectsByTechnology(
    projects: ReadonlyArray<Project>,
    technology: string
  ): ReadonlyArray<Project> {
    return projects.filter((project) =>
      project.technologies.some((tech) =>
        tech.name.toLowerCase().includes(technology.toLowerCase())
      )
    );
  }

  static getProjectsByCategory(
    projects: ReadonlyArray<Project>,
    category: Project["category"]
  ): ReadonlyArray<Project> {
    return projects.filter((project) => project.category === category);
  }
}
