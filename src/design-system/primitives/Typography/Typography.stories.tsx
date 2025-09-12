import type { Meta, StoryObj } from "@storybook/react";

import { Typography, Heading, Text, Code, Caption, Lead, Muted, Blockquote } from "./Typography";

const meta: Meta<typeof Typography> = {
  title: "Design System/Primitives/Typography",
  component: Typography,
  parameters: {
    docs: {
      description: {
        component:
          "A flexible typography component for consistent text styling across the application. Supports semantic HTML mapping, responsive design, and accessibility best practices.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "body",
        "bodyLarge",
        "bodySmall",
        "caption",
        "code",
        "lead",
        "muted",
        "subtle",
        "blockquote",
      ],
      description: "The typographic style variant",
    },
    color: {
      control: "select",
      options: [
        "default",
        "muted",
        "primary",
        "secondary",
        "destructive",
        "success",
        "warning",
        "info",
      ],
      description: "The text color variant",
    },
    align: {
      control: "select",
      options: ["left", "center", "right", "justify"],
      description: "Text alignment",
    },
    transform: {
      control: "select",
      options: ["none", "uppercase", "lowercase", "capitalize"],
      description: "Text transformation",
    },
    as: {
      control: "text",
      description: "The HTML element to render (overrides semantic default)",
    },
    truncate: {
      control: "number",
      description: "Number of lines before truncating with ellipsis",
    },
    noSelect: {
      control: "boolean",
      description: "Whether the text should be selectable",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typography testing.",
  },
};

export const Headings: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Heading 1 - Main Page Title</Typography>
      <Typography variant="h2">Heading 2 - Major Section</Typography>
      <Typography variant="h3">Heading 3 - Subsection</Typography>
      <Typography variant="h4">Heading 4 - Sub-subsection</Typography>
      <Typography variant="h5">Heading 5 - Minor Heading</Typography>
      <Typography variant="h6">Heading 6 - Smallest Heading</Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All heading variants with semantic hierarchy and responsive font sizes.",
      },
    },
  },
};

export const BodyText: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <Typography variant="lead">
        This is lead text that introduces the main content. It's larger and lighter than body text
        to draw attention.
      </Typography>
      <Typography variant="bodyLarge">
        This is large body text. Perfect for important content that needs to stand out from regular
        text but isn't quite a heading.
      </Typography>
      <Typography variant="body">
        This is regular body text. It's the most common text variant used for paragraphs,
        descriptions, and general content throughout the application.
      </Typography>
      <Typography variant="bodySmall">
        This is small body text. Useful for supplementary information, fine print, or when you need
        to fit more content in limited space.
      </Typography>
      <Typography variant="muted">
        This is muted text with reduced opacity. Perfect for metadata, timestamps, or less important
        information.
      </Typography>
      <Typography variant="caption">
        This is caption text - the smallest text variant for image captions, footnotes, or minimal
        UI labels.
      </Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different body text variants for various content hierarchy needs.",
      },
    },
  },
};

export const CodeAndQuotes: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div>
        <Typography variant="h4" className="mb-2">
          Inline Code
        </Typography>
        <Typography variant="body">
          To install dependencies, run{" "}
          <Typography variant="code" as="span">
            npm install
          </Typography>{" "}
          in your terminal.
        </Typography>
      </div>

      <div>
        <Typography variant="h4" className="mb-2">
          Code Block
        </Typography>
        <Typography variant="code" as="pre" className="bg-muted block rounded p-4">
          {`function greetUser(name: string): string {
  return \`Hello, \${name}!\`;
}

const message = greetUser('World');
console.log(message);`}
        </Typography>
      </div>

      <div>
        <Typography variant="h4" className="mb-2">
          Blockquote
        </Typography>
        <Typography variant="blockquote">
          "The best way to predict the future is to invent it." — Alan Kay
        </Typography>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Code snippets and blockquotes with proper formatting and styling.",
      },
    },
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div className="space-y-3">
      <Typography color="default">Default text color for primary content</Typography>
      <Typography color="muted">Muted text color for secondary content</Typography>
      <Typography color="primary">Primary color for brand-related content</Typography>
      <Typography color="secondary">Secondary color for alternative emphasis</Typography>
      <Typography color="destructive">Destructive color for errors and warnings</Typography>
      <Typography color="success">Success color for positive feedback</Typography>
      <Typography color="warning">Warning color for cautionary messages</Typography>
      <Typography color="info">Info color for informational content</Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available color variants aligned with the design system tokens.",
      },
    },
  },
};

export const TextAlignment: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <Typography align="left" className="border p-3">
        Left aligned text (default). This is the most common alignment for reading content.
      </Typography>
      <Typography align="center" className="border p-3">
        Center aligned text. Often used for headings, hero content, or call-to-action sections.
      </Typography>
      <Typography align="right" className="border p-3">
        Right aligned text. Less common but useful for certain layouts and design needs.
      </Typography>
      <Typography align="justify" className="border p-3">
        Justified text spreads content evenly across the line width. This creates clean edges on
        both sides but can sometimes create awkward spacing between words.
      </Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Text alignment options for different layout needs.",
      },
    },
  },
};

export const TextTransform: Story = {
  render: () => (
    <div className="space-y-3">
      <Typography transform="none">No transformation applied to this text</Typography>
      <Typography transform="uppercase">This text is transformed to uppercase</Typography>
      <Typography transform="lowercase">THIS TEXT IS TRANSFORMED TO LOWERCASE</Typography>
      <Typography transform="capitalize">
        this text is transformed to capitalize each word
      </Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Text transformation options for styling flexibility.",
      },
    },
  },
};

