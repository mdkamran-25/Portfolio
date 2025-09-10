/**
 * Service Layer - Application Services
 *
 * Services orchestrate business logic and coordinate between repositories,
 * external services, and domain models.
 */

import { Project, FreelanceProject, ProjectDomainService } from "../domain/models";
import {
  IProjectRepository,
  IFreelanceProjectRepository,
  StaticProjectDataSource,
  RepositoryFactory,
} from "../repositories/project-repository";

/**
 * Project Service Interface
 */
export interface IProjectService {
  getAllProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  searchProjects(query: string): Promise<Project[]>;
  getProjectsByCategory(category: Project["category"]): Promise<Project[]>;
  getProjectsByTechnology(technology: string): Promise<Project[]>;
  getProjectStats(): Promise<ProjectStats>;
}

/**
 * Freelance Project Service Interface
 */
export interface IFreelanceProjectService {
  getAllFreelanceProjects(): Promise<FreelanceProject[]>;
  getFeaturedFreelanceProjects(): Promise<FreelanceProject[]>;
  getFreelanceProjectById(id: string): Promise<FreelanceProject | null>;
  getFreelanceProjectsByClient(client: string): Promise<FreelanceProject[]>;
  getFreelanceProjectStats(): Promise<FreelanceProjectStats>;
}

/**
 * Statistics interfaces
 */
export interface ProjectStats {
  totalProjects: number;
  featuredProjects: number;
  categoriesCount: Record<Project["category"], number>;
  technologiesCount: Record<string, number>;
  completedProjects: number;
  averageRating: number;
}

export interface FreelanceProjectStats {
  totalProjects: number;
  totalClients: number;
  averageRating: number;
  totalRevenue?: number;
  topTechnologies: Array<{ name: string; count: number }>;
}

/**
 * Project Service Implementation
 */
export class ProjectService implements IProjectService {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async getAllProjects(): Promise<Project[]> {
    try {
      return await this.projectRepository.getAllProjects();
    } catch (error) {
      console.error("ProjectService: Failed to get all projects", error);
      throw new Error("Failed to load projects");
    }
  }

