import React, { ReactNode } from 'react';
import ScheduleCall from '../common/schedule-call';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen w-full bg-black px-4 py-6 sm:p-6 md:p-8 lg:p-16">
      {children}
      <ScheduleCall />
    </main>
  );
};

export default MainLayout; 