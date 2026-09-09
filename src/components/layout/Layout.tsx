'use client';
import React, { useState } from 'react';
/* import Sidebar from './Sidebar'; */
import Header from './Header';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#fafafa]">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-80 transform bg-[#0f172a] transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} `}
      >
        {/* <Sidebar onClose={() => setIsSidebarOpen(false)} /> */}
      </div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#fafafa]">
          <div className="mx-auto max-w-[3440px] px-4 py-8 sm:px-6 lg:px-12">
            <div className="w-full">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
