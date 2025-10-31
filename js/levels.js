import { FrogType } from './frog.js';

export const ObjectiveType = {
    SCORE: 'score',
    COLLECT: 'collect',
    CLEAR_SPECIAL: 'clear_special'
};

export class Level {
    constructor(number, config) {
        this.number = number;
        this.moves = config.moves;
        this.objectives = config.objectives || [];
        this.stars = config.stars || { one: 1000, two: 2000, three: 3000 };
        this.description = config.description || `Level ${number}`;
    }

    // Check if all objectives are met
    checkObjectives(game) {
        for (const objective of this.objectives) {
            if (!this.isObjectiveMet(objective, game)) {
                return false;
            }
        }
        return true;
    }

    // Check if a single objective is met
    isObjectiveMet(objective, game) {
        switch (objective.type) {
            case ObjectiveType.SCORE:
                return game.score >= objective.target;

            case ObjectiveType.COLLECT:
                const collected = game.collectedFrogs[objective.frogType] || 0;
                return collected >= objective.target;

            case ObjectiveType.CLEAR_SPECIAL:
                return game.specialsCleared >= objective.target;

            default:
                return false;
        }
    }

    // Get objective progress
    getObjectiveProgress(objective, game) {
        switch (objective.type) {
            case ObjectiveType.SCORE:
                return {
                    current: game.score,
                    target: objective.target,
                    text: `Score ${game.score}/${objective.target}`
                };

            case ObjectiveType.COLLECT:
                const collected = game.collectedFrogs[objective.frogType] || 0;
                const frogName = Object.values(FrogType).find(t => t.id === objective.frogType)?.name || 'frog';
                const frogEmoji = Object.values(FrogType).find(t => t.id === objective.frogType)?.emoji || '🐸';
                return {
                    current: collected,
                    target: objective.target,
                    text: `Collect ${collected}/${objective.target} ${frogEmoji} ${frogName}`
                };

            case ObjectiveType.CLEAR_SPECIAL:
                return {
                    current: game.specialsCleared,
                    target: objective.target,
                    text: `Clear ${game.specialsCleared}/${objective.target} special frogs`
                };

            default:
                return { current: 0, target: 1, text: 'Unknown objective' };
        }
    }

    // Calculate stars earned based on score
    getStarsEarned(score) {
        if (score >= this.stars.three) return 3;
        if (score >= this.stars.two) return 2;
        if (score >= this.stars.one) return 1;
        return 0;
    }
}

// Level definitions
export const LEVELS = [
    // Level 1: Tutorial - Simple score goal
    new Level(1, {
        moves: 20,
        objectives: [
            { type: ObjectiveType.SCORE, target: 1000 }
        ],
        stars: { one: 1000, two: 1500, three: 2000 },
        description: "Lily Pond Basics"
    }),

    // Level 2: Collect green frogs
    new Level(2, {
        moves: 18,
        objectives: [
            { type: ObjectiveType.COLLECT, frogType: FrogType.GREEN.id, target: 15 }
        ],
        stars: { one: 800, two: 1200, three: 1800 },
        description: "Green Frog Gathering"
    }),

    // Level 3: Higher score goal
    new Level(3, {
        moves: 20,
        objectives: [
            { type: ObjectiveType.SCORE, target: 2000 }
        ],
        stars: { one: 2000, two: 2800, three: 3500 },
        description: "Frog Frenzy"
    }),

    // Level 4: Collect two types of frogs
    new Level(4, {
        moves: 22,
        objectives: [
            { type: ObjectiveType.COLLECT, frogType: FrogType.BLUE.id, target: 12 },
            { type: ObjectiveType.COLLECT, frogType: FrogType.RED.id, target: 12 }
        ],
        stars: { one: 1500, two: 2200, three: 3000 },
        description: "Rainbow Collection"
    }),

    // Level 5: Create special frogs
    new Level(5, {
        moves: 25,
        objectives: [
            { type: ObjectiveType.CLEAR_SPECIAL, target: 3 }
        ],
        stars: { one: 1800, two: 2500, three: 3500 },
        description: "Power Up!"
    }),

    // Level 6: High score with fewer moves
    new Level(6, {
        moves: 15,
        objectives: [
            { type: ObjectiveType.SCORE, target: 2500 }
        ],
        stars: { one: 2500, two: 3500, three: 4500 },
        description: "Quick Hopper"
    }),

    // Level 7: Collect yellow and purple
    new Level(7, {
        moves: 20,
        objectives: [
            { type: ObjectiveType.COLLECT, frogType: FrogType.YELLOW.id, target: 18 },
            { type: ObjectiveType.COLLECT, frogType: FrogType.PURPLE.id, target: 18 }
        ],
        stars: { one: 2000, two: 3000, three: 4000 },
        description: "Colorful Challenge"
    }),

    // Level 8: Collect multiple colors
    new Level(8, {
        moves: 25,
        objectives: [
            { type: ObjectiveType.COLLECT, frogType: FrogType.GREEN.id, target: 10 },
            { type: ObjectiveType.COLLECT, frogType: FrogType.BLUE.id, target: 10 },
            { type: ObjectiveType.COLLECT, frogType: FrogType.ORANGE.id, target: 10 }
        ],
        stars: { one: 2200, two: 3200, three: 4200 },
        description: "Triple Trouble"
    }),

    // Level 9: Create lots of special frogs
    new Level(9, {
        moves: 28,
        objectives: [
            { type: ObjectiveType.CLEAR_SPECIAL, target: 5 },
            { type: ObjectiveType.SCORE, target: 3000 }
        ],
        stars: { one: 3000, two: 4000, three: 5500 },
        description: "Special Forces"
    }),

    // Level 10: Final challenge
    new Level(10, {
        moves: 30,
        objectives: [
            { type: ObjectiveType.SCORE, target: 5000 },
            { type: ObjectiveType.COLLECT, frogType: FrogType.GREEN.id, target: 15 },
            { type: ObjectiveType.CLEAR_SPECIAL, target: 4 }
        ],
        stars: { one: 5000, two: 6500, three: 8000 },
        description: "Master Hopper"
    })
];

export class LevelManager {
    constructor() {
        this.currentLevel = null;
        this.currentLevelNumber = 1;
    }

    // Load a level by number
    loadLevel(levelNumber) {
        if (levelNumber < 1 || levelNumber > LEVELS.length) {
            console.error('Invalid level number:', levelNumber);
            return null;
        }

        this.currentLevelNumber = levelNumber;
        this.currentLevel = LEVELS[levelNumber - 1];
        return this.currentLevel;
    }

    // Get current level
    getCurrentLevel() {
        return this.currentLevel;
    }

    // Get next level number
    getNextLevelNumber() {
        return Math.min(this.currentLevelNumber + 1, LEVELS.length);
    }

    // Check if there is a next level
    hasNextLevel() {
        return this.currentLevelNumber < LEVELS.length;
    }

    // Get total number of levels
    getTotalLevels() {
        return LEVELS.length;
    }

    // Get level by number (for level select)
    getLevel(levelNumber) {
        if (levelNumber < 1 || levelNumber > LEVELS.length) {
            return null;
        }
        return LEVELS[levelNumber - 1];
    }
}
