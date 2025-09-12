import React from "react";

import { NodejsIcon, FirebaseIcon } from "../public/icons";

const Stack = () => {
  const frontendTechnologies = [
    {
      name: "React",
      icon: "⚛️",
      description: "A JavaScript library for building user interfaces",
    },
    {
      name: "Next.js",
      icon: "▲",
      description: "React framework for production-grade applications",
    },
    {
      name: "Tailwind CSS",
      icon: "🎨",
      description: "Utility-first CSS framework for rapid UI development",
    },
    {
      name: "Node.js",
      icon: <NodejsIcon />,
      description: "JavaScript runtime for building scalable network applications",
    },
    {
      name: "Firebase",
      icon: <FirebaseIcon />,
      description: "Google's platform for building web and mobile applications",
    },
  ];

  const backendTechnologies = [
    {
      name: "Python",
      icon: "🐍",
      description: "High-level programming language for general-purpose programming",
    },
    {
      name: "Django",
      icon: "🎯",
      description: "High-level Python web framework for rapid development",
    },
    {
      name: "PostgreSQL",
      icon: "🐘",
      description: "Advanced open-source relational database",
    },
  ];

  return (
    <section className="bg-slate-900 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold text-white">Tech Stack</h2>

        {/* Frontend Technologies */}
        <div className="mb-16">
          <h3 className="mb-8 text-center text-2xl font-semibold text-white">
            Frontend Technologies
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {frontendTechnologies.map((tech, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-slate-800 p-6 text-center transition-transform duration-300 hover:scale-105 hover:transform"
              >
                <div className="mb-4 text-4xl">{tech.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-white">{tech.name}</h3>
                <p className="text-gray-400">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Backend Technologies */}
        <div>
          <h3 className="mb-8 text-center text-2xl font-semibold text-white">
            Backend Technologies
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {backendTechnologies.map((tech, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-slate-800 p-6 text-center transition-transform duration-300 hover:scale-105 hover:transform"
              >
                <div className="mb-4 text-4xl">{tech.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-white">{tech.name}</h3>
                <p className="text-gray-400">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
