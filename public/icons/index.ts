// Optimized icon barrel exports for tree-shaking
// Each icon is explicitly exported to enable proper tree-shaking

export { default as CssIcon } from "./css";
export { default as FigmaIcon } from "./figma";
export { default as FirebaseIcon } from "./firebase";
export { default as GithubIcon } from "./github";
export { default as HtmlIcon } from "./html";
export { default as InstagramIcon } from "./instagram";
export { default as JsIcon } from "./js";
export { default as LinkedinIcon } from "./linkedin";
export { default as NextjsIcon } from "./nextjs";
export { default as NodejsIcon } from "./nodejs";
export { default as ReactIcon } from "./react";
export { default as TailwindcssIcon } from "./tailwindcss";
export { default as TypescriptIcon } from "./typescript";
export { default as WhatsappIcon } from "./watsapp";

// Icon types for better TypeScript support
export interface IconProps {
  width?: string;
  height?: string;
  fill?: string;
  className?: string;
}
