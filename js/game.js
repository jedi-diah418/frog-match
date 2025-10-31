import { Board } from './board.js';
import { LevelManager } from './levels.js';
import { StorageManager } from './storage.js';
import { AudioManager } from './audio.js';
import { UIManager } from './ui.js';
import { SpecialType } from './frog.js';

const GameState = {
    IDLE: 'idle',
    PLAYING: 'playing',
    ANIMATING: 'animating',
    PROCESSING: 'processing',
    GAME_OVER: 'gameOver',
    VICTORY: 'victory'
};

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Managers
        this.board = new Board(8);
        this.levelManager = new LevelManager();
        this.storage = new StorageManager();
        this.audio = new AudioManager();
        this.ui = new UIManager(this);

        // Game state
        this.state = GameState.IDLE;
        this.currentLevelNumber = 1;
        this.score = 0;
        this.movesRemaining = 0;
        this.combo = 1;
        this.collectedFrogs = {}; // Track collected frogs by type
        this.specialsCleared = 0;

        // Input state
        this.selectedFrog = null;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;

        // Rendering
        this.cellSize = 0;
        this.boardOffsetX = 0;
        this.boardOffsetY = 0;

        this.initialize();
    }

    initialize() {
        this.setupCanvas();
        this.setupInput();
        this.loadSettings();
        this.gameLoop();
    }

    setupCanvas() {
        this.resizeCanvas = () => {
            const container = document.getElementById('game-board-container');
            const maxSize = Math.min(container.clientWidth, container.clientHeight) - 40;
            const size = Math.min(maxSize, 600);

            this.canvas.width = size;
            this.canvas.height = size;

            this.cellSize = size / this.board.size;
            this.boardOffsetX = 0;
            this.boardOffsetY = 0;

            console.log(`Canvas resized to ${size}x${size}, cell size: ${this.cellSize}`);
        };

        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas);
    }

    setupInput() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleInputStart(e.offsetX, e.offsetY));
        this.canvas.addEventListener('mousemove', (e) => this.handleInputMove(e.offsetX, e.offsetY));
        this.canvas.addEventListener('mouseup', () => this.handleInputEnd());

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.handleInputStart(
                touch.clientX - rect.left,
                touch.clientY - rect.top
            );
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.handleInputMove(
                touch.clientX - rect.left,
                touch.clientY - rect.top
            );
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleInputEnd();
        });
    }

    handleInputStart(x, y) {
        if (this.state !== GameState.PLAYING) return;

        const col = Math.floor((x - this.boardOffsetX) / this.cellSize);
        const row = Math.floor((y - this.boardOffsetY) / this.cellSize);

        const frog = this.board.getFrog(row, col);
        if (frog) {
            this.selectedFrog = { row, col };
            this.isDragging = true;
            this.dragStartX = x;
            this.dragStartY = y;
        }
    }

    handleInputMove(x, y) {
        if (!this.isDragging || !this.selectedFrog) return;

        const dx = x - this.dragStartX;
        const dy = y - this.dragStartY;
        const threshold = this.cellSize * 0.3;

        // Detect swipe direction
        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
            let targetRow = this.selectedFrog.row;
            let targetCol = this.selectedFrog.col;

            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal swipe
                targetCol += dx > 0 ? 1 : -1;
            } else {
                // Vertical swipe
                targetRow += dy > 0 ? 1 : -1;
            }

            // Attempt swap
            this.attemptSwap(
                this.selectedFrog.row,
                this.selectedFrog.col,
                targetRow,
                targetCol
            );

            this.selectedFrog = null;
            this.isDragging = false;
        }
    }

    handleInputEnd() {
        this.selectedFrog = null;
        this.isDragging = false;
    }

    attemptSwap(row1, col1, row2, col2) {
        // Check if valid positions
        if (!this.board.getFrog(row1, col1) || !this.board.getFrog(row2, col2)) {
            this.audio.playInvalidMove();
            return;
        }

        // Check if adjacent
        if (!this.board.areAdjacent(row1, col1, row2, col2)) {
            this.audio.playInvalidMove();
            return;
        }

        // Check if swap creates a match
        if (!this.board.matcher.wouldCreateMatch(row1, col1, row2, col2)) {
            // Invalid move - swap back with animation
            this.board.swap(row1, col1, row2, col2);
            setTimeout(() => {
                this.board.swap(row1, col1, row2, col2);
            }, 200);
            this.audio.playInvalidMove();
            return;
        }

        // Valid move!
        this.board.swap(row1, col1, row2, col2);
        this.audio.playSwap();
        this.movesRemaining--;
        this.ui.updateHUD();

        // Wait for swap animation, then process matches
        this.state = GameState.ANIMATING;
        setTimeout(() => {
            this.processMatches();
        }, 300);
    }

    processMatches() {
        this.state = GameState.PROCESSING;
        this.combo = 1;
        this.processMatchesRecursive();
    }

    processMatchesRecursive() {
        // Find matches
        const matches = this.board.matcher.findMatches();

        if (matches.length === 0) {
            // No more matches - check for game end
            this.checkGameEnd();
            return;
        }

        // Process matches
        for (const match of matches) {
            // Handle special frogs
            for (const special of match.specialMatches) {
                special.frog.special = special.type;
            }

            // Remove matched frogs and award points
            const regularFrogs = match.frogs.filter(
                frog => !match.specialMatches.some(s => s.frog === frog)
            );

            // Check for special frog activations
            const specialActivations = match.frogs.filter(
                frog => frog.special !== SpecialType.NONE
            );

            if (specialActivations.length > 0) {
                // Handle special frog activations
                for (const special of specialActivations) {
                    this.activateSpecialFrog(special);
                }
            } else {
                // Regular match
                this.removeFrogs(regularFrogs, match.specialMatches);
            }
        }

        this.audio.playMatch();

        // Wait for removal animation
        setTimeout(() => {
            // Apply gravity
            this.board.applyGravity();

            setTimeout(() => {
                // Fill empty spaces
                this.board.fillEmpty();

                setTimeout(() => {
                    // Increase combo and check for more matches
                    this.combo++;
                    this.processMatchesRecursive();
                }, 300);
            }, 300);
        }, 300);
    }

    removeFrogs(frogs, specialMatches = []) {
        // Calculate points
        const basePoints = frogs.length * 10;
        const points = Math.floor(basePoints * this.combo);
        this.score += points;

        // Track collected frogs
        for (const frog of frogs) {
            const typeId = frog.type.id;
            this.collectedFrogs[typeId] = (this.collectedFrogs[typeId] || 0) + 1;
        }

        // Track special frogs created
        this.specialsCleared += specialMatches.length;

        // Remove from board
        this.board.removeFrogs(frogs);

        // Update UI
        this.ui.updateHUD();
        this.ui.updateObjectives();

        if (this.combo > 1) {
            this.audio.playCascade();
        }
    }

    activateSpecialFrog(frog) {
        const targets = this.board.matcher.getSpecialFrogTargets(frog);

        // Calculate points
        const basePoints = targets.length * 15;
        const points = Math.floor(basePoints * this.combo);
        this.score += points;

        // Track collected frogs
        for (const target of targets) {
            const typeId = target.type.id;
            this.collectedFrogs[typeId] = (this.collectedFrogs[typeId] || 0) + 1;
        }

        this.specialsCleared++;

        // Remove from board
        this.board.removeFrogs(targets);

        // Update UI
        this.ui.updateHUD();
        this.ui.updateObjectives();

        this.audio.playSpecial();
    }

    checkGameEnd() {
        const level = this.levelManager.getCurrentLevel();

        // Check if objectives are met
        if (level.checkObjectives(this)) {
            this.endGame(true);
            return;
        }

        // Check if out of moves
        if (this.movesRemaining <= 0) {
            this.endGame(false);
            return;
        }

        // Check if no possible moves
        if (!this.board.matcher.hasPossibleMoves()) {
            this.endGame(false);
            return;
        }

        // Continue playing
        this.state = GameState.PLAYING;
    }

    endGame(victory) {
        if (victory) {
            this.state = GameState.VICTORY;
            const level = this.levelManager.getCurrentLevel();
            const stars = level.getStarsEarned(this.score);

            // Save progress
            this.storage.completeLevel(this.currentLevelNumber, stars, this.score);

            // Show victory screen
            this.audio.playVictory();
            this.ui.showVictory(stars, this.score);
        } else {
            this.state = GameState.GAME_OVER;
            this.audio.playGameOver();
            this.ui.showGameOver(this.score);
        }
    }

    startLevel(levelNumber) {
        // Load level
        const level = this.levelManager.loadLevel(levelNumber);
        if (!level) {
            console.error('Failed to load level:', levelNumber);
            return;
        }

        this.currentLevelNumber = levelNumber;
        this.score = 0;
        this.movesRemaining = level.moves;
        this.combo = 1;
        this.collectedFrogs = {};
        this.specialsCleared = 0;

        // Initialize board
        this.board.initialize();

        // Update UI
        this.ui.showScreen('game');

        // Resize canvas now that game screen is visible
        setTimeout(() => {
            this.resizeCanvas();
        }, 0);

        this.ui.updateHUD();
        this.ui.updateObjectives();

        // Start playing
        this.state = GameState.PLAYING;

        // Play start sound
        this.audio.playLevelStart();
    }

    restartLevel() {
        this.startLevel(this.currentLevelNumber);
    }

    loadSettings() {
        const settings = this.storage.getSettings();
        this.audio.loadSettings(settings);
        this.ui.loadSettings();
    }

    gameLoop() {
        // Update board animations
        this.board.update();

        // Render
        this.render();

        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }

    render() {
        // Check for dark mode
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Clear canvas
        this.ctx.fillStyle = isDarkMode ? '#1e2139' : '#f7fafc';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render board
        this.board.render(this.ctx, this.cellSize, this.boardOffsetX, this.boardOffsetY);

        // Highlight selected frog
        if (this.selectedFrog && this.state === GameState.PLAYING) {
            const { row, col } = this.selectedFrog;
            this.ctx.strokeStyle = isDarkMode ? '#9f7aea' : '#667eea';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(
                this.boardOffsetX + col * this.cellSize,
                this.boardOffsetY + row * this.cellSize,
                this.cellSize,
                this.cellSize
            );
        }
    }
}