  async getFeaturedProjects(): Promise<Project[]> {
    try {
      return await this.projectRepository.getFeaturedProjects();
    } catch (error) {
      console.error("ProjectService: Failed to get featured projects", error);
      throw new Error("Failed to load featured projects");
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    if (!id || id.trim() === "") {
      throw new Error("Project ID is required");
    }

    try {
      return await this.projectRepository.getProjectById(id.trim());
    } catch (error) {
      console.error(`ProjectService: Failed to get project ${id}`, error);
      throw new Error(`Failed to load project with ID: ${id}`);
    }
  }

  async searchProjects(query: string): Promise<Project[]> {
    if (!query || query.trim() === "") {
      return this.getAllProjects();
    }

    try {
      return await this.projectRepository.searchProjects(query.trim());
    } catch (error) {
      console.error(`ProjectService: Failed to search projects with query "${query}"`, error);
      throw new Error("Failed to search projects");
    }
  }

  async getProjectsByCategory(category: Project["category"]): Promise<Project[]> {
    try {
      return await this.projectRepository.getProjectsByCategory(category);
    } catch (error) {
      console.error(`ProjectService: Failed to get projects by category "${category}"`, error);
      throw new Error(`Failed to load projects for category: ${category}`);
    }
  }

  async getProjectsByTechnology(technology: string): Promise<Project[]> {
    if (!technology || technology.trim() === "") {
      throw new Error("Technology name is required");
    }

    try {
      return await this.projectRepository.getProjectsByTechnology(technology.trim());
    } catch (error) {
      console.error(`ProjectService: Failed to get projects by technology "${technology}"`, error);
      throw new Error(`Failed to load projects for technology: ${technology}`);
    }
  }

  async getProjectStats(): Promise<ProjectStats> {
    try {
      const projects = await this.getAllProjects();

      // Calculate categories count
      const categoriesCount = projects.reduce(
        (acc, project) => {
          acc[project.category] = (acc[project.category] || 0) + 1;
          return acc;
        },
        {} as Record<Project["category"], number>
      );

      // Calculate technologies count
      const technologiesCount = projects.reduce(
        (acc, project) => {
          project.technologies.forEach((tech) => {
            acc[tech.name] = (acc[tech.name] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>
      );

      // Calculate other stats
      const featuredProjects = projects.filter((p) =>
        ProjectDomainService.isProjectFeatured(p)
      ).length;
      const completedProjects = projects.filter((p) => p.metadata.status === "completed").length;

      const projectsWithRatings = projects.filter((p) => p.review?.rating);
      const averageRating =
        projectsWithRatings.length > 0
          ? projectsWithRatings.reduce((sum, p) => sum + (p.review?.rating || 0), 0) /
            projectsWithRatings.length
          : 0;

      return {
        totalProjects: projects.length,
        featuredProjects,
        categoriesCount,
        technologiesCount,
        completedProjects,
        averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      };
    } catch (error) {
      console.error("ProjectService: Failed to get project stats", error);
      throw new Error("Failed to calculate project statistics");
    }
  }
}

/**
 * Freelance Project Service Implementation
 */
export class FreelanceProjectService implements IFreelanceProjectService {
  constructor(private readonly freelanceProjectRepository: IFreelanceProjectRepository) {}

  async getAllFreelanceProjects(): Promise<FreelanceProject[]> {
    try {
      return await this.freelanceProjectRepository.getAllFreelanceProjects();
    } catch (error) {
      console.error("FreelanceProjectService: Failed to get all freelance projects", error);
      throw new Error("Failed to load freelance projects");
    }
  }

  async getFeaturedFreelanceProjects(): Promise<FreelanceProject[]> {
    try {
      return await this.freelanceProjectRepository.getFeaturedFreelanceProjects();
    } catch (error) {
      console.error("FreelanceProjectService: Failed to get featured freelance projects", error);
      throw new Error("Failed to load featured freelance projects");
    }
  }

  async getFreelanceProjectById(id: string): Promise<FreelanceProject | null> {
    if (!id || id.trim() === "") {
      throw new Error("Freelance project ID is required");
    }

    try {
      return await this.freelanceProjectRepository.getFreelanceProjectById(id.trim());
    } catch (error) {
      console.error(`FreelanceProjectService: Failed to get freelance project ${id}`, error);
      throw new Error(`Failed to load freelance project with ID: ${id}`);
    }
  }

  async getFreelanceProjectsByClient(client: string): Promise<FreelanceProject[]> {
    if (!client || client.trim() === "") {
      throw new Error("Client name is required");
    }

    try {
      return await this.freelanceProjectRepository.getFreelanceProjectsByClient(client.trim());
    } catch (error) {
      console.error(`FreelanceProjectService: Failed to get projects by client "${client}"`, error);
      throw new Error(`Failed to load projects for client: ${client}`);
    }
  }

  async getFreelanceProjectStats(): Promise<FreelanceProjectStats> {
    try {
      const projects = await this.getAllFreelanceProjects();

      // Calculate unique clients
      const uniqueClients = new Set(projects.map((p) => p.client.toLowerCase())).size;

      // Calculate average rating
      const projectsWithRatings = projects.filter((p) => p.review?.rating);
      const averageRating =
        projectsWithRatings.length > 0
          ? projectsWithRatings.reduce((sum, p) => sum + (p.review?.rating || 0), 0) /
            projectsWithRatings.length
          : 0;

      // Calculate total revenue (if budget information is available)
      const totalRevenue = projects
        .filter((p) => p.budget?.amount)
        .reduce((sum, p) => sum + (p.budget?.amount || 0), 0);

      // Calculate top technologies
      const techCount = projects.reduce(
        (acc, project) => {
          project.technologies.forEach((tech) => {
            acc[tech.name] = (acc[tech.name] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>
      );

      const topTechnologies = Object.entries(techCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 technologies

      const result: FreelanceProjectStats = {
        totalProjects: projects.length,
        totalClients: uniqueClients,
        averageRating: Math.round(averageRating * 100) / 100,
        topTechnologies,
      };

      if (totalRevenue > 0) {
        result.totalRevenue = totalRevenue;
      }

      return result;
    } catch (error) {
      console.error("FreelanceProjectService: Failed to get freelance project stats", error);
      throw new Error("Failed to calculate freelance project statistics");
    }
  }
}

/**
 * Service Factory for creating service instances
 */
export class ServiceFactory {
  private static projectService: ProjectService | null = null;
  private static freelanceProjectService: FreelanceProjectService | null = null;

  /**
   * Create project service with static data source
   */
  static createProjectService(
    projectsData: any[],
    freelanceProjectsData: any[] = []
  ): ProjectService {
    if (!this.projectService) {
      const dataSource = new StaticProjectDataSource(projectsData, freelanceProjectsData);
      const repository = RepositoryFactory.createProjectRepository(dataSource);
      this.projectService = new ProjectService(repository);
    }
    return this.projectService;
  }

  /**
   * Create freelance project service with static data source
   */
  static createFreelanceProjectService(
    projectsData: any[],
    freelanceProjectsData: any[]
  ): FreelanceProjectService {
    if (!this.freelanceProjectService) {
      const dataSource = new StaticProjectDataSource(projectsData, freelanceProjectsData);
      const repository = RepositoryFactory.createFreelanceProjectRepository(dataSource);
      this.freelanceProjectService = new FreelanceProjectService(repository);
    }
    return this.freelanceProjectService;
  }

  /**
   * Create services with custom repositories (for testing or different data sources)
   */
  static createProjectServiceWithRepository(repository: IProjectRepository): ProjectService {
    return new ProjectService(repository);
  }

  static createFreelanceProjectServiceWithRepository(
    repository: IFreelanceProjectRepository
  ): FreelanceProjectService {
    return new FreelanceProjectService(repository);
  }

  /**
   * Reset all service instances
   */
  static reset(): void {
    this.projectService = null;
    this.freelanceProjectService = null;
    RepositoryFactory.reset();
  }
}
