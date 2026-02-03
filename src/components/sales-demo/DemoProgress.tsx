import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface DemoProgressProps {
  currentScene: number;
  totalScenes: number;
  sceneLabels?: string[];
}

const defaultLabels = [
  'Control Room',
  'Patient Story',
  'Money Leak',
  'Command Network',
  'Ownership',
  'Decision',
];

export function DemoProgress({ 
  currentScene, 
  totalScenes, 
  sceneLabels = defaultLabels 
}: DemoProgressProps) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] px-6 py-3 bg-sidebar/90 backdrop-blur-xl rounded-full border border-sidebar-border shadow-xl">
      <div className="flex items-center gap-3">
        {Array.from({ length: totalScenes }).map((_, index) => {
          const sceneNum = index + 1;
          const isCompleted = sceneNum < currentScene;
          const isCurrent = sceneNum === currentScene;
          
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: isCurrent ? 1.1 : 1,
                    opacity: isCompleted || isCurrent ? 1 : 0.4
                  }}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                    isCompleted && 'bg-success text-white',
                    isCurrent && 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-sidebar',
                    !isCompleted && !isCurrent && 'bg-sidebar-accent text-sidebar-foreground/50'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    sceneNum
                  )}
                </motion.div>
                <span className={cn(
                  'text-[10px] mt-1 whitespace-nowrap hidden md:block',
                  isCurrent ? 'text-sidebar-foreground font-medium' : 'text-sidebar-foreground/50'
                )}>
                  {sceneLabels[index]}
                </span>
              </div>
              {index < totalScenes - 1 && (
                <div className={cn(
                  'w-8 h-0.5 hidden sm:block',
                  isCompleted ? 'bg-success' : 'bg-sidebar-accent'
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
