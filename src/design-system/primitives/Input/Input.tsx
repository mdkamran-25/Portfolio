import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "flex w-full border border-input bg-background px-3 py-2 text-sm",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-colors duration-200",
  ],
  {
    variants: {
      variant: {
        default: "rounded-md",
        ghost: "border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        filled: "bg-muted border-0 focus-visible:bg-background",
        underlined:
          "border-0 border-b border-input rounded-none px-0 focus-visible:ring-0 focus-visible:border-ring",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-10 px-3",
        lg: "h-12 px-4 text-base",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /**
   * Whether the input is in an error state
   * @deprecated Use state="error" instead
   */
  error?: boolean;
  /**
   * Input icon or element to display on the left
   */
  leftIcon?: ReactNode;
  /**
   * Input icon or element to display on the right
   */
  rightIcon?: ReactNode;
  /**
   * Help text to display below the input
   */
  helperText?: string;
  /**
   * Error message to display below the input
   */
  errorMessage?: string | undefined;
  /**
   * Success message to display below the input
   */
  successMessage?: string | undefined;
  /**
   * Whether to show character count (requires maxLength)
   */
  showCount?: boolean;
}

/**
 * Input component for form fields with comprehensive styling and state management.
 *
 * Features:
 * - Multiple visual variants (default, ghost, filled, underlined)
 * - Size variants for different contexts
 * - State management (error, success, warning)
 * - Icon support on both sides
 * - Helper text and validation messages
 * - Character count display
 * - Full accessibility support
 * - File input styling
 *
 * @example
 * ```tsx
 * <Input placeholder="Enter your email" />
 * <Input variant="filled" leftIcon={<MailIcon />} />
 * <Input state="error" errorMessage="Invalid email" />
 * <Input type="password" rightIcon={<EyeIcon />} />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      state,
      error,
      leftIcon,
      rightIcon,
      helperText,
      errorMessage,
      successMessage,
      showCount,
      value,
      maxLength,
      ...props
    },
    ref
  ) => {
    // Handle legacy error prop
    const finalState = error ? "error" : state;

    // Determine if we need a wrapper for icons or messages
    const hasIcons = leftIcon || rightIcon;
    const hasMessages = helperText || errorMessage || successMessage || showCount;
    const hasWrapper = hasIcons || hasMessages;

    // Calculate character count
    const currentLength = typeof value === "string" ? value.length : 0;
    const showCharCount = showCount && maxLength;

    // Determine message to display
    const messageToShow = errorMessage || successMessage || helperText;
    const messageType = errorMessage ? "error" : successMessage ? "success" : "helper";

    const inputElement = (
      <input
        className={cn(
          inputVariants({ variant, size, state: finalState }),
          hasIcons && "px-10", // Add padding when icons are present
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          className
        )}
        ref={ref}
        value={value}
        maxLength={maxLength}
        {...props}
      />
    );

    if (!hasWrapper) {
      return inputElement;
    }

    return (
      <div className="w-full">
        {/* Input with icons wrapper */}
        <div className="relative">
          {leftIcon && (
            <div className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
              {leftIcon}
            </div>
          )}

          {inputElement}

          {rightIcon && (
            <div className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Messages and character count */}
        {hasMessages && (
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <div className="flex-1">
              {messageToShow && (
                <p
                  className={cn(
                    "text-muted-foreground",
                    messageType === "error" && "text-destructive",
                    messageType === "success" && "text-green-600"
                  )}
                >
                  {messageToShow}
                </p>
              )}
            </div>

            {showCharCount && (
              <div
                className={cn(
                  "ml-2",
                  maxLength && currentLength >= maxLength
                    ? "text-destructive"
                    : maxLength && currentLength >= maxLength * 0.9
                      ? "text-yellow-600"
                      : "text-muted-foreground"
                )}
              >
                {currentLength}
                {maxLength && `/${maxLength}`}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Textarea component that shares styling with Input
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    Pick<InputProps, "variant" | "size" | "state" | "helperText" | "showCount"> {
  /**
   * Error message to display below the textarea
   */
  errorMessage?: string | undefined;
  /**
   * Success message to display below the textarea
   */
  successMessage?: string | undefined;
  /**
   * Minimum number of rows to display
   */
  minRows?: number;
  /**
   * Whether the textarea should auto-resize based on content
   */
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      state = "default",
      helperText,
      errorMessage,
      successMessage,
      showCount,
      value,
      maxLength,
      minRows = 3,
      autoResize = false,
      rows,
      ...props
    },
    ref
  ) => {
    const hasMessages = helperText || errorMessage || successMessage || showCount;

    // Calculate character count
    const currentLength = typeof value === "string" ? value.length : 0;
    const showCharCount = showCount && maxLength;

    // Determine message to display
    const messageToShow = errorMessage || successMessage || helperText;
    const messageType = errorMessage ? "error" : successMessage ? "success" : "helper";

    const textareaElement = (
      <textarea
        className={cn(
          inputVariants({ variant, size, state }),
          "min-h-[60px] resize-y",
          autoResize && "resize-none",
          className
        )}
        ref={ref}
        value={value}
        maxLength={maxLength}
        rows={rows || minRows}
        {...props}
      />
    );

    if (!hasMessages) {
      return textareaElement;
    }

    return (
      <div className="w-full">
        {textareaElement}

        {/* Messages and character count */}
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <div className="flex-1">
            {messageToShow && (
              <p
                className={cn(
                  "text-muted-foreground",
                  messageType === "error" && "text-destructive",
                  messageType === "success" && "text-green-600"
                )}
              >
                {messageToShow}
              </p>
            )}
          </div>

          {showCharCount && (
            <div
              className={cn(
                "ml-2",
                maxLength && currentLength >= maxLength
                  ? "text-destructive"
                  : maxLength && currentLength >= maxLength * 0.9
                    ? "text-yellow-600"
                    : "text-muted-foreground"
              )}
            >
              {currentLength}
              {maxLength && `/${maxLength}`}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// Export types for external use
export type InputVariant = VariantProps<typeof inputVariants>["variant"];
export type InputSize = VariantProps<typeof inputVariants>["size"];
export type InputState = VariantProps<typeof inputVariants>["state"];
