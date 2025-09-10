/**
 * Repository Pattern Implementation
 *
 * Repositories abstract data access logic and provide a clean interface
 * for the application to work with domain models.
 */

import { Project, FreelanceProject, ProjectDomainService } from "../domain/models";
import { ProjectMapper, FreelanceProjectMapper } from "../mappers/project-mapper";
import { RawProjectDataType, RawFreelanceProjectDataType } from "../domain/schemas";

/**
 * Repository interface for projects
 */
export interface IProjectRepository {
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectsByCategory(category: Project["category"]): Promise<Project[]>;
  searchProjects(query: string): Promise<Project[]>;
  getProjectsByTechnology(technology: string): Promise<Project[]>;
}

/**
 * Repository interface for freelance projects
 */
export interface IFreelanceProjectRepository {
  getAllFreelanceProjects(): Promise<FreelanceProject[]>;
  getFreelanceProjectById(id: string): Promise<FreelanceProject | null>;
  getFreelanceProjectsByClient(client: string): Promise<FreelanceProject[]>;
  getFeaturedFreelanceProjects(): Promise<FreelanceProject[]>;
}

/**
 * Data source interface for abstracting external data
 */
export interface IProjectDataSource {
  fetchProjects(): Promise<RawProjectDataType[]>;
  fetchFreelanceProjects(): Promise<RawFreelanceProjectDataType[]>;
}

/**
 * Static JSON file data source implementation
 */
export class StaticProjectDataSource implements IProjectDataSource {
  constructor(
    private readonly projectsData: RawProjectDataType[],
    private readonly freelanceProjectsData: RawFreelanceProjectDataType[]
  ) {}

  async fetchProjects(): Promise<RawProjectDataType[]> {
    // Simulate async operation (could be file reading, API call, etc.)
    return Promise.resolve([...this.projectsData]);
  }

  async fetchFreelanceProjects(): Promise<RawFreelanceProjectDataType[]> {
    return Promise.resolve([...this.freelanceProjectsData]);
  }
}

/**
 * Future API data source implementation
 */
export class ApiProjectDataSource implements IProjectDataSource {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey?: string
  ) {}

  async fetchProjects(): Promise<RawProjectDataType[]> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (this.apiKey) {
        headers["Authorization"] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}/projects`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.projects || [];
    } catch (error) {
      console.error("Failed to fetch projects from API:", error);
      throw new Error("Failed to fetch projects from API");
    }
  }

  async fetchFreelanceProjects(): Promise<RawFreelanceProjectDataType[]> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (this.apiKey) {
        headers["Authorization"] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}/freelance-projects`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.freelanceProjects || [];
    } catch (error) {
      console.error("Failed to fetch freelance projects from API:", error);
      throw new Error("Failed to fetch freelance projects from API");
    }
  }
}

/**
 * Project Repository Implementation
 */
export class ProjectRepository implements IProjectRepository {
  private projectsCache: Project[] | null = null;
  private cacheExpiry: number = 0;
  private readonly cacheLifetime = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly dataSource: IProjectDataSource) {}

  private async getProjectsFromCache(): Promise<Project[]> {
    const now = Date.now();

    if (this.projectsCache && now < this.cacheExpiry) {
      return this.projectsCache;
    }

    try {
      const rawProjects = await this.dataSource.fetchProjects();
      const mappedProjects = ProjectMapper.fromRawDataArray(rawProjects);

      // Sort by importance using domain service
      const sortedProjects = ProjectDomainService.sortProjectsByImportance(mappedProjects);

      this.projectsCache = [...sortedProjects];
      this.cacheExpiry = now + this.cacheLifetime;

      return this.projectsCache;
    } catch (error) {
      console.error("Failed to load projects:", error);

      // Return cached data if available, even if expired
      if (this.projectsCache) {
        console.warn("Using expired cache due to fetch failure");
        return this.projectsCache;
      }

      throw error;
    }
  }

  async getAllProjects(): Promise<Project[]> {
    return this.getProjectsFromCache();
  }

  async getProjectById(id: string): Promise<Project | null> {
    const projects = await this.getProjectsFromCache();
    return projects.find((project) => project.id === id) || null;
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const projects = await this.getProjectsFromCache();
    return projects.filter((project) => ProjectDomainService.isProjectFeatured(project));
  }

  async getProjectsByCategory(category: Project["category"]): Promise<Project[]> {
    const projects = await this.getProjectsFromCache();
    return [...ProjectDomainService.getProjectsByCategory(projects, category)];
  }

  async searchProjects(query: string): Promise<Project[]> {
    const projects = await this.getProjectsFromCache();
    const searchTerm = query.toLowerCase();

    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some((tech) => tech.name.toLowerCase().includes(searchTerm))
    );
  }

  async getProjectsByTechnology(technology: string): Promise<Project[]> {
    const projects = await this.getProjectsFromCache();
    return [...ProjectDomainService.filterProjectsByTechnology(projects, technology)];
  }

  /**
   * Clear cache manually (useful for testing or data refresh)
   */
  clearCache(): void {
    this.projectsCache = null;
    this.cacheExpiry = 0;
  }
}

