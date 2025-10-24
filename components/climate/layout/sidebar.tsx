'use client';

import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Climate Data Visualization</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure parameters and visualize climate data
        </p>
      </div>
      <Separator />
      {children}
    </div>
  );
}

