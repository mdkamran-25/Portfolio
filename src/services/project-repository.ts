import { appConfig } from "@/config";
import { Project, FreelanceProject, ProjectFilters, SortOptions, PaginationOptions } from "@/types";

/**
 * Project Repository - handles all project data operations
 * Currently uses static data, can be easily swapped for API calls
 */
export class ProjectRepository {
  private static instance: ProjectRepository;
  private projects: Project[] = [];
  private freelanceProjects: FreelanceProject[] = [];

  private constructor() {
    // Initialize with static data (will be replaced with API calls)
    this.loadStaticData();
  }

  static getInstance(): ProjectRepository {
    if (!ProjectRepository.instance) {
      ProjectRepository.instance = new ProjectRepository();
    }
    return ProjectRepository.instance;
  }

  /**
   * Load static data from constants
   * This method will be replaced when we add API integration
   */
  private async loadStaticData() {
    try {
      // Import existing project data
      const { featuredProjects, freelanceProjects } = await import("@/constants/projects");

      // Transform existing data to new Project interface
      this.projects = featuredProjects.map((project: any, index: number) => ({
        id: project.id || `project-${index}`,
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.tech.map((tech: string, techIndex: number) => ({
          id: `tech-${tech}-${techIndex}`,
          name: tech,
          category: this.getTechnologyCategory(tech),
        })),
        liveUrl: project.demoLink,
        githubUrl: project.link,
        category: this.mapToProjectCategory("web-app"),
        featured: true, // All featured projects are featured
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Transform freelance projects
      this.freelanceProjects = freelanceProjects.map((project: any, index: number) => ({
        id: project.id || `freelance-${index}`,
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.tech.map((tech: string, techIndex: number) => ({
          id: `tech-${tech}-${techIndex}`,
          name: tech,
          category: this.getTechnologyCategory(tech),
        })),
        budget: project.support?.amounts[0]?.amount || 1000,
        currency: "USD",
        duration: project.duration || "1 month",
        clientName: project.client,
        status: "completed" as const,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.warn("Could not load static project data:", error);
      this.projects = [];
      this.freelanceProjects = [];
    }
  }

  /**
   * Get all featured projects
   */
  async getFeaturedProjects(): Promise<Project[]> {
    return this.projects.filter((project) => project.featured);
  }

  /**
   * Get all projects with filtering, sorting, and pagination
   */
  async getProjects(
    filters?: ProjectFilters,
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<{
    projects: Project[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    let filteredProjects = [...this.projects];

    // Apply filters
    if (filters) {
      if (filters.category?.length) {
        filteredProjects = filteredProjects.filter((p) => filters.category!.includes(p.category));
      }

      if (filters.technologies?.length) {
        filteredProjects = filteredProjects.filter((p) =>
          p.technologies.some((tech) => filters.technologies!.includes(tech.name.toLowerCase()))
        );
      }

      if (filters.featured !== undefined) {
        filteredProjects = filteredProjects.filter((p) => p.featured === filters.featured);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProjects = filteredProjects.filter(
          (p) =>
            p.title.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.technologies.some((tech) => tech.name.toLowerCase().includes(searchTerm))
        );
      }
    }

    // Apply sorting
    if (sort) {
      filteredProjects.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];

        if (sort.direction === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || appConfig.ui.itemsPerPage;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    const total = filteredProjects.length;
    const totalPages = Math.ceil(total / limit);

    return {
      projects: paginatedProjects,
      total,
      page,
      totalPages,
    };
  }

  /**
   * Get a single project by ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    return this.projects.find((project) => project.id === id) || null;
  }

  /**
   * Get all freelance projects
   */
  async getFreelanceProjects(): Promise<FreelanceProject[]> {
    return this.freelanceProjects;
  }

  /**
   * Get all unique technologies
   */
  async getTechnologies(): Promise<string[]> {
    const techSet = new Set<string>();
    this.projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        techSet.add(tech.name);
      });
    });
    return Array.from(techSet).sort();
  }

  /**
   * Get project statistics
   */
  async getProjectStats(): Promise<{
    total: number;
    featured: number;
    byCategory: Record<string, number>;
    byTechnology: Record<string, number>;
  }> {
    const total = this.projects.length;
    const featured = this.projects.filter((p) => p.featured).length;

    const byCategory: Record<string, number> = {};
    const byTechnology: Record<string, number> = {};

    this.projects.forEach((project) => {
      // Count by category
      byCategory[project.category] = (byCategory[project.category] || 0) + 1;

      // Count by technology
      project.technologies.forEach((tech) => {
        byTechnology[tech.name] = (byTechnology[tech.name] || 0) + 1;
      });
    });

    return {
      total,
      featured,
      byCategory,
      byTechnology,
    };
  }

  /**
   * Helper method to map technology to category
   */
  private getTechnologyCategory(
    tech: string
  ): "frontend" | "backend" | "database" | "devops" | "mobile" | "design" | "other" {
    const frontendTech = [
      "react",
      "next.js",
      "typescript",
      "javascript",
      "html",
      "css",
      "tailwind css",
      "vue",
      "angular",
    ];
    const backendTech = [
      "node.js",
      "express",
      "nestjs",
      "python",
      "django",
      "flask",
      "php",
      "java",
      "spring",
    ];
    const databaseTech = ["mongodb", "postgresql", "mysql", "redis", "firebase", "supabase"];
    const devopsTech = ["docker", "kubernetes", "aws", "vercel", "netlify", "github actions"];
    const mobileTech = ["react native", "flutter", "swift", "kotlin"];
    const designTech = ["figma", "adobe xd", "sketch", "photoshop"];

    const lowerTech = tech.toLowerCase();

    if (frontendTech.includes(lowerTech)) return "frontend";
    if (backendTech.includes(lowerTech)) return "backend";
    if (databaseTech.includes(lowerTech)) return "database";
    if (devopsTech.includes(lowerTech)) return "devops";
    if (mobileTech.includes(lowerTech)) return "mobile";
    if (designTech.includes(lowerTech)) return "design";

    return "other";
  }

  /**
   * Helper method to map to project category
   */
  private mapToProjectCategory(
    category: string
  ): "web-app" | "mobile-app" | "desktop-app" | "library" | "tool" | "other" {
    switch (category.toLowerCase()) {
      case "web":
      case "web-app":
      case "website":
        return "web-app";
      case "mobile":
      case "mobile-app":
        return "mobile-app";
      case "desktop":
      case "desktop-app":
        return "desktop-app";
      case "library":
      case "package":
        return "library";
      case "tool":
      case "cli":
        return "tool";
      default:
        return "other";
    }
  }
}

// Export singleton instance
export const projectRepository = ProjectRepository.getInstance();
