/**
 * Focus Management Tests
 *
 * Tests for WCAG 2.1 AA compliant focus management utilities
 */

import { fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { useFocusTrap, useAnnouncer, useAutoFocus } from "@/shared/hooks/useFocusManagement";

// Setup proper DOM environment
beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks();
});

describe("useFocusTrap", () => {
  let container: HTMLDivElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let button3: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    button1 = document.createElement("button");
    button2 = document.createElement("button");
    button3 = document.createElement("button");

    button1.textContent = "Button 1";
    button2.textContent = "Button 2";
    button3.textContent = "Button 3";

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should trap focus within container when active", async () => {
    const { result } = renderHook(() => useFocusTrap(true));

    act(() => {
      result.current.containerRef.current = container;
    });

    // Focus should be trapped within the container
    button1.focus();

    // Simulate tab key press on last element
    button3.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    // Should wrap to first element
    await waitFor(() => {
      expect(document.activeElement).toBe(button1);
    });
  });

  it("should handle Shift+Tab to move backwards", async () => {
    const { result } = renderHook(() => useFocusTrap(true));

    act(() => {
      result.current.containerRef.current = container;
    });

    button1.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });

    await waitFor(() => {
      expect(document.activeElement).toBe(button3);
    });
  });

  it("should emit escape event when Escape key is pressed", () => {
    const { result } = renderHook(() => useFocusTrap(true));
    const dispatchEventSpy = vi.spyOn(container, "dispatchEvent");

    act(() => {
      result.current.containerRef.current = container;
    });

    fireEvent.keyDown(document, { key: "Escape" });

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "focustrap:escape",
        bubbles: true,
      })
    );
  });

  it("should restore focus when deactivated", () => {
    const outsideButton = document.createElement("button");
    outsideButton.textContent = "Outside Button";
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const { result, rerender } = renderHook(({ active }) => useFocusTrap(active), {
      initialProps: { active: false },
    });

    act(() => {
      result.current.containerRef.current = container;
    });

    // Activate focus trap
    rerender({ active: true });

    // Deactivate focus trap
    rerender({ active: false });

    expect(document.activeElement).toBe(outsideButton);
  });

  it("should focus first element when activated", async () => {
    const { result, rerender } = renderHook(({ active }) => useFocusTrap(active), {
      initialProps: { active: false },
    });

    act(() => {
      result.current.containerRef.current = container;
    });

    rerender({ active: true });

    await waitFor(() => {
      expect(document.activeElement).toBe(button1);
    });
  });

  it("should handle containers with no focusable elements", () => {
    const emptyContainer = document.createElement("div");
    document.body.appendChild(emptyContainer);

    const { result } = renderHook(() => useFocusTrap(true));

    act(() => {
      result.current.containerRef.current = emptyContainer;
    });

    // Should not throw error
    fireEvent.keyDown(document, { key: "Tab" });
    expect(true).toBe(true); // Test passes if no error is thrown
  });
});

