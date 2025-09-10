/**
 * Global TypeScript type definitions
 * Used across the entire application
 */

// Core domain types
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: Technology[];
  liveUrl?: string;
  githubUrl?: string;
  category: ProjectCategory;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  category: TechnologyCategory;
}

export interface FreelanceProject {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: Technology[];
  budget: number;
  currency: "USD" | "EUR" | "GBP" | "INR";
  duration: string;
  clientName?: string;
  status: FreelanceStatus;
  createdAt: string;
  completedAt?: string;
}

// Enums
export type ProjectCategory =
  | "web-app"
  | "mobile-app"
  | "desktop-app"
  | "library"
  | "tool"
  | "other";

export type TechnologyCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "mobile"
  | "design"
  | "other";

export type FreelanceStatus = "available" | "in-progress" | "completed" | "cancelled";

// Utility types
export type WithId<T> = T & { id: string };
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// API Response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  links?: {
    next?: string;
    prev?: string;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// Payment types
export interface PaymentDetails {
  amount: number;
  currency: "USD" | "EUR" | "GBP" | "INR";
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType?: ProjectCategory;
  budget?: string;
}

// Theme types
export type ThemeMode = "light" | "dark" | "system";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  fontFamily: string;
}

// Navigation types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

// SEO types
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
}

// Analytics types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
}

export interface VariantProps {
  variant?: string;
  size?: string;
}

export interface InteractiveProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// State management types
export interface AppState {
  theme: ThemeConfig;
  user: User | null;
  isAuthenticated: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  createdAt: string;
}

// Filter and sort types
export interface ProjectFilters {
  category?: ProjectCategory[];
  technologies?: string[];
  featured?: boolean;
  search?: string;
}

export interface SortOptions {
  field: "title" | "createdAt" | "updatedAt";
  direction: "asc" | "desc";
}

export interface PaginationOptions {
  page: number;
  limit: number;
}
