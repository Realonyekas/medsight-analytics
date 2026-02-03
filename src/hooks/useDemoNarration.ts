import { useCallback, useEffect, useRef } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useSoundDesign } from './useSoundDesign';

const SCENE_NARRATIONS: Record<number, string> = {
  1: `Welcome to your hospital command center. 
      This is what your hospital looks like when every system speaks to each other. 
      Notice how patient volumes, revenue tracking, and department bottlenecks are all visible in real-time.
      The pulsing indicators show areas that need your attention.
      Toggle the chaos view to see what you're currently missing.`,
  
  2: `Let's follow a patient's journey through your hospital.
      Watch how Mrs. Adaeze Okonkwo moves through registration, consultation, laboratory, pharmacy, and discharge.
      This is the difference between a file and a living medical system.
      The AI detected a potential drug interaction and prevented a medical error.
      Every department has instant access to her complete history.`,
  
  3: `This is your inventory intelligence center.
      Here's where hospitals lose money without seeing it.
      Watch as the system flags expired medications, detects potential theft patterns, and forecasts demand.
      The cost saved counter shows real-time financial recovery.
      Your stock efficiency meter reveals hidden opportunities.`,
  
  4: `Welcome to your communication command network.
      This is how hospitals move as one system, not scattered departments.
      See how emergency broadcasts reach all staff instantly.
      Task handovers are tracked and accountable.
      Department coordination happens in real-time.`,
  
  5: `Now, the moment of ownership.
      This is not our software. This is your hospital's system.
      Your logo. Your colors. Your domain.
      Staff and patients see your brand, not ours.
      Complete white-label customization for total ownership.`,
  
  6: `You've seen the complete transformation.
      Lives protected. Money saved. Leadership clarity.
      The question isn't whether you can afford this system.
      It's whether you can afford not to have it.
      Click Map My Hospital to begin your transformation.`
};

export function useDemoNarration(
  currentScene: number,
  voiceoverEnabled: boolean,
  soundEnabled: boolean
) {
  const { speak, stop, isSpeaking } = useSpeechSynthesis({ rate: 0.85, pitch: 1 });
  const { playSound, stopAmbient } = useSoundDesign(soundEnabled);
  const lastSceneRef = useRef<number>(0);
  const hasPlayedIntroRef = useRef(false);

  // Play narration when scene changes
  useEffect(() => {
    if (currentScene !== lastSceneRef.current) {
      lastSceneRef.current = currentScene;
      
      // Play transition sound
      if (soundEnabled && currentScene > 1) {
        playSound('whoosh');
      }

      // Start narration after a brief delay
      if (voiceoverEnabled && SCENE_NARRATIONS[currentScene]) {
        stop(); // Stop any ongoing narration
        setTimeout(() => {
          speak(SCENE_NARRATIONS[currentScene]);
        }, 1500);
      }
    }
  }, [currentScene, voiceoverEnabled, soundEnabled, speak, stop, playSound]);

  // Start ambient sound on first scene
  useEffect(() => {
    if (soundEnabled && currentScene === 1 && !hasPlayedIntroRef.current) {
      hasPlayedIntroRef.current = true;
      playSound('ambient');
      
      // Play intro transition
      setTimeout(() => playSound('transition'), 500);
    }
  }, [currentScene, soundEnabled, playSound]);

  // Stop ambient when exiting
  useEffect(() => {
    return () => {
      stop();
      stopAmbient();
    };
  }, [stop, stopAmbient]);

  const playSceneSound = useCallback((type: 'alert' | 'success' | 'click' | 'pulse') => {
    if (soundEnabled) {
      playSound(type);
    }
  }, [soundEnabled, playSound]);

  const replayNarration = useCallback(() => {
    if (voiceoverEnabled && SCENE_NARRATIONS[currentScene]) {
      stop();
      speak(SCENE_NARRATIONS[currentScene]);
    }
  }, [currentScene, voiceoverEnabled, speak, stop]);

  return {
    isSpeaking,
    stopNarration: stop,
    replayNarration,
    playSceneSound
  };
}
