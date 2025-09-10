"use client";

import Image from "next/image";
import { Globe, GraduationCap, Github, BrainCircuit, FileUser } from "lucide-react";
import { SiNotion } from "react-icons/si";

// Profile Component
export default function Profile() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4" data-testid="profile-section">
      {/* Header with image and name */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-2xl sm:h-16 sm:w-16">
          <Image
            src="/images/kamran.jpeg"
            alt="Kamran's profile picture"
            width={64}
            height={64}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-orange-500 sm:text-2xl">I&apos;m Kamran</h1>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-500">
              Available to Work
            </span>
          </div>
          <p className="text-xs text-neutral-400 sm:text-sm">Fullstack Developer</p>
        </div>
      </div>

      {/* Info badges */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 rounded-full bg-neutral-800/50 px-3 py-1.5">
          <Globe className="h-3.5 w-3.5 text-neutral-400 sm:h-4 sm:w-4" />
          <span className="text-xs text-neutral-400 sm:text-sm">English, Hindi</span>
          <span className="text-xs text-neutral-400">🇮🇳 Greter Noida, India</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-full bg-neutral-800/50 px-3 py-1.5">
          <BrainCircuit className="h-3.5 w-3.5 text-neutral-400 sm:h-4 sm:w-4" />
          <span className="text-xs text-neutral-400 sm:text-sm">Computer Science, 3rd year</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-full bg-neutral-800/50 px-3 py-1.5">
          <GraduationCap className="h-3.5 w-3.5 text-neutral-400 sm:h-4 sm:w-4" />
          <span className="text-xs text-neutral-400 sm:text-sm">
            Undergrad Student, @Sharda University
          </span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-base font-medium text-neutral-200 sm:text-lg">
        I craft inclusive, pixel-perfect digital experiences that empower the web.
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={() =>
            window.open("https://github.com/mdkamran-25", "_blank", "noopener,noreferrer")
          }
          className="flex items-center gap-2 rounded-full bg-neutral-800/50 px-4 py-1.5 text-xs text-white transition-colors hover:bg-neutral-700/50 sm:px-6 sm:py-2 sm:text-sm"
        >
          <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          GitHub
        </button>

        <button
          onClick={() =>
            window.open(
              "https://spring-mars-7c5.notion.site/Welcome-1868ac9f1d858023a5ddf222dacf5051",
              "_blank",
              "noopener,noreferrer"
            )
          }
          className="flex items-center gap-2 rounded-full bg-neutral-800/50 px-4 py-1.5 text-xs text-white transition-colors hover:bg-neutral-700/50 sm:px-6 sm:py-2 sm:text-sm"
        >
          <SiNotion className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Projects...
        </button>
        <button
          onClick={() => {
            // Create a link element
            const link = document.createElement("a");
            // Set the href to the PDF file
            link.href = "/resume.pdf";
            // Set the download attribute to force download
            link.download = "resume.pdf";
            // Append the link to the body
            document.body.appendChild(link);
            // Trigger the download
            link.click();
            // Remove the link from the body
            document.body.removeChild(link);
          }}
          className="flex items-center gap-2 rounded-full bg-neutral-800/50 px-4 py-1.5 text-xs text-white transition-colors hover:bg-neutral-700/50 sm:px-6 sm:py-2 sm:text-sm"
        >
          <FileUser className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Download CV
        </button>
      </div>
    </div>
  );
}
