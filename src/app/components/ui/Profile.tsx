"use client";
import Image from "next/image";
import { SiNotion } from "react-icons/si";
import { Dot, Github, Globe, Languages, GraduationCap } from "lucide-react";

const image = "/kamran.jpeg";

export default function Profile() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center px-4">
      <div className="flex w-full max-w-[450px] flex-col items-center rounded-lg bg-neutral-900 px-4 py-6">
        {/* Profile Container */}
        <div className="mt-4 flex w-full flex-col items-center sm:flex-row sm:items-center">
          {/* Profile Image */}
          <div className="relative h-16 w-16 overflow-hidden rounded-full sm:h-20 sm:w-20">
            <Image
              src={image}
              alt="Kamran's profile picture"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Profile Details */}
          <div className="mt-4 text-center sm:ml-4 sm:mt-0 sm:text-left">
            {/* Availability Status */}
            <div className="flex w-fit items-center space-x-1 rounded-lg bg-black px-3 py-1">
              <Dot className="animate-pulse text-green-500" />
              <p className="text-xs font-bold text-green-500">
                Available To Work
              </p>
            </div>

            {/* Name & Role */}
            <h1 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              I'm Kamran
            </h1>
            <p className="text-sm font-bold text-neutral-500 sm:text-base">
              Front-end Engineer
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-4 flex w-full flex-col gap-2 rounded-lg bg-black px-3 py-3">
          <InfoBlock
            icon={GraduationCap}
            text="Undergrad Student, @Sharda University"
          />
          <InfoBlock icon={Globe} text="Greater Noida, India" />
          <InfoBlock icon={Languages} text="English, Hindi" />
        </div>

        {/* Tagline */}
        <div className="mt-4 w-full px-3 text-center">
          <p className="text-base font-bold text-gray-50">
            I craft inclusive, pixel-perfect digital experiences that empower
            the web.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-3">
          <Button
            text="Github"
            icon={Github}
            url="https://github.com/mdkamran-25"
          />
          <Button
            text="Projects"
            icon={SiNotion}
            url="https://spring-mars-7c5.notion.site/React-Projects-1868ac9f1d858023a5ddf222dacf5051?pvs=74"
          />
        </div>
      </div>
    </section>
  );
}

// Reusable Info Block
interface InfoBlockProps {
  icon: React.ElementType;
  text: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2">
    <Icon className="text-white" />
    <span className="text-xs text-white">{text}</span>
  </div>
);

// Reusable Button Component
interface ButtonProps {
  text: string;
  icon: React.ElementType;
  url: string;
}

const Button: React.FC<ButtonProps> = ({ text, icon: Icon, url }) => (
  <button
    onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
    className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-white"
  >
    <Icon className="h-5 w-5" /> {text}
  </button>
);
