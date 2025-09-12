/**
 * Service Layer Unit Tests
 */

import { describe, test, expect, beforeEach, vi } from "vitest";

import { Project, FreelanceProject } from "../../domain/models";
import {
  IProjectRepository,
  IFreelanceProjectRepository,
} from "../../repositories/project-repository";
import { ProjectService, FreelanceProjectService, ServiceFactory } from "../project-service";

// Mock data
const mockProject: Project = {
  id: "test-project-1",
  title: "Test Project",
  description: "A test project",
  longDescription: "A detailed test project description",
  image: "/test-thumb.jpg",
  category: "web",
  technologies: [
    { name: "React", category: "frontend", proficiencyLevel: "expert" },
    { name: "TypeScript", category: "frontend", proficiencyLevel: "expert" },
  ],
  links: {
    demo: "https://demo.example.com",
    github: "https://github.com/example/test",
  },
  metadata: {
    featured: true,
    visibility: "public",
    status: "completed",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-12-01"),
  },
  review: {
    rating: 4.5,
    comment: "Great work!",
    reviewer: "Test Client",
    position: "CEO",
  },
};

const mockFreelanceProject: FreelanceProject = {
  id: "test-freelance-1",
  title: "Test Freelance Project",
  description: "A test freelance project",
  longDescription: "A detailed test freelance project description",
  image: "/freelance-thumb.jpg",
  client: "Test Client",
  role: "Full Stack Developer",
  duration: "3 months",
  category: "web",
  technologies: [
    { name: "Next.js", category: "frontend", proficiencyLevel: "expert" },
    { name: "Node.js", category: "backend", proficiencyLevel: "expert" },
  ],
  links: {
    demo: "https://freelance-demo.example.com",
  },
  metadata: {
    featured: true,
    visibility: "public",
    status: "completed",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-05-01"),
  },
  budget: {
    amount: 5000,
    currency: "USD",
    type: "fixed",
  },
  review: {
    rating: 5.0,
    comment: "Excellent work!",
    reviewer: "Test Client",
    position: "CTO",
  },
};

// Mock repositories
class MockProjectRepository implements IProjectRepository {
  private projects: Project[] = [mockProject];

  async getAllProjects(): Promise<Project[]> {
    return [...this.projects];
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return this.projects.filter((p) => p.metadata.featured);
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projects.find((p) => p.id === id) || null;
  }

  async searchProjects(query: string): Promise<Project[]> {
    return this.projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getProjectsByCategory(category: Project["category"]): Promise<Project[]> {
    return this.projects.filter((p) => p.category === category);
  }

  async getProjectsByTechnology(technology: string): Promise<Project[]> {
    return this.projects.filter((p) =>
      p.technologies.some((t) => t.name.toLowerCase() === technology.toLowerCase())
    );
  }
}

class MockFreelanceProjectRepository implements IFreelanceProjectRepository {
  private projects: FreelanceProject[] = [mockFreelanceProject];

  async getAllFreelanceProjects(): Promise<FreelanceProject[]> {
    return [...this.projects];
  }

  async getFeaturedFreelanceProjects(): Promise<FreelanceProject[]> {
    return this.projects.filter((p) => p.metadata.featured);
  }

  async getFreelanceProjectById(id: string): Promise<FreelanceProject | null> {
    return this.projects.find((p) => p.id === id) || null;
  }

