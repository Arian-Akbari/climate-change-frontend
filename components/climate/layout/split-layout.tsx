'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface SplitLayoutProps {
  sidebar: React.ReactNode;
  map: React.ReactNode;
  statistics: React.ReactNode;
}

export function SplitLayout({ sidebar, map, statistics }: SplitLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-card shadow-lg"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`
            fixed lg:relative inset-y-0 left-0 z-40
            w-full lg:w-96 xl:w-[420px]
            bg-card border-r border-border
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${!isSidebarOpen ? 'lg:w-0 lg:border-0' : ''}
            overflow-y-auto
          `}
        >
          <div className="p-6 pt-20 lg:pt-6">
            {sidebar}
          </div>
        </aside>

        {/* Map View */}
        <main className="flex-1 relative overflow-hidden">
          {map}
        </main>
      </div>

      {/* Bottom Statistics Panel */}
      <div className="border-t border-border bg-card">
        {statistics}
      </div>
    </div>
  );
}

