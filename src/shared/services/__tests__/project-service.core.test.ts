/**
 * Service Layer Unit Tests - Core Functionality
 */

import { describe, test, expect, beforeEach } from "vitest";
import { ProjectService, FreelanceProjectService, ServiceFactory } from "../project-service";
import { Project, FreelanceProject } from "../../domain/models";
import {
  IProjectRepository,
  IFreelanceProjectRepository,
} from "../../repositories/project-repository";

// Simple mock implementations for testing
class SimpleProjectRepository implements IProjectRepository {
  private mockProjects: Project[] = [
    {
      id: "test-1",
      title: "Test Web App",
      description: "A test web application",
      image: "/test.jpg",
      category: "web",
      technologies: [{ name: "React", category: "frontend", proficiencyLevel: "expert" }],
      links: { demo: "https://test.com" },
      metadata: {
        featured: true,
        visibility: "public",
        status: "completed",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-12-01"),
      },
    },
  ];

  async getAllProjects(): Promise<Project[]> {
    return [...this.mockProjects];
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return this.mockProjects.filter((p) => p.metadata.featured);
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.mockProjects.find((p) => p.id === id) || null;
  }

  async searchProjects(query: string): Promise<Project[]> {
    return this.mockProjects.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
  }

  async getProjectsByCategory(category: Project["category"]): Promise<Project[]> {
    return this.mockProjects.filter((p) => p.category === category);
  }

  async getProjectsByTechnology(technology: string): Promise<Project[]> {
    return this.mockProjects.filter((p) =>
      p.technologies.some((t) => t.name.toLowerCase() === technology.toLowerCase())
    );
  }
}

class SimpleFreelanceProjectRepository implements IFreelanceProjectRepository {
  private mockProjects: FreelanceProject[] = [
    {
      id: "freelance-1",
      title: "Freelance Web App",
      description: "A freelance web application",
      image: "/freelance.jpg",
      category: "web",
      client: "Test Client",
      role: "Full Stack Developer",
      duration: "3 months",
      technologies: [{ name: "Next.js", category: "frontend", proficiencyLevel: "expert" }],
      links: { demo: "https://freelance.com" },
      metadata: {
        featured: true,
        visibility: "public",
        status: "completed",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-12-01"),
      },
      budget: {
        amount: 5000,
        currency: "USD",
        type: "fixed",
      },
    },
  ];

  async getAllFreelanceProjects(): Promise<FreelanceProject[]> {
    return [...this.mockProjects];
  }

  async getFeaturedFreelanceProjects(): Promise<FreelanceProject[]> {
    return this.mockProjects.filter((p) => p.metadata.featured);
  }

  async getFreelanceProjectById(id: string): Promise<FreelanceProject | null> {
    return this.mockProjects.find((p) => p.id === id) || null;
  }

  async getFreelanceProjectsByClient(client: string): Promise<FreelanceProject[]> {
    return this.mockProjects.filter((p) => p.client.toLowerCase() === client.toLowerCase());
  }
}

describe("ProjectService Core Tests", () => {
  let projectService: ProjectService;

  beforeEach(() => {
    const repository = new SimpleProjectRepository();
    projectService = new ProjectService(repository);
  });

  test("getAllProjects returns all projects", async () => {
    const projects = await projectService.getAllProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.title).toBe("Test Web App");
  });

  test("getFeaturedProjects returns only featured projects", async () => {
    const projects = await projectService.getFeaturedProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.metadata.featured).toBe(true);
  });

  test("getProjectById returns correct project", async () => {
    const project = await projectService.getProjectById("test-1");
    expect(project).not.toBeNull();
    expect(project?.title).toBe("Test Web App");
  });

  test("getProjectById returns null for non-existent ID", async () => {
    const project = await projectService.getProjectById("non-existent");
    expect(project).toBeNull();
  });

  test("searchProjects finds matching projects", async () => {
    const projects = await projectService.searchProjects("Test");
    expect(projects).toHaveLength(1);
    expect(projects[0]?.title).toBe("Test Web App");
  });

  test("getProjectsByCategory filters correctly", async () => {
    const projects = await projectService.getProjectsByCategory("web");
    expect(projects).toHaveLength(1);
    expect(projects[0]?.category).toBe("web");
  });

  test("getProjectsByTechnology filters correctly", async () => {
    const projects = await projectService.getProjectsByTechnology("React");
    expect(projects).toHaveLength(1);
    expect(projects[0]?.technologies.some((t) => t.name === "React")).toBe(true);
  });

  test("getProjectStats calculates correctly", async () => {
    const stats = await projectService.getProjectStats();
    expect(stats.totalProjects).toBe(1);
    expect(stats.featuredProjects).toBe(1);
    expect(stats.completedProjects).toBe(1);
    expect(stats.categoriesCount.web).toBe(1);
    expect(stats.technologiesCount.React).toBe(1);
  });
});

