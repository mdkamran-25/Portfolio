import React from 'react';
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

// Tech Stack Component
const Stack: React.FC = () => {
  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      {/* Section Title */}
      <h1 className="text-xl font-bold text-orange-500 sm:text-2xl">
        Tech Stack
      </h1>

      {/* Tech Icons Grid */}
      <div className="grid grid-cols-2 gap-2 xs:grid-cols-3 sm:grid-cols-4 sm:gap-4">
        {/* HTML */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl sm:p-4">
          <div className="flex h-full w-full items-center justify-center">
            <HtmlIcon />
          </div>
        </div>

        {/* CSS */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl sm:p-4">
          <div className="flex h-full w-full items-center justify-center">
            <CssIcon />
          </div>
        </div>

        {/* JavaScript */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl sm:p-4">
          <div className="flex h-full w-full items-center justify-center">
            <JsIcon />
          </div>
        </div>

        {/* React */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl sm:p-4">
          <div className="flex h-full w-full items-center justify-center">
            <ReactIcon />
          </div>
        </div>

        {/* Next.js */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl sm:p-4">
          <div className="flex h-full w-full items-center justify-center">
            <NextjsIcon />
          </div>
        </div>

        {/* TypeScript */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl sm:p-4">
          <div className="flex h-full w-full items-center justify-center">
            <TsIcon />
          </div>
        </div>

        {/* Tailwind CSS */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl sm:p-4">
          <div className="flex h-full w-full items-center justify-center">
            <TailwindcssIcon />
          </div>
        </div>

        {/* Figma */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl sm:p-4">
          <div className="flex h-full w-full items-center justify-center">
            <Figma />
          </div>
        </div>

        {/* Node.js */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl sm:p-4">
          <div className="flex h-full w-full items-center justify-center">
            <NodejsIcon />
          </div>
        </div>

        {/* Firebase */}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-700/50 sm:rounded-2xl sm:p-4">
          <div className="flex h-full w-full items-center justify-center">
            <FirebaseIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stack;