export const TruncationExample: Story = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <Typography variant="h5" className="mb-2">
          Single Line Truncation
        </Typography>
        <Typography truncate={1} className="border p-3">
          This is a very long text that will be truncated after one line. It demonstrates how the
          truncate prop works to limit text overflow in constrained layouts.
        </Typography>
      </div>

      <div>
        <Typography variant="h5" className="mb-2">
          Three Line Truncation
        </Typography>
        <Typography truncate={3} className="border p-3">
          This is a longer text that will be truncated after three lines. This is useful for preview
          cards, excerpts, or any situation where you want to show a preview of content while
          maintaining a consistent layout. The ellipsis will appear at the end of the third line.
        </Typography>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Text truncation with line clamping for consistent layouts.",
      },
    },
  },
};

export const ConvenienceComponents: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div>
        <Typography variant="h3" className="mb-4">
          Heading Component
        </Typography>
        <div className="space-y-2">
          <Heading level={1}>Heading Level 1</Heading>
          <Heading level={2}>Heading Level 2</Heading>
          <Heading level={3}>Heading Level 3</Heading>
        </div>
      </div>

      <div>
        <Typography variant="h3" className="mb-4">
          Text Component
        </Typography>
        <div className="space-y-2">
          <Text size="lg">Large text size</Text>
          <Text>Default text size</Text>
          <Text size="sm">Small text size</Text>
        </div>
      </div>

      <div>
        <Typography variant="h3" className="mb-4">
          Specialized Components
        </Typography>
        <div className="space-y-3">
          <div>
            <Lead>Lead paragraph introducing the main content</Lead>
          </div>
          <div>
            <Code>const greeting = 'Hello World';</Code>
          </div>
          <div>
            <Caption>Image caption or supplementary information</Caption>
          </div>
          <div>
            <Muted>Muted text for less important information</Muted>
          </div>
          <div>
            <Blockquote>
              "Design is not just what it looks like and feels like. Design is how it works."
            </Blockquote>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Convenience components built on top of the base Typography component for common use cases.",
      },
    },
  },
};

export const ResponsiveDesign: Story = {
  render: () => (
    <div className="space-y-6">
      <Typography variant="h2" className="mb-4">
        Responsive Typography
      </Typography>
      <Typography variant="body" className="mb-6 max-w-2xl">
        Typography components are built with responsive design in mind. Headings automatically scale
        down on smaller screens while maintaining readability and hierarchy.
      </Typography>

      <div className="space-y-4">
        <div className="rounded border p-4">
          <Typography variant="h1" className="mb-2">
            h1: Scales from 4xl to 6xl
          </Typography>
          <Typography variant="muted" className="text-xs">
            Mobile: text-4xl | Tablet: text-5xl | Desktop: text-6xl
          </Typography>
        </div>

        <div className="rounded border p-4">
          <Typography variant="h2" className="mb-2">
            h2: Scales from 3xl to 4xl
          </Typography>
          <Typography variant="muted" className="text-xs">
            Mobile: text-3xl | Desktop: text-4xl
          </Typography>
        </div>

        <div className="rounded border p-4">
          <Typography variant="h3" className="mb-2">
            h3: Scales from 2xl to 3xl
          </Typography>
          <Typography variant="muted" className="text-xs">
            Mobile: text-2xl | Desktop: text-3xl
          </Typography>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Typography components automatically adapt to different screen sizes with responsive font scaling.",
      },
    },
  },
};

export const RealWorldExample: Story = {
  render: () => (
    <article className="prose prose-gray dark:prose-invert mx-auto max-w-3xl">
      <Heading level={1}>Building Modern Web Applications</Heading>

      <Lead>
        A comprehensive guide to creating scalable, maintainable, and performant web applications
        using modern development practices and tools.
      </Lead>

      <Text>
        Published on <time>March 15, 2024</time> • 8 min read
      </Text>

      <Heading level={2}>Introduction</Heading>

      <Text>
        Modern web development has evolved significantly over the past decade. Today's applications
        require careful consideration of performance, accessibility, and user experience. This
        article explores best practices for building applications that stand the test of time.
      </Text>

      <Heading level={3}>Key Principles</Heading>

      <Text>When building modern applications, we should focus on several core principles:</Text>

      <ul className="my-4 space-y-2">
        <li>
          <Text as="span">Performance optimization from the ground up</Text>
        </li>
        <li>
          <Text as="span">Accessibility as a first-class citizen</Text>
        </li>
        <li>
          <Text as="span">Maintainable and scalable architecture</Text>
        </li>
        <li>
          <Text as="span">Type safety and developer experience</Text>
        </li>
      </ul>

      <Heading level={3}>Code Example</Heading>

      <Text>Here's how we might implement a reusable component using TypeScript:</Text>

      <Code as="pre" className="bg-muted my-4 block overflow-x-auto rounded p-4">
        {`interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size, 
  children 
}) => {
  return (
    <button 
      className={cn(
        'font-medium rounded focus:outline-none',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </button>
  );
};`}
      </Code>

      <Blockquote>
        "The best code is no code at all. Every line of code is a liability." — Jeff Atwood
      </Blockquote>

      <Heading level={2}>Conclusion</Heading>

      <Text>
        Building modern web applications requires balancing multiple concerns: performance,
        maintainability, accessibility, and user experience. By following established patterns and
        leveraging modern tools, we can create applications that serve users effectively while
        remaining manageable for development teams.
      </Text>

      <Muted className="mt-8 border-t pt-4">Last updated: March 15, 2024</Muted>
    </article>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A complete article layout demonstrating how typography components work together to create readable, hierarchical content.",
      },
    },
  },
};
