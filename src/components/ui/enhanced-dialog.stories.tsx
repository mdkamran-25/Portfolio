/**
 * Enhanced Dialog Component Stories
 *
 * Demonstrates focus management and accessibility features
 * of the enhanced dialog components with WCAG 2.1 AA compliance.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  AccessibleButton,
} from "@/components/ui/enhanced-dialog";

const meta: Meta<typeof DialogContent> = {
  title: "Design System/Enhanced Dialog",
  component: DialogContent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Enhanced dialog component with comprehensive accessibility features:

## Accessibility Features

### Focus Management
- **Focus trap**: Confines keyboard navigation within the dialog
- **Auto-focus**: Automatically focuses the first interactive element
- **Focus restoration**: Returns focus to the trigger element when closed
- **Keyboard navigation**: Full support for Tab, Shift+Tab, and Escape keys

### ARIA Attributes
- **aria-modal="true"**: Identifies the dialog as a modal
- **aria-labelledby**: Links to the dialog title
- **aria-describedby**: Links to the dialog description
- **role="dialog"**: Semantic role for screen readers

### Screen Reader Support
- **Live regions**: Announces dialog state changes
- **Descriptive labels**: Clear button and action descriptions
- **Loading states**: Proper ARIA attributes for async operations

## WCAG 2.1 AA Compliance
- All interactive elements are keyboard accessible
- Color contrast meets AA standards
- Focus indicators are clearly visible
- Screen reader announcements are informative
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          // Enable accessibility testing
          { id: "color-contrast", enabled: true },
          { id: "focus-order-semantics", enabled: true },
          { id: "keyboard-navigation", enabled: true },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: { type: "boolean" },
      description: "Controls dialog visibility and focus management",
    },
    title: {
      control: { type: "text" },
      description: "Dialog title for aria-labelledby",
    },
    description: {
      control: { type: "text" },
      description: "Dialog description for aria-describedby",
    },
    showCloseButton: {
      control: { type: "boolean" },
      description: "Shows/hides the close button",
    },
    closeButtonLabel: {
      control: { type: "text" },
      description: "Accessible label for close button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic dialog with standard accessibility features
 */
export const BasicDialog: Story = {
  render: function BasicDialogRender() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <AccessibleButton>Open Dialog</AccessibleButton>
        </DialogTrigger>
        <DialogContent
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Basic Dialog"
          description="A simple dialog with accessibility features"
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username" className="text-right text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                defaultValue="@peduarte"
                className="col-span-3 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <DialogFooter>
            <AccessibleButton variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </AccessibleButton>
            <AccessibleButton onClick={() => setIsOpen(false)}>Save changes</AccessibleButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

/**
 * Dialog with form validation and error handling
 */
export const FormValidationDialog: Story = {
  render: function FormValidationDialogRender() {
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Simulate validation
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const newErrors: Record<string, string> = {};

      if (!email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      setErrors(newErrors);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);

      if (Object.keys(newErrors).length === 0) {
        setIsOpen(false);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <AccessibleButton>Sign In</AccessibleButton>
        </DialogTrigger>
        <DialogContent
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Sign In"
          description="Enter your credentials to access your account"
          className="sm:max-w-[400px]"
        >
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Enter your email and password to access your account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <DialogFooter>
              <AccessibleButton
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </AccessibleButton>
              <AccessibleButton type="submit" loading={isLoading} loadingText="Signing in...">
                Sign In
              </AccessibleButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
};

/**
 * Confirmation dialog with destructive action
 */
export const ConfirmationDialog: Story = {
  render: function ConfirmationDialogRender() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
      setIsDeleting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsDeleting(false);
      setIsOpen(false);
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <AccessibleButton variant="destructive">Delete Account</AccessibleButton>
        </DialogTrigger>
        <DialogContent
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Delete Account"
          description="This action cannot be undone"
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and will
              permanently remove all your data.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600">This will permanently delete:</p>
            <ul className="mt-2 text-sm text-gray-600" role="list">
              <li>• All your projects and files</li>
              <li>• Your profile and settings</li>
              <li>• All collaboration history</li>
            </ul>
          </div>

          <DialogFooter>
            <AccessibleButton
              variant="secondary"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </AccessibleButton>
            <AccessibleButton
              variant="destructive"
              onClick={handleDelete}
              loading={isDeleting}
              loadingText="Deleting..."
            >
              Delete Account
            </AccessibleButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

/**
 * Dialog with complex content and scrolling
 */
export const ScrollableDialog: Story = {
  render: function ScrollableDialogRender() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <AccessibleButton>View Terms</AccessibleButton>
        </DialogTrigger>
        <DialogContent
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Terms and Conditions"
          description="Please review our terms and conditions"
          className="max-h-[80vh] sm:max-w-[600px]"
        >
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Please read and accept our terms and conditions to continue.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[50vh] overflow-y-auto py-4 pr-4" tabIndex={0}>
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="mb-2 font-semibold">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using this website, you accept and agree to be bound by the terms
                  and provision of this agreement. Additionally, when using this website's
                  particular services, you shall be subject to any posted guidelines or rules
                  applicable to such services.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">2. Use License</h3>
                <p>
                  Permission is granted to temporarily download one copy of the materials
                  (information or software) on our website for personal, non-commercial transitory
                  viewing only. This is the grant of a license, not a transfer of title, and under
                  this license you may not:
                </p>
                <ul className="ml-4 mt-2 space-y-1" role="list">
                  <li>• modify or copy the materials;</li>
                  <li>• use the materials for any commercial purpose;</li>
                  <li>• attempt to decompile or reverse engineer any software;</li>
                  <li>• remove any copyright or other proprietary notations.</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">3. Disclaimer</h3>
                <p>
                  The materials on our website are provided on an 'as is' basis. We make no
                  warranties, expressed or implied, and hereby disclaim and negate all other
                  warranties including without limitation, implied warranties or conditions of
                  merchantability, fitness for a particular purpose, or non-infringement of
                  intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">4. Limitations</h3>
                <p>
                  In no event shall our company or its suppliers be liable for any damages
                  (including, without limitation, damages for loss of data or profit, or due to
                  business interruption) arising out of the use or inability to use the materials on
                  our website, even if we or our authorized representative has been notified orally
                  or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">5. Privacy Policy</h3>
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use,
                  and protect your information when you use our service.
                </p>
              </section>
            </div>
          </div>

          <DialogFooter>
            <AccessibleButton variant="secondary" onClick={() => setIsOpen(false)}>
              Decline
            </AccessibleButton>
            <AccessibleButton onClick={() => setIsOpen(false)}>Accept Terms</AccessibleButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
