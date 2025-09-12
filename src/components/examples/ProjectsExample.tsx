/**
 * Example: Migrating a component to use the new Domain Layer
 *
 * This example shows how to update existing components to use the new
 * domain models and services while maintaining backward compatibility.
 */

"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

import { useApplicationService } from "../../shared/services/application-service";
import type { Project, ProjectStats } from "../../shared/services/application-service";

/**
 * Example Projects Component using the new Domain Layer
 */
export function ProjectsExample() {
  const applicationService = useApplicationService();
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all data in parallel using the new domain services
        const [allProjects, featured, projectStats] = await Promise.all([
          applicationService.getAllProjects(),
          applicationService.getFeaturedProjects(),
          applicationService.getProjectStats(),
        ]);

        setProjects(allProjects);
        setFeaturedProjects(featured);
        setStats(projectStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [applicationService]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-md border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Projects</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Project Statistics */}
      {stats && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Project Statistics</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalProjects}</div>
              <div className="text-gray-600">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.featuredProjects}</div>
              <div className="text-gray-600">Featured Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.completedProjects}</div>
              <div className="text-gray-600">Completed Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Projects */}
      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Featured Projects</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} featured={true} />
          ))}
        </div>
      </section>

      {/* All Projects */}
      <section>
        <h2 className="mb-6 text-3xl font-bold text-gray-900">All Projects</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} featured={false} />
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Project Card Component using the new Domain Model
 */
interface ProjectCardProps {
  project: Project;
  featured: boolean;
}

function ProjectCard({ project, featured }: ProjectCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105 ${
        featured ? "ring-2 ring-blue-500" : ""
      }`}
    >
      {/* Project Image */}
      <div className="relative aspect-video bg-gray-200">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback for broken images
            e.currentTarget.src = "/placeholder-project.jpg";
          }}
        />
        {featured && (
          <div className="absolute right-2 top-2 rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
            Featured
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span
            className={`rounded px-2 py-1 text-xs font-semibold ${getCategoryStyles(project.category)}`}
          >
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-4">
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{project.title}</h3>

        <p className="mb-3 text-sm text-gray-600">
          {showFullDescription
            ? project.longDescription || project.description
            : project.description}
          {project.longDescription && project.longDescription !== project.description && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="ml-2 text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              {showFullDescription ? "Show Less" : "Read More"}
            </button>
          )}
        </p>

        {/* Technologies */}
        <div className="mb-3 flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech.name}
              className={`rounded px-2 py-1 text-xs ${getTechCategoryStyles(tech.category)}`}
            >
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Project Review */}
        {project.review && (
          <div className="mb-3 rounded bg-gray-50 p-2">
            <div className="mb-1 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(project.review!.rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="ml-1 text-xs text-gray-600">({project.review.rating}/5)</span>
            </div>
            <p className="text-xs italic text-gray-600">"{project.review.comment}"</p>
            <p className="text-xs text-gray-500">
              — {project.review.reviewer}, {project.review.position}
            </p>
          </div>
        )}

        {/* Project Links */}
        <div className="flex gap-2">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              View Live
            </a>
          )}
          {project.links.demo && !project.links.live && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded bg-green-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              Demo
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded bg-gray-800 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-gray-900"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Utility Functions for Styling
 */
function getCategoryStyles(category: Project["category"]): string {
  const styles: Record<Project["category"], string> = {
    web: "bg-blue-100 text-blue-800",
    mobile: "bg-green-100 text-green-800",
    desktop: "bg-purple-100 text-purple-800",
    api: "bg-orange-100 text-orange-800",
    library: "bg-pink-100 text-pink-800",
    tool: "bg-gray-100 text-gray-800",
  };
  return styles[category] || styles.tool;
}

function getTechCategoryStyles(category: string): string {
  const styles = {
    frontend: "bg-blue-50 text-blue-700",
    backend: "bg-green-50 text-green-700",
    database: "bg-orange-50 text-orange-700",
    tool: "bg-gray-50 text-gray-700",
    cloud: "bg-purple-50 text-purple-700",
    mobile: "bg-pink-50 text-pink-700",
  };
  return styles[category as keyof typeof styles] || styles.tool;
}

export default ProjectsExample;
