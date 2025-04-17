export interface Project {
  image: string;
  title: string;
  description: string;
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
}

export const featuredProjects: Project[] = [
  {
    image: "/project.png",
    title: "Portfolio Website",
    description: "A modern portfolio website built with Next.js and Tailwind CSS. Features responsive design, dark mode, and smooth animations.",
    tech: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    link: "https://github.com/mdkamran-25/Portfolio",
    demoLink: "https://mdkamran.vercel.app/"
  },
  {
    image: "/currentProject.png",
    title: "Weather Dashboard",
    description: "A weather dashboard that displays current weather and forecasts for multiple locations. Includes interactive maps and detailed weather data.",
    tech: ["React", "OpenWeather API", "Chart.js", "Tailwind CSS"],
    link: "https://github.com/mdkamran-25/weather-dashboard",
    demoLink: "https://weather-dashboard-demo.vercel.app/"
  },
  {
    image: "/krmagsLight.png",
    title: "Task Management App",
    description: "A task management application with drag-and-drop functionality, task categorization, and progress tracking.",
    tech: ["React", "Firebase", "Material-UI", "Redux"],
    link: "https://github.com/mdkamran-25/task-manager",
    demoLink: "https://task-manager-demo.vercel.app/"
  }
];

export const freelanceProjects: FreelanceProject[] = [
  {
    image: "/krmagsLight.png",
    title: "E-commerce Platform",
    description: "Full-featured e-commerce platform with cart and checkout functionality. Includes product filtering, search, and user authentication.",
    tech: ["React", "Node.js", "Firebase", "Tailwind CSS", "Rest API"],
    link: "https://github.com/mdkamran-25/krmagsPage",
    demoLink: "https://krmags.com",
    client: "krmags",
    role: "Full Stack Developer",
    duration: "2 months",
    review: {
      rating: 5,
      comment: "Exceptional work! The e-commerce platform exceeded our expectations. The attention to detail and user experience is outstanding.",
      reviewer: "Aquib",
      position: "CEO, krmags"
    }
  },
  {
    image: "/KrmagsDark.png",
    title: "Dating App",
    description: "Collaborative task management application with real-time updates. Features include task assignment, progress tracking, and team collaboration tools.",
    tech: ["TypeScript", "Firebase", "Material-UI", "React", "Redux"],
    link: "https://github.com/yourusername/project3",
    demoLink: "https://your-taskapp-url.com",
    client: "TechCorp Inc.",
    role: "Frontend Developer",
    duration: "2 months",
    review: {
      rating: 5,
      comment: "A highly skilled developer who delivered a robust and scalable solution. Communication was excellent throughout the project.",
      reviewer: "Devid ",
      position: "CTO, TechCorp Inc."
    }
  }
]; 