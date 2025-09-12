import type { Meta, StoryObj } from "@storybook/react";
import Image from "next/image";

import { Button } from "../Button";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Design System/Primitives/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          "A flexible container component for grouping related content. Supports compound component pattern with Header, Title, Description, Content, and Footer.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "outlined", "ghost"],
      description: "The visual style variant of the card",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "default", "lg"],
      description: "The padding size of the card",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold">Simple Card</h3>
        <p className="mt-2 text-sm text-gray-600">This is a basic card with default styling.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-2 gap-4">
      <Card variant="default">
        <div className="p-6">
          <h3 className="font-semibold">Default Card</h3>
          <p className="mt-2 text-sm text-gray-600">Standard card with border and subtle shadow.</p>
        </div>
      </Card>

      <Card variant="elevated">
        <div className="p-6">
          <h3 className="font-semibold">Elevated Card</h3>
          <p className="mt-2 text-sm text-gray-600">Card with enhanced shadow for emphasis.</p>
        </div>
      </Card>

      <Card variant="outlined">
        <div className="p-6">
          <h3 className="font-semibold">Outlined Card</h3>
          <p className="mt-2 text-sm text-gray-600">Card with prominent border and no shadow.</p>
        </div>
      </Card>

      <Card variant="ghost">
        <div className="p-6">
          <h3 className="font-semibold">Ghost Card</h3>
          <p className="mt-2 text-sm text-gray-600">Minimal card with no border or background.</p>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different card variants for various design needs.",
      },
    },
  },
};

export const PaddingSizes: Story = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-2 gap-4">
      <Card padding="none" className="border">
        <div className="bg-blue-50 p-2 text-center">
          <h4 className="font-semibold">No Padding</h4>
          <p className="text-sm">Content touches edges</p>
        </div>
      </Card>

      <Card padding="sm">
        <h4 className="font-semibold">Small Padding</h4>
        <p className="mt-1 text-sm text-gray-600">Compact spacing for dense layouts</p>
      </Card>

      <Card padding="default">
        <h4 className="font-semibold">Default Padding</h4>
        <p className="mt-1 text-sm text-gray-600">Comfortable spacing for most use cases</p>
      </Card>

      <Card padding="lg">
        <h4 className="font-semibold">Large Padding</h4>
        <p className="mt-1 text-sm text-gray-600">Generous spacing for important content</p>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different padding sizes for various content densities.",
      },
    },
  },
};

export const CompoundComponents: Story = {
  render: () => (
    <div className="max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Project Card</CardTitle>
          <CardDescription>
            A modern web application built with React and TypeScript
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">React</span>
              <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                TypeScript
              </span>
              <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">
                Tailwind
              </span>
            </div>
            <p className="text-sm text-gray-600">
              This project demonstrates best practices in modern web development with a focus on
              performance and accessibility.
            </p>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="default" size="sm">
            View Project
          </Button>
          <Button variant="outline" size="sm">
            GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete card composition using all compound components - Header, Title, Description, Content, and Footer.",
      },
    },
  },
};

export const ProjectShowcase: Story = {
  render: () => (
    <div className="grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle as="h2">E-commerce Platform</CardTitle>
          <CardDescription>Full-stack marketplace with payment integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-3 h-32 w-full">
            <Image
              src="/api/placeholder/300/150"
              alt="E-commerce Platform"
              fill
              className="rounded object-cover"
            />
          </div>
          <div className="mb-3 flex flex-wrap gap-1">
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">Next.js</span>
            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">Node.js</span>
            <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Stripe</span>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">Live Demo</Button>
          <Button variant="outline" size="sm">
            Code
          </Button>
        </CardFooter>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle as="h2">Mobile Dashboard</CardTitle>
          <CardDescription>React Native app with real-time analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-3 h-32 w-full">
            <Image
              src="/api/placeholder/300/150"
              alt="Mobile Dashboard"
              fill
              className="rounded object-cover"
            />
          </div>
          <div className="mb-3 flex flex-wrap gap-1">
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
              React Native
            </span>
            <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">Firebase</span>
            <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">
              Chart.js
            </span>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">App Store</Button>
          <Button variant="outline" size="sm">
            GitHub
          </Button>
        </CardFooter>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle as="h2">Design System</CardTitle>
          <CardDescription>Component library with Storybook documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-3 h-32 w-full">
            <Image
              src="/api/placeholder/300/150"
              alt="Design System"
              fill
              className="rounded object-cover"
            />
          </div>
          <div className="mb-3 flex flex-wrap gap-1">
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">React</span>
            <span className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-800">
              Storybook
            </span>
            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
              TypeScript
            </span>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">Storybook</Button>
          <Button variant="outline" size="sm">
            NPM
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Real-world example showing how cards can be used for project showcases in a portfolio.",
      },
    },
  },
};
