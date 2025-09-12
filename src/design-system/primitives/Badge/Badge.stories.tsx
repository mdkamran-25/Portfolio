import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

import { Badge } from "./Badge";

const meta = {
  title: "Design System/Primitives/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible badge component for displaying small pieces of information with different variants and sizes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "error", "tech"],
      description: "The visual style variant of the badge",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the badge",
    },
    techName: {
      control: "text",
      description: "Technology name for tech variant (enables dynamic coloring)",
      if: { arg: "variant", eq: "tech" },
    },
    children: {
      control: "text",
      description: "The content of the badge",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default Badge",
  },
};

export const Primary: Story = {
  args: {
    children: "Primary Badge",
    variant: "primary",
  },
};

export const Semantic: Story = {
  args: {
    children: "Semantic",
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  args: {
    children: "Size",
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const TechStack: Story = {
  args: {
    children: "Tech",
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="tech" techName="React">
        React
      </Badge>
      <Badge variant="tech" techName="TypeScript">
        TypeScript
      </Badge>
      <Badge variant="tech" techName="Next.js">
        Next.js
      </Badge>
      <Badge variant="tech" techName="Tailwind CSS">
        Tailwind CSS
      </Badge>
      <Badge variant="tech" techName="Node.js">
        Node.js
      </Badge>
      <Badge variant="tech" techName="Firebase">
        Firebase
      </Badge>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    children: "Hover me!",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story: "Badges include hover and focus states for accessibility.",
      },
    },
  },
};

export const AccessibilityTest: Story = {
  args: {
    children: "Accessible Badge",
    variant: "tech",
    techName: "React",
  },
  parameters: {
    docs: {
      description: {
        story: "Testing badge accessibility and tech color generation.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText("Accessible Badge");

    // Test that badge is rendered correctly
    await expect(badge).toBeInTheDocument();

    // Test that tech variant has proper styling
    await expect(badge).toHaveClass("bg-");

    // Test that badge content is accessible
    await expect(badge).toBeVisible();
  },
};

export const VariantValidation: Story = {
  args: {
    children: "Test Badge",
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="tech" techName="TypeScript">
        TypeScript
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All badge variants with automated testing.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test all variants are rendered
    const badges = [
      canvas.getByText("Default"),
      canvas.getByText("Primary"),
      canvas.getByText("Success"),
      canvas.getByText("Warning"),
      canvas.getByText("Error"),
      canvas.getByText("TypeScript"),
    ];

    for (const badge of badges) {
      await expect(badge).toBeInTheDocument();
      await expect(badge).toBeVisible();
    }
  },
};
