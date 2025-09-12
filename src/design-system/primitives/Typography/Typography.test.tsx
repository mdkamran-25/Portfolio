import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Typography, Heading, Text, Code, Caption, Lead, Muted, Blockquote } from "./Typography";

describe("Typography", () => {
  describe("Base Typography Component", () => {
    it("renders with default variant and element", () => {
      render(<Typography>Test content</Typography>);
      const element = screen.getByText("Test content");
      expect(element).toBeInTheDocument();
      expect(element.tagName).toBe("P");
      expect(element).toHaveClass("text-base", "leading-relaxed");
    });

    it("renders with custom element using as prop", () => {
      render(<Typography as="span">Test content</Typography>);
      const element = screen.getByText("Test content");
      expect(element.tagName).toBe("SPAN");
    });

    it("applies semantic element based on variant", () => {
      render(<Typography variant="h1">Heading</Typography>);
      const element = screen.getByText("Heading");
      expect(element.tagName).toBe("H1");
      expect(element).toHaveClass("text-4xl", "font-bold");
    });

    it("applies custom className", () => {
      render(<Typography className="custom-class">Test</Typography>);
      expect(screen.getByText("Test")).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<Typography ref={ref}>Test</Typography>);
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe("Variants", () => {
    const variants = [
      { variant: "h1", expectedTag: "H1", expectedClasses: ["text-4xl", "font-bold"] },
      { variant: "h2", expectedTag: "H2", expectedClasses: ["text-3xl", "font-semibold"] },
      { variant: "h3", expectedTag: "H3", expectedClasses: ["text-2xl", "font-semibold"] },
      { variant: "h4", expectedTag: "H4", expectedClasses: ["text-xl", "font-semibold"] },
      { variant: "h5", expectedTag: "H5", expectedClasses: ["text-lg", "font-medium"] },
      { variant: "h6", expectedTag: "H6", expectedClasses: ["text-base", "font-medium"] },
      { variant: "body", expectedTag: "P", expectedClasses: ["text-base", "leading-relaxed"] },
      { variant: "bodyLarge", expectedTag: "P", expectedClasses: ["text-lg", "leading-relaxed"] },
      { variant: "bodySmall", expectedTag: "P", expectedClasses: ["text-sm", "leading-relaxed"] },
      {
        variant: "caption",
        expectedTag: "SPAN",
        expectedClasses: ["text-xs", "text-muted-foreground"],
      },
      {
        variant: "code",
        expectedTag: "CODE",
        expectedClasses: ["font-mono", "text-sm", "bg-muted"],
      },
      { variant: "lead", expectedTag: "P", expectedClasses: ["text-xl", "text-muted-foreground"] },
      {
        variant: "blockquote",
        expectedTag: "BLOCKQUOTE",
        expectedClasses: ["border-l-4", "italic"],
      },
    ] as const;

    variants.forEach(({ variant, expectedTag, expectedClasses }) => {
      it(`renders ${variant} variant correctly`, () => {
        render(<Typography variant={variant}>Test {variant}</Typography>);
        const element = screen.getByText(`Test ${variant}`);
        expect(element.tagName).toBe(expectedTag);
        expectedClasses.forEach((className) => {
          expect(element).toHaveClass(className);
        });
      });
    });
  });

  describe("Color Variants", () => {
    const colors = [
      { color: "default", expectedClass: "text-foreground" },
      { color: "muted", expectedClass: "text-muted-foreground" },
      { color: "primary", expectedClass: "text-primary" },
      { color: "destructive", expectedClass: "text-destructive" },
      { color: "success", expectedClass: "text-green-600" },
      { color: "warning", expectedClass: "text-yellow-600" },
      { color: "info", expectedClass: "text-blue-600" },
    ] as const;

    colors.forEach(({ color, expectedClass }) => {
      it(`applies ${color} color correctly`, () => {
        render(<Typography color={color}>Test content</Typography>);
        expect(screen.getByText("Test content")).toHaveClass(expectedClass);
      });
    });
  });

  describe("Text Alignment", () => {
    const alignments = [
      { align: "left", expectedClass: "text-left" },
      { align: "center", expectedClass: "text-center" },
      { align: "right", expectedClass: "text-right" },
      { align: "justify", expectedClass: "text-justify" },
    ] as const;

    alignments.forEach(({ align, expectedClass }) => {
      it(`applies ${align} alignment correctly`, () => {
        render(<Typography align={align}>Test content</Typography>);
        expect(screen.getByText("Test content")).toHaveClass(expectedClass);
      });
    });
  });

  describe("Text Transform", () => {
    const transforms = [
      { transform: "none", expectedClass: "" },
      { transform: "uppercase", expectedClass: "uppercase" },
      { transform: "lowercase", expectedClass: "lowercase" },
      { transform: "capitalize", expectedClass: "capitalize" },
    ] as const;

    transforms.forEach(({ transform, expectedClass }) => {
      it(`applies ${transform} transform correctly`, () => {
        render(<Typography transform={transform}>Test content</Typography>);
        const element = screen.getByText("Test content");
        if (expectedClass) {
          expect(element).toHaveClass(expectedClass);
        }
      });
    });
  });

  describe("Special Features", () => {
    it("applies truncation classes when truncate prop is provided", () => {
      render(<Typography truncate={2}>Long content that should be truncated</Typography>);
      const element = screen.getByText("Long content that should be truncated");
      expect(element).toHaveClass("line-clamp-2", "overflow-hidden");
    });

    it("applies no-select class when noSelect prop is true", () => {
      render(<Typography noSelect>Non-selectable text</Typography>);
      expect(screen.getByText("Non-selectable text")).toHaveClass("select-none");
    });

    it("passes through additional props", () => {
      render(
        <Typography data-testid="typography-test" title="Test title">
          Test
        </Typography>
      );
      const element = screen.getByTestId("typography-test");
      expect(element).toHaveAttribute("title", "Test title");
    });
  });

  describe("Convenience Components", () => {
    describe("Heading Component", () => {
      it("renders h1 when level is 1", () => {
        render(<Heading level={1}>Heading 1</Heading>);
        const element = screen.getByText("Heading 1");
        expect(element.tagName).toBe("H1");
        expect(element).toHaveClass("text-4xl", "font-bold");
      });

      it("renders h3 when level is 3", () => {
        render(<Heading level={3}>Heading 3</Heading>);
        const element = screen.getByText("Heading 3");
        expect(element.tagName).toBe("H3");
        expect(element).toHaveClass("text-2xl", "font-semibold");
      });

      it("renders h6 when level is 6", () => {
        render(<Heading level={6}>Heading 6</Heading>);
        const element = screen.getByText("Heading 6");
        expect(element.tagName).toBe("H6");
        expect(element).toHaveClass("text-base", "font-medium");
      });
    });

    describe("Text Component", () => {
      it("renders with small size", () => {
        render(<Text size="sm">Small text</Text>);
        const element = screen.getByText("Small text");
        expect(element).toHaveClass("text-sm", "leading-relaxed");
      });

      it("renders with default size", () => {
        render(<Text>Default text</Text>);
        const element = screen.getByText("Default text");
        expect(element).toHaveClass("text-base", "leading-relaxed");
      });

      it("renders with large size", () => {
        render(<Text size="lg">Large text</Text>);
        const element = screen.getByText("Large text");
        expect(element).toHaveClass("text-lg", "leading-relaxed");
      });
    });

    describe("Code Component", () => {
      it("renders as code element with proper styling", () => {
        render(<Code>const x = 1;</Code>);
        const element = screen.getByText("const x = 1;");
        expect(element.tagName).toBe("CODE");
        expect(element).toHaveClass("font-mono", "text-sm", "bg-muted");
      });
    });

    describe("Caption Component", () => {
      it("renders as span with caption styling", () => {
        render(<Caption>Image caption</Caption>);
        const element = screen.getByText("Image caption");
        expect(element.tagName).toBe("SPAN");
        expect(element).toHaveClass("text-xs", "text-muted-foreground");
      });
    });

    describe("Lead Component", () => {
      it("renders as paragraph with lead styling", () => {
        render(<Lead>Lead paragraph text</Lead>);
        const element = screen.getByText("Lead paragraph text");
        expect(element.tagName).toBe("P");
        expect(element).toHaveClass("text-xl", "text-muted-foreground");
      });
    });

    describe("Muted Component", () => {
      it("renders as paragraph with muted styling", () => {
        render(<Muted>Muted text</Muted>);
        const element = screen.getByText("Muted text");
        expect(element.tagName).toBe("P");
        expect(element).toHaveClass("text-sm", "text-muted-foreground");
      });
    });

    describe("Blockquote Component", () => {
      it("renders as blockquote with proper styling", () => {
        render(<Blockquote>Quote text</Blockquote>);
        const element = screen.getByText("Quote text");
        expect(element.tagName).toBe("BLOCKQUOTE");
        expect(element).toHaveClass("border-l-4", "italic", "text-muted-foreground");
      });
    });
  });

  describe("Accessibility", () => {
    it("maintains semantic hierarchy with headings", () => {
      render(
        <div>
          <Typography variant="h1">Main Title</Typography>
          <Typography variant="h2">Section Title</Typography>
          <Typography variant="h3">Subsection Title</Typography>
        </div>
      );

      const h1 = screen.getByRole("heading", { level: 1 });
      const h2 = screen.getByRole("heading", { level: 2 });
      const h3 = screen.getByRole("heading", { level: 3 });

      expect(h1).toHaveTextContent("Main Title");
      expect(h2).toHaveTextContent("Section Title");
      expect(h3).toHaveTextContent("Subsection Title");
    });

    it("preserves text content for screen readers", () => {
      render(<Typography variant="h1">Important Announcement</Typography>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveAccessibleName("Important Announcement");
    });

    it("supports custom aria attributes", () => {
      render(
        <Typography variant="body" aria-label="Additional context" role="note">
          Main content
        </Typography>
      );
      const element = screen.getByRole("note");
      expect(element).toHaveAttribute("aria-label", "Additional context");
    });
  });
});