/**
 * Freelance Project Repository Implementation
 */
export class FreelanceProjectRepository implements IFreelanceProjectRepository {
  private freelanceProjectsCache: FreelanceProject[] | null = null;
  private cacheExpiry: number = 0;
  private readonly cacheLifetime = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly dataSource: IProjectDataSource) {}

  private async getFreelanceProjectsFromCache(): Promise<FreelanceProject[]> {
    const now = Date.now();

    if (this.freelanceProjectsCache && now < this.cacheExpiry) {
      return this.freelanceProjectsCache;
    }

    try {
      const rawProjects = await this.dataSource.fetchFreelanceProjects();
      const mappedProjects = FreelanceProjectMapper.fromRawDataArray(rawProjects);

      // Sort by importance using domain service
      const sortedProjects = ProjectDomainService.sortProjectsByImportance(mappedProjects);

      this.freelanceProjectsCache = [...sortedProjects] as FreelanceProject[];
      this.cacheExpiry = now + this.cacheLifetime;

      return this.freelanceProjectsCache;
    } catch (error) {
      console.error("Failed to load freelance projects:", error);

      // Return cached data if available, even if expired
      if (this.freelanceProjectsCache) {
        console.warn("Using expired freelance projects cache due to fetch failure");
        return this.freelanceProjectsCache;
      }

      throw error;
    }
  }

  async getAllFreelanceProjects(): Promise<FreelanceProject[]> {
    return this.getFreelanceProjectsFromCache();
  }

  async getFreelanceProjectById(id: string): Promise<FreelanceProject | null> {
    const projects = await this.getFreelanceProjectsFromCache();
    return projects.find((project) => project.id === id) || null;
  }

  async getFreelanceProjectsByClient(client: string): Promise<FreelanceProject[]> {
    const projects = await this.getFreelanceProjectsFromCache();
    return projects.filter((project) =>
      project.client.toLowerCase().includes(client.toLowerCase())
    );
  }

  async getFeaturedFreelanceProjects(): Promise<FreelanceProject[]> {
    const projects = await this.getFreelanceProjectsFromCache();
    return projects.filter((project) => ProjectDomainService.isProjectFeatured(project));
  }

  /**
   * Clear cache manually
   */
  clearCache(): void {
    this.freelanceProjectsCache = null;
    this.cacheExpiry = 0;
  }
}

/**
 * Repository factory for creating repository instances
 */
export class RepositoryFactory {
  private static projectRepository: ProjectRepository | null = null;
  private static freelanceProjectRepository: FreelanceProjectRepository | null = null;

  /**
   * Create or get existing project repository instance
   */
  static createProjectRepository(dataSource: IProjectDataSource): ProjectRepository {
    if (!this.projectRepository) {
      this.projectRepository = new ProjectRepository(dataSource);
    }
    return this.projectRepository;
  }

  /**
   * Create or get existing freelance project repository instance
   */
  static createFreelanceProjectRepository(
    dataSource: IProjectDataSource
  ): FreelanceProjectRepository {
    if (!this.freelanceProjectRepository) {
      this.freelanceProjectRepository = new FreelanceProjectRepository(dataSource);
    }
    return this.freelanceProjectRepository;
  }

  /**
   * Reset all repository instances (useful for testing)
   */
  static reset(): void {
    this.projectRepository = null;
    this.freelanceProjectRepository = null;
  }
}
