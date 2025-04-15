"use client";
import Profile from "@/components/ui/profile";
import Projects from "@/components/ui/projects";
import Stack from "@/components/ui/stack";
import ScheduleCall from "@/components/ui/schedule-call";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-black px-4 py-6 sm:p-6 md:p-8 lg:p-16">
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
        {/* First row: Profile and Stack side by side */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="rounded-2xl bg-neutral-900/50 p-4 sm:p-6">
            <Profile />
          </div>
          <div className="rounded-2xl bg-neutral-900/50 p-4 sm:p-6">
            <Stack />
          </div>
        </div>

        {/* Second row: Projects */}
        <div className="rounded-2xl bg-neutral-900/50 p-4 sm:p-6">
          <Projects />
        </div>
      </div>

      {/* Schedule Call Component */}
      <ScheduleCall />
    </main>
  );
}
