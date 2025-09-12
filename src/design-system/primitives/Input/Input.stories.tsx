import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Input, Textarea } from "./Input";

// Mock icons for stories
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: "Design System/Primitives/Input",
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          "A flexible input component for forms with comprehensive styling, validation states, and accessibility support.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "ghost", "filled", "underlined"],
      description: "The visual style variant of the input",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "The size of the input",
    },
    state: {
      control: "select",
      options: ["default", "error", "success", "warning"],
      description: "The validation state of the input",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "tel", "url", "number"],
      description: "The input type",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Default</label>
        <Input placeholder="Default input style" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Ghost</label>
        <Input variant="ghost" placeholder="Ghost input style" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Filled</label>
        <Input variant="filled" placeholder="Filled input style" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Underlined</label>
        <Input variant="underlined" placeholder="Underlined input style" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different visual variants for various design contexts and preferences.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Small</label>
        <Input size="sm" placeholder="Small input" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Default</label>
        <Input placeholder="Default input" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Large</label>
        <Input size="lg" placeholder="Large input" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different sizes to fit various layout densities and design requirements.",
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Default State</label>
        <Input placeholder="Default state" helperText="This is helper text" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Success State</label>
        <Input
          state="success"
          placeholder="Valid input"
          successMessage="Input is valid!"
          defaultValue="valid@example.com"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Warning State</label>
        <Input
          state="warning"
          placeholder="Warning input"
          helperText="This might need attention"
          defaultValue="warning@example"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Error State</label>
        <Input state="error" placeholder="Invalid input" errorMessage="This field is required" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different validation states with corresponding messages and visual feedback.",
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Left Icon</label>
        <Input leftIcon={<MailIcon />} placeholder="Enter your email" type="email" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Right Icon</label>
        <Input rightIcon={<SearchIcon />} placeholder="Search..." type="search" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Both Icons</label>
        <Input
          leftIcon={<LockIcon />}
          rightIcon={<EyeIcon />}
          placeholder="Enter password"
          type="password"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Inputs with icons for enhanced visual context and user guidance.",
      },
    },
  },
};

export const CharacterCount: Story = {
  render: function CharacterCountRender() {
    const [value, setValue] = useState("");

    return (
      <div className="grid max-w-md gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">With Character Count</label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type something..."
            maxLength={50}
            showCount
            helperText="Maximum 50 characters"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Approaching Limit</label>
          <Input
            defaultValue="This is a long message that is approaching the character limit"
            maxLength={60}
            showCount
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">At Limit</label>
          <Input
            defaultValue="This message has reached the maximum character limit allowed"
            maxLength={60}
            showCount
            errorMessage="Character limit exceeded"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Character counting with visual feedback as users approach or exceed limits.",
      },
    },
  },
};

export const InteractiveForm: Story = {
  render: function InteractiveFormRender() {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      confirmPassword: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert("Form submitted successfully!");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <Input
            type="email"
            leftIcon={<MailIcon />}
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            state={
              errors.email
                ? "error"
                : formData.email && validateEmail(formData.email)
                  ? "success"
                  : "default"
            }
            errorMessage={errors.email}
            successMessage={
              formData.email && validateEmail(formData.email) ? "Valid email address" : undefined
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>
          <Input
            type="password"
            leftIcon={<LockIcon />}
            rightIcon={<EyeIcon />}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            state={
              errors.password ? "error" : formData.password.length >= 8 ? "success" : "default"
            }
            errorMessage={errors.password}
            helperText="Must be at least 8 characters"
            maxLength={50}
            showCount
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Confirm Password</label>
          <Input
            type="password"
            leftIcon={<LockIcon />}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            state={
              errors.confirmPassword
                ? "error"
                : formData.confirmPassword && formData.password === formData.confirmPassword
                  ? "success"
                  : "default"
            }
            errorMessage={errors.confirmPassword}
            successMessage={
              formData.confirmPassword && formData.password === formData.confirmPassword
                ? "Passwords match"
                : undefined
            }
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Create Account
        </button>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive form demonstrating real-time validation and state management with multiple inputs.",
      },
    },
  },
};

// Textarea Stories
export const TextareaBasic: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Default Textarea</label>
        <Textarea placeholder="Enter your message..." />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">With Helper Text</label>
        <Textarea
          placeholder="Describe your project..."
          helperText="Provide a detailed description of your project requirements"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Basic textarea functionality with helper text support.",
      },
    },
  },
};

export const TextareaVariants: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Default</label>
        <Textarea placeholder="Default textarea" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Filled</label>
        <Textarea variant="filled" placeholder="Filled textarea" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Underlined</label>
        <Textarea variant="underlined" placeholder="Underlined textarea" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different textarea variants for various design contexts.",
      },
    },
  },
};

export const TextareaWithValidation: Story = {
  render: function TextareaWithValidationRender() {
    const [message, setMessage] = useState("");
    const maxLength = 200;

    return (
      <div className="max-w-md">
        <label className="mb-2 block text-sm font-medium">Message</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about yourself..."
          maxLength={maxLength}
          showCount
          minRows={4}
          state={message.length > maxLength * 0.9 ? "warning" : "default"}
          helperText="Share your background, interests, and goals"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Textarea with character counting and validation feedback.",
      },
    },
  },
};

export const FileInput: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Upload File</label>
        <Input type="file" helperText="Choose a file to upload" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Upload Multiple Files</label>
        <Input type="file" multiple accept="image/*" helperText="Select one or more image files" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "File input styling and functionality with proper file selection support.",
      },
    },
  },
};

export const DisabledStates: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Disabled Input</label>
        <Input
          disabled
          placeholder="This input is disabled"
          helperText="This field cannot be edited"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Disabled with Value</label>
        <Input disabled defaultValue="Read-only value" leftIcon={<MailIcon />} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Disabled Textarea</label>
        <Textarea
          disabled
          defaultValue="This textarea content cannot be modified"
          helperText="Content is read-only"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Disabled states showing proper visual feedback and interaction prevention.",
      },
    },
  },
};
