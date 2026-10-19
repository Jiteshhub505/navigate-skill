import { useState, useEffect } from 'react';

export function usePerformance() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Check for low-end device based on hardware concurrency and memory
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const isLowEnd = hardwareConcurrency <= 4 || deviceMemory <= 4;
    setIsLowEndDevice(isLowEnd);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return { reduceMotion, isLowEndDevice };
}
