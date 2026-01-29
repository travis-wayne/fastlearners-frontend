/**
 * Sound Manager for Lesson Completion Celebrations
 * Handles playback of celebration sounds with mute controls
 */

export enum SoundType {
  COMPLETION = 'completion',
  ACHIEVEMENT = 'achievement',
  PERFECT_SCORE = 'perfect',
  STAR_EARNED = 'star',
  LEVEL_UP = 'level_up',
}

class SoundManagerClass {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private muted: boolean = false;
  private initialized: boolean = false;

  constructor() {
    // Load mute preference from localStorage
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('lesson-sounds-muted');
      this.muted = storedMute === 'true';
    }
  }

  /**
   * Preload all sound files
   */
  preload(): void {
    if (this.initialized || typeof window === 'undefined') return;

    const soundFiles: Record<SoundType, string> = {
      [SoundType.COMPLETION]: '/sounds/completion.mp3',
      [SoundType.ACHIEVEMENT]: '/sounds/achievement.mp3',
      [SoundType.PERFECT_SCORE]: '/sounds/perfect.mp3',
      [SoundType.STAR_EARNED]: '/sounds/star.mp3',
      [SoundType.LEVEL_UP]: '/sounds/level_up.mp3',
    };

    Object.entries(soundFiles).forEach(([type, src]) => {
      try {
        const audio = new Audio();
        
        // Handle load errors gracefully
        audio.addEventListener('error', () => {
          console.warn(`Failed to load sound file: ${src}. Sound will be skipped.`);
        });
        
        audio.src = src;
        audio.preload = 'auto';
        // Set volume to 70% for pleasant sound levels
        audio.volume = 0.7;
        this.sounds.set(type as SoundType, audio);
      } catch (error) {
        console.warn(`Failed to preload sound: ${type}`, error);
      }
    });

    this.initialized = true;
  }

  /**
   * Play a sound effect
   * @param soundType - The type of sound to play
   * @param volume - Optional volume override (0-1)
   */
  play(soundType: SoundType, volume?: number): void {
    if (this.muted || typeof window === 'undefined') return;

    const audio = this.sounds.get(soundType);
    if (!audio) {
      console.warn(`Sound not found: ${soundType}`);
      return;
    }

    try {
      // Clone the audio element to allow overlapping sounds
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      if (volume !== undefined) {
        audioClone.volume = Math.max(0, Math.min(1, volume));
      }
      
      // Play with error handling for autoplay restrictions
      const playPromise = audioClone.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented - this is expected in some browsers
          console.debug('Sound playback prevented:', error);
        });
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundType}`, error);
    }
  }

  /**
   * Set muted state and persist to localStorage
   */
  setMuted(muted: boolean): void {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('lesson-sounds-muted', String(muted));
    }
  }

  /**
   * Get current muted state
   */
  getMuted(): boolean {
    return this.muted;
  }

  /**
   * Toggle muted state
   */
  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }
}

// Export singleton instance
export const SoundManager = new SoundManagerClass();
