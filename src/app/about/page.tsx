'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

const AboutPage = () => {
  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Profile Section */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <div className="mb-8 overflow-hidden rounded-2xl">
                <Image
                  src="/images/kamran.jpeg"
                  alt="Mohammad Kamran"
                  width={400}
                  height={400}
                  className="aspect-square object-cover"
                />
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">Mohammad Kamran</h1>
                <p className="text-xl text-neutral-400">Full Stack Developer</p>
                <p className="text-neutral-300">
                  Passionate about creating beautiful and functional web applications.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="mailto:your.email@example.com"
                    className="text-neutral-400 hover:text-orange-500"
                  >
                    <Mail className="h-6 w-6" />
                  </Link>
                  <Link
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-orange-500"
                  >
                    <Github className="h-6 w-6" />
                  </Link>
                  <Link
                    href="https://linkedin.com/in/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-orange-500"
                  >
                    <Linkedin className="h-6 w-6" />
                  </Link>
                  <Link
                    href="https://twitter.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-orange-500"
                  >
                    <Twitter className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-2/3">
            {/* About Me */}
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-white">About Me</h2>
              <div className="prose prose-invert max-w-none">
                <p className="mb-4">
                  I'm a passionate Full Stack Developer with expertise in building modern web applications.
                  With a strong foundation in both frontend and backend technologies, I create seamless
                  user experiences and robust server-side solutions.
                </p>
                <p className="mb-4">
                  My journey in web development started in [Year], and since then, I've worked on various
                  projects ranging from small business websites to complex web applications. I'm constantly
                  learning and adapting to new technologies to stay at the forefront of web development.
                </p>
              </div>
            </section>

            {/* Skills */}
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-white">Skills</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-neutral-800 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-white">Frontend</h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>React & Next.js</li>
                    <li>TypeScript</li>
                    <li>Tailwind CSS</li>
                    <li>Redux & Context API</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-neutral-800 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-white">Backend</h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>Node.js & Express</li>
                    <li>MongoDB & PostgreSQL</li>
                    <li>RESTful APIs</li>
                    <li>GraphQL</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-neutral-800 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-white">Tools & Others</h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>Git & GitHub</li>
                    <li>Docker</li>
                    <li>AWS</li>
                    <li>CI/CD</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-neutral-800 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-white">Design</h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>Figma</li>
                    <li>Adobe XD</li>
                    <li>UI/UX Design</li>
                    <li>Responsive Design</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Experience */}
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-white">Experience</h2>
              <div className="space-y-8">
                <div className="rounded-2xl bg-neutral-800 p-6">
                  <h3 className="mb-2 text-xl font-semibold text-white">Senior Full Stack Developer</h3>
                  <p className="mb-2 text-neutral-400">Company Name • 2020 - Present</p>
                  <ul className="list-disc pl-6 text-neutral-300">
                    <li>Led the development of multiple web applications</li>
                    <li>Implemented modern frontend architectures</li>
                    <li>Optimized backend performance</li>
                    <li>Mentored junior developers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="mb-6 text-2xl font-bold text-white">Education</h2>
              <div className="rounded-2xl bg-neutral-800 p-6">
                <h3 className="mb-2 text-xl font-semibold text-white">Bachelor's Degree in Computer Science</h3>
                <p className="text-neutral-400">University Name • 2016 - 2020</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default AboutPage; 