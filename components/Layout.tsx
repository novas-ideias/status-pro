
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, maxWidth = "max-w-[480px]", className = "" }) => {
  return (
    <div className={`mx-auto min-h-screen bg-white dark:bg-background-dark shadow-xl flex flex-col ${maxWidth} ${className}`}>
      {children}
    </div>
  );
};
