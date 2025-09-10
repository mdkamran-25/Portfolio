import { z } from "zod";

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // App configuration
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Portfolio"),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().default("Full-stack developer portfolio"),

  // Database (future)
  DATABASE_URL: z.string().optional(),

  // Authentication (future)
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // Payment providers
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),

  // Analytics (future)
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // External APIs (future)
  GITHUB_TOKEN: z.string().optional(),

  // Email service (future)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

/**
 * Validates and returns environment variables
 * Throws an error if validation fails
 */
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Invalid environment variables");
  }
}

// Export validated environment variables
export const env = validateEnv();

/**
 * App configuration derived from environment variables
 */
export const appConfig = {
  // App metadata
  name: env.NEXT_PUBLIC_APP_NAME,
  description: env.NEXT_PUBLIC_APP_DESCRIPTION,
  url: env.NEXT_PUBLIC_APP_URL,

  // Environment
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",

  // Features flags
  features: {
    payments: Boolean(env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
    analytics: Boolean(env.NEXT_PUBLIC_GA_ID),
    database: Boolean(env.DATABASE_URL),
    auth: Boolean(env.NEXTAUTH_SECRET),
    email: Boolean(env.SMTP_HOST),
  },

  // API configuration
  api: {
    baseUrl: env.NEXT_PUBLIC_APP_URL,
    timeout: 10000, // 10 seconds
    retries: 3,
  },

  // UI configuration
  ui: {
    defaultTheme: "light" as const,
    itemsPerPage: 12,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    supportedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  // Business rules
  business: {
    maxProjectsPerPage: 20,
    freelanceMinBudget: 500,
    freelanceMaxBudget: 50000,
    supportedCurrencies: ["USD", "EUR", "GBP", "INR"] as const,
  },
} as const;

/**
 * Database configuration (future)
 */
export const dbConfig = {
  url: env.DATABASE_URL,
  ssl: env.NODE_ENV === "production",
  pool: {
    min: 2,
    max: 10,
  },
} as const;

/**
 * Authentication configuration (future)
 */
export const authConfig = {
  secret: env.NEXTAUTH_SECRET,
  url: env.NEXTAUTH_URL,
  sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  sessionUpdateAge: 24 * 60 * 60, // 24 hours
} as const;

/**
 * Payment configuration
 */
export const paymentConfig = {
  razorpay: {
    keyId: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    keySecret: env.RAZORPAY_KEY_SECRET,
    currency: "INR" as const,
    timeout: 300, // 5 minutes
  },
} as const;

/**
 * Analytics configuration (future)
 */
export const analyticsConfig = {
  googleAnalytics: {
    id: env.NEXT_PUBLIC_GA_ID,
  },
} as const;

/**
 * Email configuration (future)
 */
export const emailConfig = {
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : 587,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    secure: false, // Use STARTTLS
  },
  from: {
    name: env.NEXT_PUBLIC_APP_NAME,
    email: env.SMTP_USER || "noreply@example.com",
  },
} as const;

/**
 * External service configuration
 */
export const externalConfig = {
  github: {
    token: env.GITHUB_TOKEN,
    apiUrl: "https://api.github.com",
    username: "mdkamran-25", // Your GitHub username
  },
} as const;
