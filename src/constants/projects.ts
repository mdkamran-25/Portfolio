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
    id: 'project-1',
    title: 'Dating App',
    description: 'A modern dating application built with React Native and Node.js',
    image: '/projects/DatingApp.png',
    tech: ['React Native', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    link: 'https://github.com/mdkamran-25/ShardaDating-',
    demoLink: 'https://sharda-dating-b4cs.vercel.app/'
  },
  {
    id: 'project-2',
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with Next.js and Tailwind CSS',
    image: '/projects/project.png',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React'],
    link: 'https://github.com/mdkamran-25/Portfolio',
    demoLink: 'https://mdkamran.vercel.app/'
  }
];

export const freelanceProjects: FreelanceProject[] = [
  {
    id: 'freelance-1',
    title: 'Krmags Pvt. Ltd. ',
    description: 'A B2B e-commerce platform for distributors and sellers',
    image: '/projects/krmagsLight.png',
    tech: ['React', 'Node.js', 'Tailwind CSS', 'Firebase', 'Express.js'],
    link: 'https://github.com/yourusername/krmags-light',
    demoLink: 'https://krmags.com',
    client: 'Krmags',
    role: 'Frontend Developer',
    duration: '1 months',
    review: {
      rating: 5,
      comment: 'Excellent work and communication throughout the project',
      reviewer: 'Aquib',
      position: 'Managing Director'
    },
    support: {
      title: 'Support This Work',
      description: 'If you find this project valuable, consider supporting the development',
      amounts: [
        { amount: 199, label: 'Basic Support' },
        { amount: 299, label: 'Premium Support' },
        { amount: 999, label: 'Enterprise Support' }
      ]
    }
  }
]; 