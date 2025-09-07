export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  demoLink: string;
}

export interface FreelanceProject extends Project {
  client: string;
  role: string;
  duration: string;
  review?: {
    rating: number;
    comment: string;
    reviewer: string;
    position: string;
  };
  support?: {
    title: string;
    description: string;
    amounts: {
      amount: number;
      label: string;
    }[];
  };
}

export const featuredProjects: Project[] = [
  {
    id: "project-1",
    title: "Dating App",
    description: "A modern dating application built with React Native and Node.js",
    image: "/projects/DatingApp.png",
    tech: ["React Native", "Node.js", "MongoDB", "Tailwind CSS"],
    link: "https://github.com/mdkamran-25/ShardaDating-",
    demoLink: "https://sharda-dating-b4cs.vercel.app/",
  },
  {
    id: "project-2",
    title: "Portfolio Website",
    description: "A modern portfolio website built with Next.js and Tailwind CSS",
    image: "/projects/project.png",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    link: "https://github.com/mdkamran-25/Portfolio",
    demoLink: "https://mdkamran.vercel.app/",
  },
];

export const freelanceProjects: FreelanceProject[] = [
  {
    id: "freelance-1",
    title: "Krmags Pvt. Ltd. ",
    description:
      "KRMAGS Solutions is a Delhi-based company committed to empowering individuals through durable, high-performance products and inclusive growth initiatives. With a focus on seamless supply chains and flexible aluminum innovation",
    image: "/projects/krmagsLight.png",
    tech: ["React", "Node.js", "Tailwind CSS", "Firebase", "Express.js"],
    link: "https://github.com/yourusername/krmags-light",
    demoLink: "https://krmags.com",
    client: "Krmags",
    role: "Frontend Developer",
    duration: "1 months",
    review: {
      rating: 5,
      comment: "Excellent work and communication throughout the project",
      reviewer: "Aquib",
      position: "Managing Director",
    },
    support: {
      title: "Support This Work",
      description: "If you find this project valuable, consider supporting the development",
      amounts: [
        { amount: 199, label: "Basic Support" },
        { amount: 299, label: "Premium Support" },
        { amount: 999, label: "Enterprise Support" },
      ],
    },
  },
  {
    id: "freelance-2",
    title: "noDevBuild Pvt. Ltd.",
    description:
      "NoDevBuild is an online platform that empowers users to build apps and automate workflows using no-code and AI tools—without writing a single line of code.",
    image: "/projects/noDevBuild.png",
    tech: [
      "React 18",
      "TypeScript",
      "Vite",
      "React Router DOM",
      "Redux Toolkit",
      "React Redux",
      "Tailwind CSS",
      "Lucide React",
      "PostCSS",
      "Firebase",
      "Axios",
      "ESLint",
      "Node.js",
      "Particles.js",
      "React Helmet Async",
      "Netlify",
    ],
    link: "https://github.com/your-repo",
    demoLink: "https://nodevbuild.com/",
    client: "noDevBuild",
    role: "Full Stack Developer",
    duration: "2 months",
    review: {
      rating: 5,
      comment: "Outstanding work! Delivered on time with top-notch quality—highly recommended!",
      reviewer: "Sharukh",
      position: "Founder of noDevBuild",
    },
    // support: {
    //   title: "Support This Work",
    //   description: "Support message for this specific project",
    //   amounts: [
    //     { amount: 99, label: "Basic Support" },
    //     { amount: 199, label: "Premium Support" },
    //     { amount: 999, label: "Enterprise Support" },
    //   ],
    // },
  },
];
