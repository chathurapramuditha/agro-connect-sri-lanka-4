import { useCallback } from 'react';

export const useNotificationSound = () => {
  const playNotificationSound = useCallback(() => {
    try {
      // Create an audio context for better browser compatibility
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a simple notification sound using Web Audio API
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure the sound (pleasant notification tone)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.type = 'sine';
      
      // Configure volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      // Play the sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
    } catch (error) {
      console.log('Unable to play notification sound:', error);
      // Fallback: try to use a simple beep if available
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCz2W3fLHdSYEKGnA7N+VPwoWY7Hn5axZGAw+ltryxnkpBSl+zPLaizsIGGS57+OZURE');
        audio.volume = 0.3;
        audio.play();
      } catch {
        // If all else fails, at least log that we tried
        console.log('Notification sound not available');
      }
    }
  }, []);

  return { playNotificationSound };
};