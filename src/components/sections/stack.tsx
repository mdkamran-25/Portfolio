import React, { useState } from 'react';
import HtmlIcon from "../../../public/icons/html";
import CssIcon from "../../../public/icons/css";
import JsIcon from "../../../public/icons/js";
import TsIcon from "../../../public/icons/typescript";
import TailwindcssIcon from "../../../public/icons/tailwindcss";
import ReactIcon from "../../../public/icons/react";
import NextjsIcon from "../../../public/icons/nextjs";
import Figma from "../../../public/icons/figma";
import NodejsIcon from "../../../public/icons/nodejs";
import FirebaseIcon from "../../../public/icons/firebase";
import WordPressIcon from "../../../public/icons/wordpress";
import GitIcon from "../../../public/icons/git";
import GitHubIcon from "../../../public/icons/github";
import BashIcon from "../../../public/icons/bash";
import PostmanIcon from "../../../public/icons/postman";
import GraphQLIcon from "../../../public/icons/graphql";
import NetlifyIcon from "../../../public/icons/netlify";
import VercelIcon from "../../../public/icons/vercel";

// Tech Stack Component
const Stack: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  
  // Define all tech stack items
  const techStackItems = [
    { id: 1, name: 'HTML', icon: <HtmlIcon /> },
    { id: 2, name: 'CSS', icon: <CssIcon /> },
    { id: 3, name: 'JavaScript', icon: <JsIcon /> },
    { id: 4, name: 'TypeScript', icon: <TsIcon /> },
    { id: 5, name: 'React', icon: <ReactIcon /> },
    { id: 6, name: 'Next.js', icon: <NextjsIcon /> },
    { id: 7, name: 'Tailwind CSS', icon: <TailwindcssIcon /> },
    { id: 8, name: 'Node.js', icon: <NodejsIcon /> },
    { id: 9, name: 'Figma', icon: <Figma /> },
    { id: 10, name: 'Firebase', icon: <FirebaseIcon /> },
    { id: 11, name: 'WordPress', icon: <WordPressIcon /> },
    { id: 12, name: 'Git', icon: <GitIcon /> },
    { id: 13, name: 'GitHub', icon: <GitHubIcon /> },
    { id: 14, name: 'Bash', icon: <BashIcon /> },
    { id: 15, name: 'Postman', icon: <PostmanIcon /> },
    { id: 16, name: 'GraphQL', icon: <GraphQLIcon /> },
    { id: 17, name: 'Netlify', icon: <NetlifyIcon /> },
    { id: 18, name: 'Vercel', icon: <VercelIcon /> }
  ];

  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      {/* Section Title */}
      <h1 className="text-xl font-bold text-orange-500 sm:text-2xl">
        Tech Stack
      </h1>

      {/* Tech Icons Grid */}
      <div className="grid grid-cols-2 gap-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
        {/* On mobile: Show first 6 items or all items based on showAll state */}
        {/* On tablet/desktop: Always show all items */}
        {techStackItems.map((item, index) => (
          <div 
            key={item.id}
            className={`relative w-full pb-[100%] rounded-xl bg-neutral-800/50 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl ${
              // Hide items beyond the first 6 on mobile when showAll is false
              !showAll && index >= 6 ? 'hidden sm:block' : 'block'
            }`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4">
              <div className="flex items-center justify-center">
                {item.icon}
              </div>
              <span className="mt-2 text-xs text-neutral-300 sm:text-sm">
                {item.name}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* See More/Show Less Button - Only visible on mobile */}
      <div className="flex justify-center sm:hidden">
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 rounded-full bg-neutral-800/50 px-4 py-1.5 text-xs text-orange-500 transition-colors hover:bg-neutral-700/50"
        >
          {showAll ? 'Show Less' : 'See More'}
        </button>
      </div>
    </div>
  );
};

export default Stack;
