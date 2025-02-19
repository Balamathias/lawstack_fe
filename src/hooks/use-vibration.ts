import { useCallback } from 'react';

type VibrationType = 'success' | 'failure' | 'info';

const vibrationPatterns: Record<VibrationType, number | number[]> = {
  success: [100, 50, 100],
  failure: [200, 100, 200, 100, 200],
  info: 150,
};

const useVibration = () => {
  const vibrate = useCallback((type: VibrationType) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const pattern = vibrationPatterns[type];
      navigator.vibrate(pattern);
    } else {
      console.warn('Vibration API not supported on this device or browser.');
    }
  }, []);

  return vibrate;
};

export default useVibration;
