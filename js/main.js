import { Game } from './game.js';

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🐸 Frog Match - Starting game...');

    try {
        // Create game instance
        window.game = new Game();
        console.log('🐸 Game initialized! Ready to play!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
});

// Prevent pull-to-refresh on mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent zoom on double-tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
