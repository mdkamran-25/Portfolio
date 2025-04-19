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
}

export const featuredProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Dating App',
    description: 'A modern dating application built with React Native and Node.js',
    image: '/projects/DatingApp.png',
    tech: ['React Native', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    link: 'https://github.com/yourusername/dating-app',
    demoLink: 'https://dating-app-demo.com'
  },
  {
    id: 'project-2',
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with Next.js and Tailwind CSS',
    image: '/projects/project.png',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React'],
    link: 'https://github.com/yourusername/portfolio',
    demoLink: 'https://portfolio-demo.com'
  }
];

export const freelanceProjects: FreelanceProject[] = [
  {
    id: 'freelance-1',
    title: 'Krmags Light',
    description: 'A B2B e-commerce platform for distributors and sellers',
    image: '/projects/krmagsLight.png',
    tech: ['React', 'Next.js', 'Tailwind CSS'],
    link: 'https://github.com/yourusername/krmags-light',
    demoLink: 'https://krmags-light-demo.com',
    client: 'Krmags',
    role: 'Frontend Developer',
    duration: '3 months',
    review: {
      rating: 5,
      comment: 'Excellent work and communication throughout the project',
      reviewer: 'John Doe',
      position: 'CEO'
    }
  }
]; 