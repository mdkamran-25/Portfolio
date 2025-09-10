import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input, Textarea } from "./Input";

// Mock icons for testing
const MockIcon = () => <span data-testid="mock-icon">Icon</span>;

describe("Input", () => {
  describe("Basic Functionality", () => {
    it("renders with default props", () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass("flex", "w-full", "border", "border-input");
    });

    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("handles value and onChange", () => {
      const handleChange = vi.fn();
      render(<Input value="test" onChange={handleChange} />);

      const input = screen.getByDisplayValue("test");
      fireEvent.change(input, { target: { value: "new value" } });

      expect(handleChange).toHaveBeenCalled();
    });

    it("applies custom className", () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-class");
    });

    it("passes through standard input props", () => {
      render(<Input type="email" disabled required />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveAttribute("type", "email");
      expect(input).toBeDisabled();
      expect(input).toBeRequired();
    });
  });

  describe("Variants", () => {
    const variants = [
      { variant: "default", expectedClass: "rounded-md" },
      { variant: "ghost", expectedClass: "border-0" },
      { variant: "filled", expectedClass: "bg-muted" },
      { variant: "underlined", expectedClass: "border-b" },
    ] as const;

    variants.forEach(({ variant, expectedClass }) => {
      it(`applies ${variant} variant styling`, () => {
        render(<Input variant={variant} />);
        expect(screen.getByRole("textbox")).toHaveClass(expectedClass);
      });
    });
  });

  describe("Sizes", () => {
    const sizes = [
      { size: "sm", expectedClass: "h-8" },
      { size: "default", expectedClass: "h-10" },
      { size: "lg", expectedClass: "h-12" },
    ] as const;

    sizes.forEach(({ size, expectedClass }) => {
      it(`applies ${size} size styling`, () => {
        render(<Input size={size} />);
        expect(screen.getByRole("textbox")).toHaveClass(expectedClass);
      });
    });
  });

  describe("States", () => {
    const states = [
      { state: "default", expectedClass: "" },
      { state: "error", expectedClass: "border-destructive" },
      { state: "success", expectedClass: "border-green-500" },
      { state: "warning", expectedClass: "border-yellow-500" },
    ] as const;

    states.forEach(({ state, expectedClass }) => {
      it(`applies ${state} state styling`, () => {
        render(<Input state={state} />);
        const input = screen.getByRole("textbox");
        if (expectedClass) {
          expect(input).toHaveClass(expectedClass);
        }
      });
    });

    it("handles legacy error prop", () => {
      render(<Input error />);
      expect(screen.getByRole("textbox")).toHaveClass("border-destructive");
    });
  });

  describe("Icons", () => {
    it("renders left icon", () => {
      render(<Input leftIcon={<MockIcon />} />);
      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveClass("pl-10");
    });

    it("renders right icon", () => {
      render(<Input rightIcon={<MockIcon />} />);
      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveClass("pr-10");
    });

    it("renders both icons", () => {
      render(
        <Input
          leftIcon={<span data-testid="left-icon">Left</span>}
          rightIcon={<span data-testid="right-icon">Right</span>}
        />
      );

      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveClass("px-10");
    });
  });

  describe("Messages", () => {
    it("displays helper text", () => {
      render(<Input helperText="This is helper text" />);
      expect(screen.getByText("This is helper text")).toBeInTheDocument();
      expect(screen.getByText("This is helper text")).toHaveClass("text-muted-foreground");
    });

    it("displays error message with proper styling", () => {
      render(<Input errorMessage="This field is required" />);
      const message = screen.getByText("This field is required");
      expect(message).toBeInTheDocument();
      expect(message).toHaveClass("text-destructive");
    });

    it("displays success message with proper styling", () => {
      render(<Input successMessage="Input is valid" />);
      const message = screen.getByText("Input is valid");
      expect(message).toBeInTheDocument();
      expect(message).toHaveClass("text-green-600");
    });

    it("prioritizes error message over other messages", () => {
      render(
        <Input
          helperText="Helper text"
          errorMessage="Error message"
          successMessage="Success message"
        />
      );

      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
      expect(screen.queryByText("Success message")).not.toBeInTheDocument();
    });

    it("prioritizes success message over helper text", () => {
      render(<Input helperText="Helper text" successMessage="Success message" />);

      expect(screen.getByText("Success message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });
  });

  describe("Character Count", () => {
    it("displays character count when showCount is true and maxLength is set", () => {
      render(<Input value="hello" maxLength={10} showCount />);
      expect(screen.getByText("5/10")).toBeInTheDocument();
    });

    it("does not display character count when showCount is false", () => {
      render(<Input value="hello" maxLength={10} showCount={false} />);
      expect(screen.queryByText("5/10")).not.toBeInTheDocument();
    });

    it("does not display character count when maxLength is not set", () => {
      render(<Input value="hello" showCount />);
      expect(screen.queryByText("5")).not.toBeInTheDocument();
    });

    it("applies warning color when approaching limit", () => {
      render(<Input value="123456789" maxLength={10} showCount />);
      const count = screen.getByText("9/10");
      expect(count).toHaveClass("text-yellow-600");
    });

    it("applies error color when at or over limit", () => {
      render(<Input value="1234567890" maxLength={10} showCount />);
      const count = screen.getByText("10/10");
      expect(count).toHaveClass("text-destructive");
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label", () => {
      render(<Input aria-label="Search input" />);
      expect(screen.getByLabelText("Search input")).toBeInTheDocument();
    });

    it("supports aria-describedby for helper text", () => {
      render(<Input aria-describedby="helper" helperText="Helper text" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "helper");
    });

    it("maintains focus visibility", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("focus-visible:outline-none", "focus-visible:ring-2");
    });
  });
});

describe("Textarea", () => {
  describe("Basic Functionality", () => {
    it("renders with default props", () => {
      render(<Textarea placeholder="Enter text" />);
      const textarea = screen.getByPlaceholderText("Enter text");
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it("handles value and onChange", () => {
      const handleChange = vi.fn();
      render(<Textarea value="test content" onChange={handleChange} />);

      const textarea = screen.getByDisplayValue("test content");
      fireEvent.change(textarea, { target: { value: "new content" } });

      expect(handleChange).toHaveBeenCalled();
    });

    it("applies custom className", () => {
      render(<Textarea className="custom-textarea" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-textarea");
    });
  });

  describe("Rows and Sizing", () => {
    it("applies default minRows", () => {
      render(<Textarea />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "3");
    });

    it("applies custom minRows", () => {
      render(<Textarea minRows={5} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "5");
    });

    it("prioritizes explicit rows over minRows", () => {
      render(<Textarea minRows={5} rows={2} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "2");
    });

    it("applies autoResize styling", () => {
      render(<Textarea autoResize />);
      expect(screen.getByRole("textbox")).toHaveClass("resize-none");
    });
  });

  describe("Variants and States", () => {
    it("applies variant styling", () => {
      render(<Textarea variant="filled" />);
      expect(screen.getByRole("textbox")).toHaveClass("bg-muted");
    });

    it("applies state styling", () => {
      render(<Textarea state="error" />);
      expect(screen.getByRole("textbox")).toHaveClass("border-destructive");
    });

    it("applies size styling", () => {
      render(<Textarea size="lg" />);
      expect(screen.getByRole("textbox")).toHaveClass("h-12");
    });
  });

  describe("Messages and Character Count", () => {
    it("displays helper text", () => {
      render(<Textarea helperText="Enter your message" />);
      expect(screen.getByText("Enter your message")).toBeInTheDocument();
    });

    it("displays character count", () => {
      render(<Textarea value="Hello world" maxLength={50} showCount />);
      expect(screen.getByText("11/50")).toBeInTheDocument();
    });

    it("shows error message with proper styling", () => {
      render(<Textarea errorMessage="Message is too long" />);
      const message = screen.getByText("Message is too long");
      expect(message).toHaveClass("text-destructive");
    });

    it("shows success message with proper styling", () => {
      render(<Textarea successMessage="Message looks good" />);
      const message = screen.getByText("Message looks good");
      expect(message).toHaveClass("text-green-600");
    });
  });

  describe("Accessibility", () => {
    it("supports standard textarea attributes", () => {
      render(<Textarea required disabled />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeRequired();
      expect(textarea).toBeDisabled();
    });

    it("maintains accessible focus states", () => {
      render(<Textarea />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("focus-visible:outline-none", "focus-visible:ring-2");
    });
  });
});
