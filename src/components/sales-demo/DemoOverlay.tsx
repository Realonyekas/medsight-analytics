import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DemoOverlayProps {
  message: string;
  isVisible: boolean;
  position?: 'top' | 'center' | 'bottom';
  variant?: 'default' | 'highlight' | 'success' | 'warning';
  className?: string;
}

export function DemoOverlay({ 
  message, 
  isVisible, 
  position = 'bottom',
  variant = 'default',
  className 
}: DemoOverlayProps) {
  const positionClasses = {
    top: 'top-8 left-1/2 -translate-x-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-8 left-1/2 -translate-x-1/2',
  };

  const variantClasses = {
    default: 'bg-sidebar/95 border-sidebar-border text-sidebar-foreground',
    highlight: 'bg-primary/95 border-primary/50 text-primary-foreground',
    success: 'bg-success/95 border-success/50 text-white',
    warning: 'bg-warning/95 border-warning/50 text-warning-foreground',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'top' ? -20 : 20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'fixed z-[100] px-8 py-5 rounded-2xl border-2 backdrop-blur-xl shadow-2xl max-w-2xl text-center',
            positionClasses[position],
            variantClasses[variant],
            className
          )}
        >
          <motion.p 
            className="text-lg md:text-xl font-medium leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
