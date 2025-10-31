export class StorageManager {
    constructor() {
        this.storageKey = 'frogMatch';
        this.defaultData = {
            unlockedLevels: 1,
            levelStars: {}, // { levelNumber: stars }
            levelScores: {}, // { levelNumber: highScore }
            settings: {
                soundEnabled: false,
                musicEnabled: false
            }
        };
    }

    // Load game data from localStorage
    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                return { ...this.defaultData, ...data };
            }
        } catch (error) {
            console.error('Error loading save data:', error);
        }
        return { ...this.defaultData };
    }

    // Save game data to localStorage
    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Update level completion
    completeLevel(levelNumber, stars, score) {
        const data = this.load();

        // Update stars (only if better)
        const currentStars = data.levelStars[levelNumber] || 0;
        data.levelStars[levelNumber] = Math.max(currentStars, stars);

        // Update high score
        const currentScore = data.levelScores[levelNumber] || 0;
        data.levelScores[levelNumber] = Math.max(currentScore, score);

        // Unlock next level
        data.unlockedLevels = Math.max(data.unlockedLevels, levelNumber + 1);

        this.save(data);
        return data;
    }

    // Get stars for a level
    getLevelStars(levelNumber) {
        const data = this.load();
        return data.levelStars[levelNumber] || 0;
    }

    // Get high score for a level
    getLevelHighScore(levelNumber) {
        const data = this.load();
        return data.levelScores[levelNumber] || 0;
    }

    // Check if a level is unlocked
    isLevelUnlocked(levelNumber) {
        const data = this.load();
        return levelNumber <= data.unlockedLevels;
    }

    // Get number of unlocked levels
    getUnlockedLevels() {
        const data = this.load();
        return data.unlockedLevels;
    }

    // Update settings
    updateSettings(settings) {
        const data = this.load();
        data.settings = { ...data.settings, ...settings };
        this.save(data);
    }

    // Get settings
    getSettings() {
        const data = this.load();
        return data.settings;
    }

    // Reset all progress
    reset() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error resetting data:', error);
            return false;
        }
    }

    // Get total stars earned across all levels
    getTotalStars() {
        const data = this.load();
        return Object.values(data.levelStars).reduce((sum, stars) => sum + stars, 0);
    }

    // Get completion percentage
    getCompletionPercentage(totalLevels) {
        const data = this.load();
        const completedLevels = Object.keys(data.levelStars).length;
        return Math.round((completedLevels / totalLevels) * 100);
    }
}
