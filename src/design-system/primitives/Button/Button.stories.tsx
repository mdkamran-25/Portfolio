import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Design System/Primitives/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "A versatile button component with multiple variants, sizes, and states. Built with accessibility in mind and supports loading states.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "The visual style variant of the button",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "The size of the button",
    },
    loading: {
      control: "boolean",
      description: "Shows loading spinner and disables the button",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    children: {
      control: "text",
      description: "Button content",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default Button",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available button variants showcasing different visual styles.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🚀</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different button sizes for various use cases.",
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Normal</Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
      <Button loading disabled>
        Loading + Disabled
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Button states including loading and disabled states.",
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <span className="mr-2">📧</span>
        Send Email
      </Button>
      <Button variant="outline">
        Download
        <span className="ml-2">⬇️</span>
      </Button>
      <Button size="icon" variant="ghost">
        ⚙️
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttons with icons, showing flexible content composition.",
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    children: "Click me!",
    onClick: () => alert("Button clicked!"),
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive button with click handler. Try clicking it!",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    children: "Loading Button",
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Button in loading state with spinner animation.",
      },
    },
  },
};