  async getFreelanceProjectsByClient(client: string): Promise<FreelanceProject[]> {
    return this.projects.filter((p) => p.client.toLowerCase() === client.toLowerCase());
  }
}

describe("ProjectService", () => {
  let projectService: ProjectService;
  let mockRepository: MockProjectRepository;

  beforeEach(() => {
    mockRepository = new MockProjectRepository();
    projectService = new ProjectService(mockRepository);
  });

  describe("getAllProjects", () => {
    test("should return all projects", async () => {
      const projects = await projectService.getAllProjects();
      expect(projects).toHaveLength(1);
      expect(projects[0]!.title).toBe("Test Project");
    });

    test("should handle repository errors", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(mockRepository, "getAllProjects").mockRejectedValueOnce(new Error("DB Error"));

      await expect(projectService.getAllProjects()).rejects.toThrow("Failed to load projects");

      consoleSpy.mockRestore();
    });
  });

  describe("getFeaturedProjects", () => {
    test("should return only featured projects", async () => {
      const projects = await projectService.getFeaturedProjects();
      expect(projects).toHaveLength(1);
      expect(projects[0]!.metadata.featured).toBe(true);
    });
  });

  describe("getProjectById", () => {
    test("should return project by ID", async () => {
      const project = await projectService.getProjectById("test-project-1");
      expect(project).not.toBeNull();
      expect(project?.title).toBe("Test Project");
    });

    test("should return null for non-existent ID", async () => {
      const project = await projectService.getProjectById("non-existent");
      expect(project).toBeNull();
    });

    test("should throw error for empty ID", async () => {
      await expect(projectService.getProjectById("")).rejects.toThrow("Project ID is required");
      await expect(projectService.getProjectById("   ")).rejects.toThrow("Project ID is required");
    });
  });

  describe("searchProjects", () => {
    test("should search projects by title", async () => {
      const projects = await projectService.searchProjects("Test");
      expect(projects).toHaveLength(1);
      expect(projects[0]!.title).toBe("Test Project");
    });

    test("should return all projects for empty query", async () => {
      const projects = await projectService.searchProjects("");
      expect(projects).toHaveLength(1);
    });

    test("should return empty array for no matches", async () => {
      const projects = await projectService.searchProjects("NonExistent");
      expect(projects).toHaveLength(0);
    });
  });

  describe("getProjectsByCategory", () => {
    test("should return projects by category", async () => {
      const projects = await projectService.getProjectsByCategory("web");
      expect(projects).toHaveLength(1);
      expect(projects[0]!.category).toBe("web");
    });

    test("should return empty array for non-matching category", async () => {
      const projects = await projectService.getProjectsByCategory("mobile");
      expect(projects).toHaveLength(0);
    });
  });

  describe("getProjectsByTechnology", () => {
    test("should return projects by technology", async () => {
      const projects = await projectService.getProjectsByTechnology("React");
      expect(projects).toHaveLength(1);
      expect(projects[0]!.technologies.some((t) => t.name === "React")).toBe(true);
    });

    test("should be case insensitive", async () => {
      const projects = await projectService.getProjectsByTechnology("react");
      expect(projects).toHaveLength(1);
    });

    test("should throw error for empty technology", async () => {
      await expect(projectService.getProjectsByTechnology("")).rejects.toThrow(
        "Technology name is required"
      );
    });
  });

  describe("getProjectStats", () => {
    test("should calculate project statistics", async () => {
      const stats = await projectService.getProjectStats();

      expect(stats.totalProjects).toBe(1);
      expect(stats.featuredProjects).toBe(1);
      expect(stats.completedProjects).toBe(1);
      expect(stats.averageRating).toBe(4.5);
      expect(stats.categoriesCount.web).toBe(1);
      expect(stats.technologiesCount["React"]).toBe(1);
      expect(stats.technologiesCount["TypeScript"]).toBe(1);
    });
  });
});

