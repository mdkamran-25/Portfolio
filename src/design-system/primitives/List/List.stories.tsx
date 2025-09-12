import type { Meta, StoryObj } from "@storybook/react";

import { List, ListItem } from "./List";

const meta: Meta<typeof List> = {
  title: "Design System/Primitives/List",
  component: List,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Accessible semantic list component following WCAG 2.1 AA guidelines. Provides proper ARIA labeling and semantic structure for improved screen reader navigation.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["ul", "ol"],
      description: "HTML element type for the list",
    },
    label: {
      control: "text",
      description: "Accessible label for the list",
    },
    description: {
      control: "text",
      description: "Description for screen readers (visually hidden)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleProjects = [
  { id: 1, title: "E-commerce Platform", tech: ["React", "Next.js", "TypeScript"] },
  { id: 2, title: "Portfolio Website", tech: ["React", "Tailwind CSS"] },
  { id: 3, title: "Task Management App", tech: ["Vue.js", "Node.js", "MongoDB"] },
];

export const Default: Story = {
  args: {
    label: "Project list",
    children: (
      <>
        <ListItem>First project item</ListItem>
        <ListItem>Second project item</ListItem>
        <ListItem>Third project item</ListItem>
      </>
    ),
  },
};

export const WithDescription: Story = {
  args: {
    label: "Featured projects",
    description:
      "A curated selection of our best work showcasing various technologies and design approaches",
    children: (
      <>
        <ListItem>E-commerce Platform</ListItem>
        <ListItem>Portfolio Website</ListItem>
        <ListItem>Task Management App</ListItem>
      </>
    ),
  },
};

export const OrderedList: Story = {
  args: {
    as: "ol",
    label: "Project ranking",
    children: (
      <>
        <ListItem>Most popular project</ListItem>
        <ListItem>Second most popular</ListItem>
        <ListItem>Third most popular</ListItem>
      </>
    ),
  },
};

export const WithPositionInfo: Story = {
  args: {
    label: "Projects with position information",
    children: sampleProjects.map((project, index) => (
      <ListItem key={project.id} index={index} total={sampleProjects.length}>
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <div className="mt-2 flex gap-2">
            {project.tech.map((tech) => (
              <span key={tech} className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </ListItem>
    )),
  },
};

export const ProjectGrid: Story = {
  args: {
    label: "Featured project showcase",
    description: "Grid layout of featured projects with semantic list structure",
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    children: sampleProjects.map((project, index) => (
      <ListItem key={project.id} index={index} total={sampleProjects.length}>
        <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <header>
            <h3 className="mb-2 text-xl font-bold text-gray-900">{project.title}</h3>
          </header>
          <div className="space-y-3">
            <p className="text-gray-600">
              A sample project demonstrating modern web development practices.
            </p>
            <div className="flex flex-wrap gap-1">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
              >
                View Demo
              </button>
              <button
                type="button"
                className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                Source Code
              </button>
            </div>
          </div>
        </article>
      </ListItem>
    )),
  },
};

export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Unordered List with Description</h2>
        <List
          label="Navigation menu"
          description="Main site navigation with important pages"
          className="space-y-2"
        >
          <ListItem>
            <a href="#" className="text-blue-600 hover:underline">
              Home
            </a>
          </ListItem>
          <ListItem>
            <a href="#" className="text-blue-600 hover:underline">
              About
            </a>
          </ListItem>
          <ListItem>
            <a href="#" className="text-blue-600 hover:underline">
              Projects
            </a>
          </ListItem>
          <ListItem>
            <a href="#" className="text-blue-600 hover:underline">
              Contact
            </a>
          </ListItem>
        </List>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Ordered List with Position Information</h2>
        <List
          as="ol"
          label="Step-by-step guide"
          description="Complete these steps to set up your development environment"
          className="space-y-3"
        >
          {[
            "Install Node.js and npm",
            "Clone the repository",
            "Install dependencies with npm install",
            "Start the development server",
          ].map((step, index, array) => (
            <ListItem key={index} index={index} total={array.length}>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            </ListItem>
          ))}
        </List>
      </section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstration of accessibility features including ARIA labels, descriptions, and position information for screen readers.",
      },
    },
  },
};
