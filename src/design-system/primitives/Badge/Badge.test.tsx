import React from "react";
import { describe, it, expect } from "vitest";

import { render, screen } from "@/test/utils";

import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children correctly", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByRole("badge");
    expect(badge).toHaveClass("bg-neutral-600/20", "text-neutral-300");
  });

  it("applies primary variant styles", () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByRole("badge");
    expect(badge).toHaveClass("bg-orange-500/20", "text-orange-300");
  });

  it("applies tech variant with tech name", () => {
    render(
      <Badge variant="tech" techName="React">
        React
      </Badge>
    );
    const badge = screen.getByRole("badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("React");
  });

  it("applies different sizes correctly", () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByRole("badge")).toHaveClass("px-2", "py-0.5", "text-xs");

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByRole("badge")).toHaveClass("px-4", "py-1.5", "text-sm");
  });

  it("applies hover effects", () => {
    render(<Badge>Hover Test</Badge>);
    const badge = screen.getByRole("badge");
    expect(badge).toHaveClass("hover:scale-105");
  });

  it("applies focus styles for accessibility", () => {
    render(<Badge>Focus Test</Badge>);
    const badge = screen.getByRole("badge");
    expect(badge).toHaveClass("focus:ring-2", "focus:ring-orange-500");
  });

  it("forwards refs correctly", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Ref Test</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("handles custom className", () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByRole("badge");
    expect(badge).toHaveClass("custom-class");
  });

  it("supports all semantic variants", () => {
    const variants = ["success", "warning", "error"] as const;

    variants.forEach((variant) => {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      const badge = screen.getByRole("badge");
      expect(badge).toBeInTheDocument();
      unmount();
    });
  });
});