describe("FreelanceProjectService", () => {
  let freelanceProjectService: FreelanceProjectService;
  let mockRepository: IFreelanceProjectRepository;

  beforeEach(() => {
    mockRepository = new MockFreelanceProjectRepository();
    freelanceProjectService = new FreelanceProjectService(mockRepository);
  });

  describe("getAllFreelanceProjects", () => {
    test("should return all freelance projects", async () => {
      const projects = await freelanceProjectService.getAllFreelanceProjects();
      expect(projects).toHaveLength(1);
      expect(projects[0]!.title).toBe("Test Freelance Project");
    });
  });

  describe("getFeaturedFreelanceProjects", () => {
    test("should return only featured freelance projects", async () => {
      const projects = await freelanceProjectService.getFeaturedFreelanceProjects();
      expect(projects).toHaveLength(1);
      expect(projects[0]!.metadata.featured).toBe(true);
    });
  });

  describe("getFreelanceProjectById", () => {
    test("should return freelance project by ID", async () => {
      const project = await freelanceProjectService.getFreelanceProjectById("test-freelance-1");
      expect(project).not.toBeNull();
      expect(project?.title).toBe("Test Freelance Project");
    });

    test("should return null for non-existent ID", async () => {
      const project = await freelanceProjectService.getFreelanceProjectById("non-existent");
      expect(project).toBeNull();
    });

    test("should throw error for empty ID", async () => {
      await expect(freelanceProjectService.getFreelanceProjectById("")).rejects.toThrow(
        "Freelance project ID is required"
      );
    });
  });

  describe("getFreelanceProjectsByClient", () => {
    test("should return projects by client", async () => {
      const projects = await freelanceProjectService.getFreelanceProjectsByClient("Test Client");
      expect(projects).toHaveLength(1);
      expect(projects[0]!.client).toBe("Test Client");
    });

    test("should be case insensitive", async () => {
      const projects = await freelanceProjectService.getFreelanceProjectsByClient("test client");
      expect(projects).toHaveLength(1);
    });

    test("should throw error for empty client name", async () => {
      await expect(freelanceProjectService.getFreelanceProjectsByClient("")).rejects.toThrow(
        "Client name is required"
      );
    });
  });

  describe("getFreelanceProjectStats", () => {
    test("should calculate freelance project statistics", async () => {
      const stats = await freelanceProjectService.getFreelanceProjectStats();

      expect(stats.totalProjects).toBe(1);
      expect(stats.totalClients).toBe(1);
      expect(stats.averageRating).toBe(5.0);
      expect(stats.totalRevenue).toBe(5000);
      expect(stats.topTechnologies).toHaveLength(2);
      expect(stats.topTechnologies[0]!.name).toBe("Next.js");
      expect(stats.topTechnologies[0]!.count).toBe(1);
    });

    test("should not include totalRevenue if no budget data", async () => {
      // Create a project without budget
      const projectWithoutBudget = { ...mockFreelanceProject };
      delete projectWithoutBudget.budget;

      mockRepository = {
        async getAllFreelanceProjects() {
          return [projectWithoutBudget];
        },
        async getFeaturedFreelanceProjects() {
          return [];
        },
        async getFreelanceProjectById() {
          return null;
        },
        async getFreelanceProjectsByClient() {
          return [];
        },
      } as IFreelanceProjectRepository;

      freelanceProjectService = new FreelanceProjectService(mockRepository);
      const stats = await freelanceProjectService.getFreelanceProjectStats();

      expect(stats.totalRevenue).toBeUndefined();
    });
  });
});

describe("ServiceFactory", () => {
  beforeEach(() => {
    ServiceFactory.reset();
  });

  describe("createProjectService", () => {
    test("should create project service with static data", () => {
      const service = ServiceFactory.createProjectService([]);
      expect(service).toBeInstanceOf(ProjectService);
    });

    test("should return same instance on subsequent calls (singleton)", () => {
      const service1 = ServiceFactory.createProjectService([]);
      const service2 = ServiceFactory.createProjectService([]);
      expect(service1).toBe(service2);
    });
  });

  describe("createFreelanceProjectService", () => {
    test("should create freelance project service with static data", () => {
      const service = ServiceFactory.createFreelanceProjectService([], []);
      expect(service).toBeInstanceOf(FreelanceProjectService);
    });

    test("should return same instance on subsequent calls (singleton)", () => {
      const service1 = ServiceFactory.createFreelanceProjectService([], []);
      const service2 = ServiceFactory.createFreelanceProjectService([], []);
      expect(service1).toBe(service2);
    });
  });

  describe("createProjectServiceWithRepository", () => {
    test("should create project service with custom repository", () => {
      const mockRepo = new MockProjectRepository();
      const service = ServiceFactory.createProjectServiceWithRepository(mockRepo);
      expect(service).toBeInstanceOf(ProjectService);
    });
  });

  describe("createFreelanceProjectServiceWithRepository", () => {
    test("should create freelance project service with custom repository", () => {
      const mockRepo = new MockFreelanceProjectRepository();
      const service = ServiceFactory.createFreelanceProjectServiceWithRepository(mockRepo);
      expect(service).toBeInstanceOf(FreelanceProjectService);
    });
  });

  describe("reset", () => {
    test("should reset singleton instances", () => {
      const service1 = ServiceFactory.createProjectService([]);
      ServiceFactory.reset();
      const service2 = ServiceFactory.createProjectService([]);
      expect(service1).not.toBe(service2);
    });
  });
});
