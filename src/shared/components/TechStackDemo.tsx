// Example integration of our new Badge component
import React from "react";

import { Badge } from "@/design-system/primitives/Badge";

interface TechStackDemoProps {
  technologies: string[];
}

export const TechStackDemo: React.FC<TechStackDemoProps> = ({ technologies }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <Badge key={tech} variant="tech" techName={tech}>
          {tech}
        </Badge>
      ))}
    </div>
  );
};

// Example usage:
// <TechStackDemo technologies={['React', 'TypeScript', 'Next.js', 'Tailwind CSS']} />
