export class AudioManager {
    constructor() {
        this.soundEnabled = false; // Off by default
        this.musicEnabled = false; // Off by default
        this.sounds = {};
        this.music = null;
        this.initialized = false;
    }

    // Initialize audio (can be called when user interacts first time)
    initialize() {
        if (this.initialized) return;

        // Create simple beep sounds using Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.initialized = true;
    }

    // Play a simple tone (since we don't have audio files)
    playTone(frequency, duration, type = 'sine') {
        if (!this.soundEnabled || !this.initialized) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }

    // Sound effects using simple tones
    playMatch() {
        this.playTone(523.25, 0.1); // C5
    }

    playCascade() {
        this.playTone(659.25, 0.08); // E5
    }

    playSwap() {
        this.playTone(440, 0.05); // A4
    }

    playInvalidMove() {
        this.playTone(220, 0.15, 'square'); // A3 with different wave
    }

    playSpecial() {
        // Play ascending notes for special activation
        setTimeout(() => this.playTone(523.25, 0.1), 0);   // C5
        setTimeout(() => this.playTone(659.25, 0.1), 50);  // E5
        setTimeout(() => this.playTone(783.99, 0.15), 100); // G5
    }

    playVictory() {
        // Victory fanfare
        setTimeout(() => this.playTone(523.25, 0.2), 0);
        setTimeout(() => this.playTone(659.25, 0.2), 150);
        setTimeout(() => this.playTone(783.99, 0.2), 300);
        setTimeout(() => this.playTone(1046.5, 0.4), 450); // C6
    }

    playGameOver() {
        // Descending notes for game over
        setTimeout(() => this.playTone(523.25, 0.2), 0);
        setTimeout(() => this.playTone(440, 0.2), 150);
        setTimeout(() => this.playTone(349.23, 0.4), 300); // F4
    }

    playLevelStart() {
        setTimeout(() => this.playTone(392, 0.1), 0);   // G4
        setTimeout(() => this.playTone(523.25, 0.15), 100); // C5
    }

    // Enable/disable sound
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        if (enabled && !this.initialized) {
            this.initialize();
        }
    }

    // Enable/disable music
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        // Music implementation would go here if we had audio files
    }

    // Get current settings
    getSettings() {
        return {
            soundEnabled: this.soundEnabled,
            musicEnabled: this.musicEnabled
        };
    }

    // Load settings
    loadSettings(settings) {
        if (settings.soundEnabled !== undefined) {
            this.soundEnabled = settings.soundEnabled;
        }
        if (settings.musicEnabled !== undefined) {
            this.musicEnabled = settings.musicEnabled;
        }
    }
}
