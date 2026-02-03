import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HospitalSize, 
  getHospitalConfig, 
  generateDemoPatient, 
  generateDemoInventory,
  generateDemoMetrics,
} from '@/lib/demoDataGenerator';
import { DemoProgress } from './DemoProgress';
import { DemoControls } from './DemoControls';
import { DemoOverlay } from './DemoOverlay';
import { Scene1ControlRoom } from './Scene1ControlRoom';
import { Scene2PatientStory } from './Scene2PatientStory';
import { Scene3MoneyLeak } from './Scene3MoneyLeak';
import { Scene4CommandNetwork } from './Scene4CommandNetwork';
import { Scene5Ownership } from './Scene5Ownership';
import { Scene6Decision } from './Scene6Decision';

interface SalesDemoModeProps {
  onExit?: () => void;
  initialSize?: HospitalSize;
}

const SCENE_OVERLAYS = [
  "This is what your hospital looks like when every system speaks to each other.",
  "This is the difference between a file and a living medical system.",
  "This is where hospitals lose money without seeing it.",
  "This is how hospitals move as one system, not scattered departments.",
  "This is not our software. This is your hospital's system.",
  "",
];

const SCENE_DURATIONS = [12000, 15000, 12000, 10000, 10000, 0]; // Auto-advance times (0 = manual)

export function SalesDemoMode({ onExit, initialSize = 'general' }: SalesDemoModeProps) {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(1);
  const [hospitalSize, setHospitalSize] = useState<HospitalSize>(initialSize);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showChaos, setShowChaos] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generate demo data based on hospital size
  const config = getHospitalConfig(hospitalSize);
  const demoPatient = generateDemoPatient(config, 1);
  const demoInventory = generateDemoInventory(config);
  const demoMetrics = generateDemoMetrics(config);

  // Handle scene transitions
  const goToScene = useCallback((scene: number) => {
    if (scene < 1 || scene > 6 || isTransitioning) return;
    
    setIsTransitioning(true);
    setShowOverlay(false);
    
    setTimeout(() => {
      setCurrentScene(scene);
      setIsTransitioning(false);
      
      // Show overlay after a brief delay
      if (SCENE_OVERLAYS[scene - 1]) {
        setTimeout(() => setShowOverlay(true), 1000);
        // Auto-hide overlay after 5 seconds
        setTimeout(() => setShowOverlay(false), 6000);
      }
    }, 500);
  }, [isTransitioning]);

  const handleNext = useCallback(() => {
    goToScene(currentScene + 1);
  }, [currentScene, goToScene]);

  const handlePrevious = useCallback(() => {
    goToScene(currentScene - 1);
  }, [currentScene, goToScene]);

  const handleSkip = useCallback(() => {
    goToScene(6);
  }, [goToScene]);

  const handleReplay = useCallback(() => {
    setCurrentScene(1);
    setShowChaos(false);
    setShowOverlay(true);
  }, []);

  const handleExit = useCallback(() => {
    if (onExit) {
      onExit();
    } else {
      navigate('/');
    }
  }, [onExit, navigate]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleMapHospital = useCallback(() => {
    navigate('/#demo');
  }, [navigate]);

  // Auto-advance scenes (except last scene)
  useEffect(() => {
    if (currentScene < 6 && SCENE_DURATIONS[currentScene - 1] > 0) {
      const timer = setTimeout(() => {
        handleNext();
      }, SCENE_DURATIONS[currentScene - 1]);
      
      return () => clearTimeout(timer);
    }
  }, [currentScene, handleNext]);

  // Show initial overlay
  useEffect(() => {
    if (currentScene === 1) {
      setTimeout(() => setShowOverlay(true), 1500);
      setTimeout(() => setShowOverlay(false), 7000);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'Escape') {
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, handleExit]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const renderScene = () => {
    switch (currentScene) {
      case 1:
        return (
          <Scene1ControlRoom 
            config={config} 
            metrics={demoMetrics} 
            showChaos={showChaos}
            onToggleChaos={() => setShowChaos(!showChaos)}
          />
        );
      case 2:
        return <Scene2PatientStory patient={demoPatient} />;
      case 3:
        return <Scene3MoneyLeak inventory={demoInventory} config={config} />;
      case 4:
        return <Scene4CommandNetwork config={config} />;
      case 5:
        return <Scene5Ownership config={config} />;
      case 6:
        return <Scene6Decision config={config} onMapHospital={handleMapHospital} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      {/* Progress Indicator */}
      <DemoProgress currentScene={currentScene} totalScenes={6} />

      {/* Scene Content */}
      <div className="h-full overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-full"
          >
            {renderScene()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlay Message */}
      <DemoOverlay 
        message={SCENE_OVERLAYS[currentScene - 1]} 
        isVisible={showOverlay && !!SCENE_OVERLAYS[currentScene - 1]}
        position="bottom"
        variant="default"
      />

      {/* Controls */}
      <DemoControls
        currentScene={currentScene}
        totalScenes={6}
        hospitalSize={hospitalSize}
        voiceoverEnabled={voiceoverEnabled}
        isFullscreen={isFullscreen}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSkip={handleSkip}
        onReplay={handleReplay}
        onToggleVoiceover={() => setVoiceoverEnabled(!voiceoverEnabled)}
        onToggleFullscreen={handleToggleFullscreen}
        onChangeHospitalSize={setHospitalSize}
        onExit={handleExit}
      />
    </div>
  );
}