describe("useAnnouncer", () => {
  let announcer: HTMLDivElement | null;

  beforeEach(() => {
    document.body.innerHTML = "";
    announcer = null;
  });

  afterEach(() => {
    const existingAnnouncer = document.getElementById("a11y-announcer");
    if (existingAnnouncer) {
      existingAnnouncer.remove();
    }
  });

  it("should create announcer element when first used", () => {
    const { result } = renderHook(() => useAnnouncer());

    act(() => {
      result.current.announce("Test message");
    });

    announcer = document.getElementById("a11y-announcer") as HTMLDivElement;

    expect(announcer).toBeTruthy();
    expect(announcer?.getAttribute("aria-live")).toBe("polite");
    expect(announcer?.getAttribute("aria-atomic")).toBe("true");
    expect(announcer?.className).toBe("sr-only");
  });

  it("should announce messages with polite priority by default", async () => {
    const { result } = renderHook(() => useAnnouncer());

    act(() => {
      result.current.announce("Test message");
    });

    await waitFor(() => {
      announcer = document.getElementById("a11y-announcer") as HTMLDivElement;
      expect(announcer?.textContent).toBe("Test message");
    });
  });

  it("should announce messages with assertive priority when specified", async () => {
    const { result } = renderHook(() => useAnnouncer());

    act(() => {
      result.current.announce("Urgent message", "assertive");
    });

    await waitFor(() => {
      announcer = document.getElementById("a11y-announcer") as HTMLDivElement;
      expect(announcer?.getAttribute("aria-live")).toBe("assertive");
      expect(announcer?.textContent).toBe("Urgent message");
    });
  });

  it("should clear previous message before announcing new one", async () => {
    const { result } = renderHook(() => useAnnouncer());

    act(() => {
      result.current.announce("First message");
    });

    await waitFor(() => {
      announcer = document.getElementById("a11y-announcer") as HTMLDivElement;
      expect(announcer?.textContent).toBe("First message");
    });

    act(() => {
      result.current.announce("Second message");
    });

    // Should briefly be empty, then show new message
    expect(announcer?.textContent).toBe("");

    await waitFor(() => {
      expect(announcer?.textContent).toBe("Second message");
    });
  });

  it("should clean up announcer on unmount", () => {
    const { result, unmount } = renderHook(() => useAnnouncer());

    act(() => {
      result.current.announce("Test message");
    });

    announcer = document.getElementById("a11y-announcer") as HTMLDivElement;
    expect(announcer).toBeTruthy();

    unmount();

    expect(document.getElementById("a11y-announcer")).toBeNull();
  });
});

describe("useAutoFocus", () => {
  let container: HTMLDivElement;
  let input1: HTMLInputElement;
  let input2: HTMLInputElement;
  let invalidInput: HTMLInputElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    input1 = document.createElement("input");
    input2 = document.createElement("input");
    invalidInput = document.createElement("input");

    input1.type = "text";
    input2.type = "email";
    invalidInput.type = "email";
    invalidInput.value = "invalid-email";
    invalidInput.setCustomValidity("Invalid email");

    container.appendChild(input1);
    container.appendChild(input2);
    container.appendChild(invalidInput);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should focus first invalid field when present", async () => {
    const { result } = renderHook(() => useAutoFocus(true));

    act(() => {
      result.current.containerRef.current = container;
    });

    const focused = result.current.focusFirstInvalid();

    expect(focused).toBe(true);
    await waitFor(() => {
      expect(document.activeElement).toBe(invalidInput);
    });
  });

  it("should focus first input when no invalid fields present", async () => {
    // Remove the invalid input to test case where no invalid fields exist
    invalidInput.remove();

    const { result } = renderHook(() => useAutoFocus(true));

    act(() => {
      result.current.containerRef.current = container;
    });

    // First check for invalid fields (should find none)
    const foundInvalid = result.current.focusFirstInvalid();
    expect(foundInvalid).toBe(false);

    // Then focus first input
    const focusedInput = result.current.focusFirstInput();
    expect(focusedInput).toBe(true);

    await waitFor(() => {
      expect(document.activeElement).toBe(input1);
    });
  });

  it("should not focus when shouldFocus is false", () => {
    const { result } = renderHook(() => useAutoFocus(false));

    act(() => {
      result.current.containerRef.current = container;
    });

    // Focus should not change
    expect(document.activeElement).toBe(document.body);
  });

  it("should return false when no focusable elements exist", () => {
    const emptyContainer = document.createElement("div");
    document.body.appendChild(emptyContainer);

    const { result } = renderHook(() => useAutoFocus(true));

    act(() => {
      result.current.containerRef.current = emptyContainer;
    });

    const foundInvalid = result.current.focusFirstInvalid();
    const focusedInput = result.current.focusFirstInput();

    expect(foundInvalid).toBe(false);
    expect(focusedInput).toBe(false);
  });

  it("should skip disabled inputs", () => {
    input1.disabled = true;

    const { result } = renderHook(() => useAutoFocus(true));

    act(() => {
      result.current.containerRef.current = container;
    });

    const focusedInput = result.current.focusFirstInput();

    expect(focusedInput).toBe(true);
    expect(document.activeElement).toBe(input2);
  });
});
