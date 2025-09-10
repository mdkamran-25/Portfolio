/**
 * Application Integration Layer
 *
 * This service integrates the domain layer with the existing application,
 * providing a bridge between the new domain models and existing components.
 */

import { ProjectService, FreelanceProjectService, ServiceFactory } from "./project-service";
import { Project, FreelanceProject } from "../domain/models";

// Import existing project data
import { featuredProjects, freelanceProjects } from "../../constants/projects";

/**
 * Main Application Service
 *
 * This service provides a unified interface for accessing project data
 * using the new domain layer while maintaining backward compatibility.
 */
export class ApplicationService {
  private projectService: ProjectService;
  private freelanceProjectService: FreelanceProjectService;

  constructor() {
    // Initialize services with existing project data
    this.projectService = ServiceFactory.createProjectService(featuredProjects, []);
    this.freelanceProjectService = ServiceFactory.createFreelanceProjectService(
      featuredProjects,
      freelanceProjects
    );
  }

  /**
   * Get all projects using the new domain models
   */
  async getAllProjects(): Promise<Project[]> {
    return await this.projectService.getAllProjects();
  }

  /**
   * Get featured projects only
   */
  async getFeaturedProjects(): Promise<Project[]> {
    return await this.projectService.getFeaturedProjects();
  }

  /**
   * Get a specific project by ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    return await this.projectService.getProjectById(id);
  }

  /**
   * Search projects by query
   */
  async searchProjects(query: string): Promise<Project[]> {
    return await this.projectService.searchProjects(query);
  }

  /**
   * Get projects by category
   */
  async getProjectsByCategory(category: Project["category"]): Promise<Project[]> {
    return await this.projectService.getProjectsByCategory(category);
  }

  /**
   * Get projects by technology
   */
  async getProjectsByTechnology(technology: string): Promise<Project[]> {
    return await this.projectService.getProjectsByTechnology(technology);
  }

  /**
   * Get project statistics
   */
  async getProjectStats() {
    return await this.projectService.getProjectStats();
  }

  /**
   * Get all freelance projects
   */
  async getAllFreelanceProjects(): Promise<FreelanceProject[]> {
    return await this.freelanceProjectService.getAllFreelanceProjects();
  }

  /**
   * Get featured freelance projects
   */
  async getFeaturedFreelanceProjects(): Promise<FreelanceProject[]> {
    return await this.freelanceProjectService.getFeaturedFreelanceProjects();
  }

  /**
   * Get freelance project statistics
   */
  async getFreelanceProjectStats() {
    return await this.freelanceProjectService.getFreelanceProjectStats();
  }

  /**
   * Legacy compatibility: Convert domain model back to legacy format
   * This is useful for gradual migration of existing components
   */
  convertProjectToLegacyFormat(project: Project): any {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      image: project.image,
      technologies: project.technologies.map((tech) => tech.name),
      category: project.category,
      featured: project.metadata.featured,
      links: project.links,
      // Add other legacy fields as needed
    };
  }

  /**
   * Batch convert projects to legacy format
   */
  convertProjectsToLegacyFormat(projects: Project[]): any[] {
    return projects.map((project) => this.convertProjectToLegacyFormat(project));
  }

  /**
   * Get projects in legacy format for existing components
   */
  async getProjectsLegacyFormat() {
    const projects = await this.getAllProjects();
    return this.convertProjectsToLegacyFormat(projects);
  }

  /**
   * Get featured projects in legacy format
   */
  async getFeaturedProjectsLegacyFormat() {
    const projects = await this.getFeaturedProjects();
    return this.convertProjectsToLegacyFormat(projects);
  }
}

/**
 * Singleton instance for the application service
 */
let applicationServiceInstance: ApplicationService | null = null;

/**
 * Get the singleton application service instance
 */
export function getApplicationService(): ApplicationService {
  if (!applicationServiceInstance) {
    applicationServiceInstance = new ApplicationService();
  }
  return applicationServiceInstance;
}

/**
 * Reset the application service (useful for testing)
 */
export function resetApplicationService(): void {
  applicationServiceInstance = null;
  ServiceFactory.reset();
}

/**
 * Hook-like function for React components to use the application service
 */
export function useApplicationService() {
  return getApplicationService();
}

// Export types for consumer components
export type { Project, FreelanceProject } from "../domain/models";
export type { ProjectStats, FreelanceProjectStats } from "./project-service";