describe("FreelanceProjectService Core Tests", () => {
  let freelanceService: FreelanceProjectService;

  beforeEach(() => {
    const repository = new SimpleFreelanceProjectRepository();
    freelanceService = new FreelanceProjectService(repository);
  });

  test("getAllFreelanceProjects returns all projects", async () => {
    const projects = await freelanceService.getAllFreelanceProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.title).toBe("Freelance Web App");
  });

  test("getFeaturedFreelanceProjects returns only featured projects", async () => {
    const projects = await freelanceService.getFeaturedFreelanceProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.metadata.featured).toBe(true);
  });

  test("getFreelanceProjectById returns correct project", async () => {
    const project = await freelanceService.getFreelanceProjectById("freelance-1");
    expect(project).not.toBeNull();
    expect(project?.title).toBe("Freelance Web App");
  });

  test("getFreelanceProjectsByClient filters correctly", async () => {
    const projects = await freelanceService.getFreelanceProjectsByClient("Test Client");
    expect(projects).toHaveLength(1);
    expect(projects[0]?.client).toBe("Test Client");
  });

  test("getFreelanceProjectStats calculates correctly", async () => {
    const stats = await freelanceService.getFreelanceProjectStats();
    expect(stats.totalProjects).toBe(1);
    expect(stats.totalClients).toBe(1);
    expect(stats.totalRevenue).toBe(5000);
    expect(stats.topTechnologies).toHaveLength(1);
    expect(stats.topTechnologies[0]?.name).toBe("Next.js");
  });
});

describe("ServiceFactory Tests", () => {
  beforeEach(() => {
    ServiceFactory.reset();
  });

  test("createProjectService creates service instance", () => {
    const service = ServiceFactory.createProjectService([]);
    expect(service).toBeInstanceOf(ProjectService);
  });

  test("createFreelanceProjectService creates service instance", () => {
    const service = ServiceFactory.createFreelanceProjectService([], []);
    expect(service).toBeInstanceOf(FreelanceProjectService);
  });

  test("services are singletons", () => {
    const service1 = ServiceFactory.createProjectService([]);
    const service2 = ServiceFactory.createProjectService([]);
    expect(service1).toBe(service2);
  });

  test("reset clears singleton instances", () => {
    const service1 = ServiceFactory.createProjectService([]);
    ServiceFactory.reset();
    const service2 = ServiceFactory.createProjectService([]);
    expect(service1).not.toBe(service2);
  });
});

describe("Error Handling Tests", () => {
  let projectService: ProjectService;

  beforeEach(() => {
    const repository = new SimpleProjectRepository();
    projectService = new ProjectService(repository);
  });

  test("getProjectById throws error for empty ID", async () => {
    await expect(projectService.getProjectById("")).rejects.toThrow("Project ID is required");
    await expect(projectService.getProjectById("   ")).rejects.toThrow("Project ID is required");
  });

  test("getProjectsByTechnology throws error for empty technology", async () => {
    await expect(projectService.getProjectsByTechnology("")).rejects.toThrow(
      "Technology name is required"
    );
    await expect(projectService.getProjectsByTechnology("   ")).rejects.toThrow(
      "Technology name is required"
    );
  });

  test("searchProjects handles empty query gracefully", async () => {
    const projects = await projectService.searchProjects("");
    expect(projects).toHaveLength(1); // Should return all projects
  });
});
