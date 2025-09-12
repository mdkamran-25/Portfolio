/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, beforeEach, afterEach, it, expect } from "vitest";

import { LanguageSwitcher } from "../../../components/common/LanguageSwitcher";

// Mock next-intl
vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    // Clear console.log calls
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the current locale correctly", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /select language/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("🇺🇸");
    expect(button).toHaveTextContent("English");
  });

  it("toggles dropdown when clicked", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /select language/i });

    // Initially closed
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // Click to close
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("displays all available locales in dropdown", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /select language/i });
    fireEvent.click(button);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4); // en, es, fr, ar

    expect(screen.getAllByText("English")).toHaveLength(2); // Button + dropdown option
    expect(screen.getByText("Español")).toBeInTheDocument();
    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("العربية")).toBeInTheDocument();
  });

  it("marks current locale as selected", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /select language/i });
    fireEvent.click(button);

    const currentOption = screen.getByRole("option", { name: /english/i });
    expect(currentOption).toHaveAttribute("aria-selected", "true");
    expect(currentOption).toHaveClass("bg-orange-50", "text-orange-900");
  });

  it("handles locale selection", () => {
    const consoleSpy = vi.spyOn(console, "log");
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /select language/i });
    fireEvent.click(button);

    const spanishOption = screen.getByRole("option", { name: /español/i });
    fireEvent.click(spanishOption);

    expect(consoleSpy).toHaveBeenCalledWith("Changing locale to:", "es");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("supports keyboard navigation", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /select language/i });

    // Focus management
    button.focus();
    expect(button).toHaveFocus();

    // Click to open first, then check if dropdown exists
    fireEvent.click(button);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<LanguageSwitcher className="custom-class" />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("has proper ARIA attributes", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /select language/i });

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-haspopup", "listbox");
    expect(button).toHaveAttribute("aria-label", "Select language");

    fireEvent.click(button);

    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    options.forEach((option) => {
      expect(option).toHaveAttribute("aria-selected");
    });
  });
});
