import React from 'react';
import Nodejs from '../public/icons/nodejs';
import Firebase from '../public/icons/firebase';

const Stack = () => {
  const frontendTechnologies = [
    {
      name: 'React',
      icon: '⚛️',
      description: 'A JavaScript library for building user interfaces'
    },
    {
      name: 'Next.js',
      icon: '▲',
      description: 'React framework for production-grade applications'
    },
    {
      name: 'Tailwind CSS',
      icon: '🎨',
      description: 'Utility-first CSS framework for rapid UI development'
    },
    {
      name: 'Node.js',
      icon: <Nodejs />,
      description: 'JavaScript runtime for building scalable network applications'
    },
    {
      name: 'Firebase',
      icon: <Firebase />,
      description: 'Google\'s platform for building web and mobile applications'
    }
  ];

  const backendTechnologies = [
    {
      name: 'Python',
      icon: '🐍',
      description: 'High-level programming language for general-purpose programming'
    },
    {
      name: 'Django',
      icon: '🎯',
      description: 'High-level Python web framework for rapid development'
    },
    {
      name: 'PostgreSQL',
      icon: '🐘',
      description: 'Advanced open-source relational database'
    }
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Tech Stack</h2>
        
        {/* Frontend Technologies */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">Frontend Technologies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {frontendTechnologies.map((tech, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-lg p-6 flex flex-col items-center text-center hover:transform hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-4 text-4xl">{tech.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{tech.name}</h3>
                <p className="text-gray-400">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Backend Technologies */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">Backend Technologies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {backendTechnologies.map((tech, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-lg p-6 flex flex-col items-center text-center hover:transform hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-4 text-4xl">{tech.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{tech.name}</h3>
                <p className="text-gray-400">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack; 