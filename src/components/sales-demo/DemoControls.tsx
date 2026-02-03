import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  SkipForward, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Building2, 
  Maximize, 
  Minimize,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { HospitalSize } from '@/lib/demoDataGenerator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DemoControlsProps {
  currentScene: number;
  totalScenes: number;
  hospitalSize: HospitalSize;
  voiceoverEnabled: boolean;
  isFullscreen: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onReplay: () => void;
  onToggleVoiceover: () => void;
  onToggleFullscreen: () => void;
  onChangeHospitalSize: (size: HospitalSize) => void;
  onExit: () => void;
}

export function DemoControls({
  currentScene,
  totalScenes,
  hospitalSize,
  voiceoverEnabled,
  isFullscreen,
  onPrevious,
  onNext,
  onSkip,
  onReplay,
  onToggleVoiceover,
  onToggleFullscreen,
  onChangeHospitalSize,
  onExit,
}: DemoControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] px-4 py-3 bg-sidebar/90 backdrop-blur-xl rounded-2xl border border-sidebar-border shadow-xl"
    >
      <div className="flex items-center gap-2 md:gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={currentScene <= 1}
            className="h-9 w-9 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={currentScene >= totalScenes}
            className="h-9 w-9 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="h-6 w-px bg-sidebar-border" />

        {/* Hospital Size */}
        <div className="hidden sm:flex items-center gap-2">
          <Building2 className="h-4 w-4 text-sidebar-foreground/50" />
          <Select value={hospitalSize} onValueChange={(v) => onChangeHospitalSize(v as HospitalSize)}>
            <SelectTrigger className="h-8 w-28 bg-sidebar-accent border-sidebar-border text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clinic">Clinic</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="state">State Hospital</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-6 w-px bg-sidebar-border hidden sm:block" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleVoiceover}
            className="h-9 w-9 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            title={voiceoverEnabled ? 'Mute voiceover' : 'Enable voiceover'}
          >
            {voiceoverEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className="h-9 w-9 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent hidden md:flex"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onReplay}
            className="h-9 w-9 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            title="Replay demo"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="h-9 px-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent hidden md:flex"
          >
            <SkipForward className="h-4 w-4 mr-1" />
            Skip
          </Button>
        </div>

        <div className="h-6 w-px bg-sidebar-border" />

        {/* Exit */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onExit}
          className="h-9 w-9 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
          title="Exit demo"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}
