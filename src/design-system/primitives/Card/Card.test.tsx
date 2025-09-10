import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";

describe("Card", () => {
  it("renders with default props", () => {
    render(
      <Card data-testid="card">
        <div>Card content</div>
      </Card>
    );

    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("rounded-lg", "border", "bg-card", "shadow-sm");
  });

  it("renders different variants", () => {
    const { rerender } = render(
      <Card data-testid="card" variant="default">
        Content
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveClass("border-border");

    rerender(
      <Card data-testid="card" variant="elevated">
        Content
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveClass("shadow-md");

    rerender(
      <Card data-testid="card" variant="outlined">
        Content
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveClass("border-2", "shadow-none");

    rerender(
      <Card data-testid="card" variant="ghost">
        Content
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveClass("border-transparent", "bg-transparent");
  });

  it("renders different padding sizes", () => {
    const { rerender } = render(
      <Card data-testid="card" padding="none">
        Content
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveClass("p-0");

    rerender(
      <Card data-testid="card" padding="sm">
        Content
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveClass("p-4");

    rerender(
      <Card data-testid="card" padding="default">
        Content
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveClass("p-6");

    rerender(
      <Card data-testid="card" padding="lg">
        Content
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveClass("p-8");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveTextContent("Content");
  });

  it("accepts custom className", () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("custom-class");
    expect(card).toHaveClass("rounded-lg"); // Should still have base classes
  });
});

describe("CardHeader", () => {
  it("renders with correct classes", () => {
    render(<CardHeader data-testid="header">Header content</CardHeader>);

    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("flex", "flex-col", "space-y-1.5", "p-6");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Header</CardHeader>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("CardTitle", () => {
  it("renders as h3 by default", () => {
    render(<CardTitle>Title text</CardTitle>);

    const title = screen.getByRole("heading", { level: 3 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Title text");
    expect(title).toHaveClass("font-semibold", "leading-none", "tracking-tight");
  });

  it("renders as different heading levels", () => {
    const { rerender } = render(<CardTitle as="h1">Title</CardTitle>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    rerender(<CardTitle as="h2">Title</CardTitle>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();

    rerender(<CardTitle as="h4">Title</CardTitle>);
    expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
  });
});

describe("CardDescription", () => {
  it("renders with correct classes", () => {
    render(<CardDescription data-testid="description">Description text</CardDescription>);

    const description = screen.getByTestId("description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent("Description text");
    expect(description).toHaveClass("text-sm", "text-muted-foreground");
  });
});

describe("CardContent", () => {
  it("renders with correct classes", () => {
    render(<CardContent data-testid="content">Content text</CardContent>);

    const content = screen.getByTestId("content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("p-6", "pt-0");
  });
});

describe("CardFooter", () => {
  it("renders with correct classes", () => {
    render(<CardFooter data-testid="footer">Footer content</CardFooter>);

    const footer = screen.getByTestId("footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("flex", "items-center", "p-6", "pt-0");
  });
});

describe("Card Composition", () => {
  it("renders a complete card with all components", () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description text</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main card content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByTestId("complete-card")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Card Title" })).toBeInTheDocument();
    expect(screen.getByText("Card description text")).toBeInTheDocument();
    expect(screen.getByText("Main card content goes here")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});
