export class UIManager {
    constructor(game) {
        this.game = game;
        this.currentScreen = 'start';
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Screens
        this.screens = {
            start: document.getElementById('start-screen'),
            levelSelect: document.getElementById('level-select-screen'),
            game: document.getElementById('game-screen'),
            howToPlay: document.getElementById('how-to-play-screen'),
            settings: document.getElementById('settings-screen')
        };

        // Modals
        this.modals = {
            pause: document.getElementById('pause-modal'),
            victory: document.getElementById('victory-modal'),
            gameOver: document.getElementById('game-over-modal')
        };

        // HUD elements
        this.hud = {
            levelNumber: document.getElementById('level-number'),
            score: document.getElementById('score-value'),
            moves: document.getElementById('moves-value')
        };

        // Other elements
        this.objectivesContainer = document.getElementById('objectives-container');
        this.levelGrid = document.getElementById('level-grid');
        this.soundToggle = document.getElementById('sound-toggle');
        this.musicToggle = document.getElementById('music-toggle');
    }

    attachEventListeners() {
        // Start screen
        document.getElementById('play-btn').addEventListener('click', () => {
            this.showLevelSelect();
        });

        document.getElementById('how-to-play-btn').addEventListener('click', () => {
            this.showScreen('howToPlay');
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showScreen('settings');
        });

        // Level select
        document.getElementById('back-to-start-btn').addEventListener('click', () => {
            this.showScreen('start');
        });

        // Instructions
        document.getElementById('close-instructions-btn').addEventListener('click', () => {
            this.showScreen('start');
        });

        // Settings
        document.getElementById('close-settings-btn').addEventListener('click', () => {
            this.showScreen('start');
        });

        this.soundToggle.addEventListener('change', (e) => {
            this.game.audio.setSoundEnabled(e.target.checked);
            this.game.storage.updateSettings({ soundEnabled: e.target.checked });
        });

        this.musicToggle.addEventListener('change', (e) => {
            this.game.audio.setMusicEnabled(e.target.checked);
            this.game.storage.updateSettings({ musicEnabled: e.target.checked });
        });

        document.getElementById('reset-progress-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
                this.game.storage.reset();
                this.showLevelSelect();
            }
        });

        // Game screen
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.showModal('pause');
        });

        // Pause modal
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.hideModal('pause');
        });

        document.getElementById('restart-level-btn').addEventListener('click', () => {
            this.hideModal('pause');
            this.game.restartLevel();
        });

        document.getElementById('quit-to-menu-btn').addEventListener('click', () => {
            this.hideModal('pause');
            this.showLevelSelect();
        });

        // Victory modal
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.hideModal('victory');
            if (this.game.levelManager.hasNextLevel()) {
                this.game.startLevel(this.game.levelManager.getNextLevelNumber());
            } else {
                this.showLevelSelect();
            }
        });

        document.getElementById('replay-level-btn').addEventListener('click', () => {
            this.hideModal('victory');
            this.game.restartLevel();
        });

        document.getElementById('victory-menu-btn').addEventListener('click', () => {
            this.hideModal('victory');
            this.showLevelSelect();
        });

        // Game over modal
        document.getElementById('retry-level-btn').addEventListener('click', () => {
            this.hideModal('gameOver');
            this.game.restartLevel();
        });

        document.getElementById('game-over-menu-btn').addEventListener('click', () => {
            this.hideModal('gameOver');
            this.showLevelSelect();
        });
    }

    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // Show requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
    }

    showModal(modalName) {
        if (this.modals[modalName]) {
            this.modals[modalName].classList.add('active');
        }
    }

    hideModal(modalName) {
        if (this.modals[modalName]) {
            this.modals[modalName].classList.remove('active');
        }
    }

    showLevelSelect() {
        this.updateLevelGrid();
        this.showScreen('levelSelect');
    }

    updateLevelGrid() {
        this.levelGrid.innerHTML = '';
        const totalLevels = this.game.levelManager.getTotalLevels();

        for (let i = 1; i <= totalLevels; i++) {
            const button = document.createElement('button');
            button.className = 'level-button';
            button.textContent = i;

            const isUnlocked = this.game.storage.isLevelUnlocked(i);
            const stars = this.game.storage.getLevelStars(i);

            if (isUnlocked) {
                button.classList.add('unlocked');
                button.addEventListener('click', () => {
                    this.game.startLevel(i);
                });

                if (stars > 0) {
                    const starsDiv = document.createElement('div');
                    starsDiv.className = 'level-stars';
                    starsDiv.textContent = '⭐'.repeat(stars);
                    button.appendChild(starsDiv);
                }
            } else {
                button.classList.add('locked');
                button.textContent = '🔒';
            }

            this.levelGrid.appendChild(button);
        }
    }

    updateHUD() {
        this.hud.levelNumber.textContent = this.game.currentLevelNumber;
        this.hud.score.textContent = this.game.score;
        this.hud.moves.textContent = this.game.movesRemaining;
    }

    updateObjectives() {
        this.objectivesContainer.innerHTML = '';
        const level = this.game.levelManager.getCurrentLevel();

        if (!level) return;

        for (const objective of level.objectives) {
            const progress = level.getObjectiveProgress(objective, this.game);
            const div = document.createElement('div');
            div.className = 'objective-item';

            if (progress.current >= progress.target) {
                div.classList.add('completed');
            }

            div.innerHTML = `
                <span>${progress.text}</span>
                <span class="objective-progress">${progress.current >= progress.target ? '✓' : ''}</span>
            `;

            this.objectivesContainer.appendChild(div);
        }
    }

    showVictory(stars, score) {
        const starsContainer = document.getElementById('stars-container');
        starsContainer.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.textContent = '⭐';

            if (i < stars) {
                setTimeout(() => {
                    star.classList.add('earned');
                }, i * 200);
            }

            starsContainer.appendChild(star);
        }

        document.getElementById('final-score-value').textContent = score;

        // Hide next level button if no more levels
        const nextBtn = document.getElementById('next-level-btn');
        if (!this.game.levelManager.hasNextLevel()) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'block';
        }

        setTimeout(() => {
            this.showModal('victory');
        }, 500);
    }

    showGameOver(score) {
        document.getElementById('game-over-score-value').textContent = score;
        setTimeout(() => {
            this.showModal('gameOver');
        }, 500);
    }

    loadSettings() {
        const settings = this.game.storage.getSettings();
        this.soundToggle.checked = settings.soundEnabled || false;
        this.musicToggle.checked = settings.musicEnabled || false;
    }
}
