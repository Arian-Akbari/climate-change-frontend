'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw, Download, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  onCompute: () => void;
  onReset: () => void;
  onExport: () => void;
  isComputing: boolean;
}

export function ActionButtons({ onCompute, onReset, onExport, isComputing }: ActionButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        onClick={onCompute}
        disabled={isComputing}
        className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg"
      >
        {isComputing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Computing...
          </>
        ) : (
          'COMPUTE MAP'
        )}
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={onReset}
          variant="outline"
          disabled={isComputing}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button
          onClick={onExport}
          variant="outline"
          disabled
          className="opacity-50"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}

