import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { List, ListItem } from "./List";

describe("Accessible List Components", () => {
  describe("List", () => {
    it("renders as ul by default", () => {
      render(
        <List data-testid="test-list">
          <ListItem>Item 1</ListItem>
          <ListItem>Item 2</ListItem>
        </List>
      );

      const list = screen.getByTestId("test-list");
      expect(list.tagName).toBe("UL");
      expect(list).toHaveAttribute("role", "list");
    });

    it("renders as ol when specified", () => {
      render(
        <List as="ol" data-testid="test-list">
          <ListItem>Item 1</ListItem>
          <ListItem>Item 2</ListItem>
        </List>
      );

      const list = screen.getByTestId("test-list");
      expect(list.tagName).toBe("OL");
    });

    it("applies aria-label when provided", () => {
      render(
        <List label="Featured projects" data-testid="test-list">
          <ListItem>Item 1</ListItem>
        </List>
      );

      expect(screen.getByTestId("test-list")).toHaveAttribute("aria-label", "Featured projects");
    });

    it("provides description with aria-describedby", () => {
      render(
        <List description="List of all available projects" data-testid="test-list">
          <ListItem>Item 1</ListItem>
        </List>
      );

      const list = screen.getByTestId("test-list");
      const descriptionId = list.getAttribute("aria-describedby");
      expect(descriptionId).toBeTruthy();
      expect(screen.getByText("List of all available projects")).toHaveAttribute(
        "id",
        descriptionId
      );
    });

    it("applies custom className", () => {
      render(
        <List className="custom-list-class" data-testid="test-list">
          <ListItem>Item 1</ListItem>
        </List>
      );

      expect(screen.getByTestId("test-list")).toHaveClass("custom-list-class");
    });
  });

  describe("ListItem", () => {
    it("renders with proper list item semantics", () => {
      render(
        <List>
          <ListItem data-testid="test-item">Item content</ListItem>
        </List>
      );

      const item = screen.getByTestId("test-item");
      expect(item.tagName).toBe("LI");
      expect(item).toHaveTextContent("Item content");
    });

    it("provides position information when index and total are specified", () => {
      render(
        <List>
          <ListItem index={0} total={3} data-testid="test-item">
            First item
          </ListItem>
        </List>
      );

      expect(screen.getByTestId("test-item")).toHaveAttribute("aria-label", "Item 1 of 3");
    });

    it("applies custom className", () => {
      render(
        <List>
          <ListItem className="custom-item-class" data-testid="test-item">
            Item content
          </ListItem>
        </List>
      );

      expect(screen.getByTestId("test-item")).toHaveClass("custom-item-class");
    });

    it("forwards props correctly", () => {
      render(
        <List>
          <ListItem data-custom="custom-value" data-testid="test-item">
            Item content
          </ListItem>
        </List>
      );

      expect(screen.getByTestId("test-item")).toHaveAttribute("data-custom", "custom-value");
    });
  });

  describe("Integration", () => {
    it("creates proper semantic structure for project lists", () => {
      const projects = [
        { id: 1, title: "Project A" },
        { id: 2, title: "Project B" },
        { id: 3, title: "Project C" },
      ];

      render(
        <List
          label="Featured projects"
          description="A curated list of showcase projects"
          data-testid="projects-list"
        >
          {projects.map((project, index) => (
            <ListItem
              key={project.id}
              index={index}
              total={projects.length}
              data-testid={`project-${project.id}`}
            >
              <h3>{project.title}</h3>
            </ListItem>
          ))}
        </List>
      );

      // Verify semantic structure
      const list = screen.getByTestId("projects-list");
      expect(list).toHaveAttribute("role", "list");
      expect(list).toHaveAttribute("aria-label", "Featured projects");

      // Verify all items are present with position info
      expect(screen.getByTestId("project-1")).toHaveAttribute("aria-label", "Item 1 of 3");
      expect(screen.getByTestId("project-2")).toHaveAttribute("aria-label", "Item 2 of 3");
      expect(screen.getByTestId("project-3")).toHaveAttribute("aria-label", "Item 3 of 3");
    });
  });
});
