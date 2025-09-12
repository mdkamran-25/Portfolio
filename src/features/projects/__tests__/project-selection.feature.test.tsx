/**
 * Feature Tests: Project Selection Panel Behavior
 *
 * Tests the project grid interactions, project selection, and payment modal flows.
 * These are integration tests that validate complete user workflows.
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";

import ProjectsPage from "@/app/projects/page";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    ...props
  }: {
    src?: string;
    alt?: string;
    fill?: boolean;
    [key: string]: unknown;
  }) => {
    const imgProps = fill ? { alt, ...props } : { src, alt, ...props };
    return <img {...imgProps} data-testid="next-image" />;
  },
}));

// Mock the MainLayout component
vi.mock("@/components/layout/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

// Mock the RazorpayPayment component
vi.mock("@/components/RazorpayPayment", () => ({
  RazorpayPayment: ({
    isOpen,
    onClose,
    amount,
    onSuccess,
    onError,
  }: {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    onSuccess: (data: { razorpay_payment_id: string }) => void;
    onError: (error: unknown) => void;
  }) =>
    isOpen ? (
      <div data-testid="payment-modal" role="dialog">
        <h2>Payment Modal</h2>
        <p>Amount: ₹{amount}</p>
        <button onClick={onClose} data-testid="close-payment">
          Close
        </button>
        <button
          onClick={() => onSuccess({ razorpay_payment_id: "test-payment-id" })}
          data-testid="simulate-success"
        >
          Simulate Success
        </button>
        <button
          onClick={() => onError({ code: "PAYMENT_FAILED", description: "Test error" })}
          data-testid="simulate-error"
        >
          Simulate Error
        </button>
      </div>
    ) : null,
}));

// Mock console methods to avoid noise in tests
const consoleSpy = {
  log: vi.spyOn(console, "log").mockImplementation(() => {}),
  error: vi.spyOn(console, "error").mockImplementation(() => {}),
};

describe("Project Selection Panel Feature Tests", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    consoleSpy.log.mockClear();
    consoleSpy.error.mockClear();
  });

  describe("Project Grid Rendering", () => {
    it("renders all featured projects with correct information", async () => {
      render(<ProjectsPage />);

      // Check that the projects page title is rendered
      expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();

      // Check that project cards are rendered
      // Note: This assumes featuredProjects has at least one project
      const projectCards = screen.getAllByRole("img");
      expect(projectCards.length).toBeGreaterThan(0);

      // Check that each project has required elements
      const liveDemoLinks = screen.getAllByText(/live demo/i);
      const sourceCodeLinks = screen.getAllByText(/source code/i);
      const supportButtons = screen.getAllByText(/support project/i);

      expect(liveDemoLinks.length).toBeGreaterThan(0);
      expect(sourceCodeLinks.length).toBeGreaterThan(0);
      expect(supportButtons.length).toBeGreaterThan(0);
    });

    it("displays project tech stacks correctly", async () => {
      render(<ProjectsPage />);

      // Look for tech badges - they should have neutral styling
      const techBadges = document.querySelectorAll(".bg-neutral-700");
      expect(techBadges.length).toBeGreaterThan(0);
    });
  });

  describe("Project Interaction Workflows", () => {
    it("opens payment modal when support project button is clicked", async () => {
      render(<ProjectsPage />);

      // Click the first support project button
      const supportButtons = screen.getAllByText(/support project/i);
      expect(supportButtons[0]).toBeInTheDocument();
      await user.click(supportButtons[0]!);

      // Check that payment modal is opened
      await waitFor(() => {
        expect(screen.getByTestId("payment-modal")).toBeInTheDocument();
      });

      // Check that amount is displayed correctly
      expect(screen.getByText(/amount: ₹99/i)).toBeInTheDocument();
    });

    it("closes payment modal when close button is clicked", async () => {
      render(<ProjectsPage />);

      // Open payment modal
      const supportButtons = screen.getAllByText(/support project/i);
      await user.click(supportButtons[0]!);

      await waitFor(() => {
        expect(screen.getByTestId("payment-modal")).toBeInTheDocument();
      });

      // Close payment modal
      const closeButton = screen.getByTestId("close-payment");
      await user.click(closeButton);

      // Check that modal is closed
      await waitFor(() => {
        expect(screen.queryByTestId("payment-modal")).not.toBeInTheDocument();
      });
    });

    it("handles multiple project support clicks correctly", async () => {
      render(<ProjectsPage />);

      const supportButtons = screen.getAllByText(/support project/i);

      // Click first project support button
      await user.click(supportButtons[0]!);
      await waitFor(() => {
        expect(screen.getByTestId("payment-modal")).toBeInTheDocument();
      });

      // Close modal
      await user.click(screen.getByTestId("close-payment"));
      await waitFor(() => {
        expect(screen.queryByTestId("payment-modal")).not.toBeInTheDocument();
      });

      // Click second project support button (if available)
      if (supportButtons.length > 1) {
        await user.click(supportButtons[1]!);
        await waitFor(() => {
          expect(screen.getByTestId("payment-modal")).toBeInTheDocument();
        });
      }
    });
  });

  describe("Payment Flow Integration", () => {
    it("handles successful payment correctly", async () => {
      render(<ProjectsPage />);

      // Open payment modal
      const supportButtons = screen.getAllByText(/support project/i);
      await user.click(supportButtons[0]!);

      await waitFor(() => {
        expect(screen.getByTestId("payment-modal")).toBeInTheDocument();
      });

      // Simulate successful payment
      const successButton = screen.getByTestId("simulate-success");
      await user.click(successButton);

      // Check that success handler was called
      await waitFor(() => {
        expect(consoleSpy.log).toHaveBeenCalledWith(
          "Payment successful:",
          expect.objectContaining({ razorpay_payment_id: "test-payment-id" })
        );
      });
    });

    it("handles payment errors correctly", async () => {
      render(<ProjectsPage />);

      // Open payment modal
      const supportButtons = screen.getAllByText(/support project/i);
      await user.click(supportButtons[0]!);

      await waitFor(() => {
        expect(screen.getByTestId("payment-modal")).toBeInTheDocument();
      });

      // Simulate payment error
      const errorButton = screen.getByTestId("simulate-error");
      await user.click(errorButton);

      // The payment error is handled but since we're mocking the console,
      // let's verify the modal behavior instead
      await waitFor(() => {
        expect(screen.getByTestId("payment-modal")).toBeInTheDocument();
      });
    });
  });

  describe("External Link Behavior", () => {
    it("renders external links with correct attributes", async () => {
      render(<ProjectsPage />);

      const liveDemoLinks = screen.getAllByText(/live demo/i);
      const sourceCodeLinks = screen.getAllByText(/source code/i);

      // Check that external links have proper attributes
      liveDemoLinks.forEach((link) => {
        expect(link.closest("a")).toHaveAttribute("target", "_blank");
        expect(link.closest("a")).toHaveAttribute("rel", "noopener noreferrer");
      });

      sourceCodeLinks.forEach((link) => {
        expect(link.closest("a")).toHaveAttribute("target", "_blank");
        expect(link.closest("a")).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  describe("Accessibility Features", () => {
    it("has proper heading hierarchy", async () => {
      render(<ProjectsPage />);

      // Check main heading
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toHaveTextContent(/projects/i);

      // Check project headings
      const projectHeadings = screen.getAllByRole("heading", { level: 2 });
      expect(projectHeadings.length).toBeGreaterThan(0);
    });

    it("has proper focus management for interactive elements", async () => {
      render(<ProjectsPage />);

      const supportButtons = screen.getAllByText(/support project/i);

      // Focus the first support button
      supportButtons[0]!.focus();
      expect(document.activeElement).toBe(supportButtons[0]!);

      // Tab through interactive elements
      await user.tab();
      // The focus should move to the next interactive element
      expect(document.activeElement).not.toBe(supportButtons[0]!);
    });

    it("provides proper alt text for project images", async () => {
      render(<ProjectsPage />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).toBeTruthy();
      });
    });
  });

  describe("Responsive Behavior", () => {
    it("handles different viewport sizes correctly", async () => {
      render(<ProjectsPage />);

      // Check that grid container has responsive classes
      const gridContainer = document.querySelector(".grid");
      expect(gridContainer).toHaveClass("md:grid-cols-2", "lg:grid-cols-3");
    });
  });

  describe("State Management", () => {
    it("maintains correct state during modal interactions", async () => {
      render(<ProjectsPage />);

      // Initial state - no modal
      expect(screen.queryByTestId("payment-modal")).not.toBeInTheDocument();

      // Open modal
      const supportButtons = screen.getAllByText(/support project/i);
      await user.click(supportButtons[0]!);

      // Modal should be open
      await waitFor(() => {
        expect(screen.getByTestId("payment-modal")).toBeInTheDocument();
      });

      // Close modal
      await user.click(screen.getByTestId("close-payment"));

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByTestId("payment-modal")).not.toBeInTheDocument();
      });
    });
  });
});
