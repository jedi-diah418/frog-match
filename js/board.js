import { Frog } from './frog.js';
import { Matcher } from './matcher.js';

export class Board {
    constructor(size = 8) {
        this.size = size;
        this.grid = [];
        this.matcher = new Matcher(this);
        this.initialize();
    }

    // Initialize the board with random frogs (ensuring no initial matches)
    initialize() {
        this.grid = [];
        for (let row = 0; row < this.size; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.size; col++) {
                this.grid[row][col] = this.createRandomFrog(row, col);
            }
        }

        // Remove any initial matches
        while (this.matcher.findMatches().length > 0) {
            const matches = this.matcher.findMatches();
            for (const match of matches) {
                for (const frog of match.frogs) {
                    this.grid[frog.row][frog.col] = this.createRandomFrog(frog.row, frog.col);
                }
            }
        }
    }

    // Create a random frog that doesn't create immediate matches
    createRandomFrog(row, col) {
        const availableTypes = Frog.getAllTypes();
        const invalidTypes = new Set();

        // Check left neighbors
        if (col >= 2) {
            const left1 = this.grid[row][col - 1];
            const left2 = this.grid[row][col - 2];
            if (left1 && left2 && left1.type.id === left2.type.id) {
                invalidTypes.add(left1.type.id);
            }
        }

        // Check top neighbors
        if (row >= 2) {
            const top1 = this.grid[row - 1][col];
            const top2 = this.grid[row - 2][col];
            if (top1 && top2 && top1.type.id === top2.type.id) {
                invalidTypes.add(top1.type.id);
            }
        }

        // Get valid types
        const validTypes = availableTypes.filter(type => !invalidTypes.has(type.id));

        // Pick a random valid type
        const type = validTypes.length > 0
            ? validTypes[Math.floor(Math.random() * validTypes.length)]
            : Frog.getRandomType();

        return new Frog(row, col, type);
    }

    // Get frog at position
    getFrog(row, col) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            return null;
        }
        return this.grid[row][col];
    }

    // Set frog at position
    setFrog(row, col, frog) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            return;
        }
        this.grid[row][col] = frog;
        if (frog) {
            frog.row = row;
            frog.col = col;
        }
    }

    // Swap two frogs
    swap(row1, col1, row2, col2) {
        const frog1 = this.getFrog(row1, col1);
        const frog2 = this.getFrog(row2, col2);

        this.setFrog(row1, col1, frog2);
        this.setFrog(row2, col2, frog1);

        if (frog1) frog1.moveTo(row2, col2);
        if (frog2) frog2.moveTo(row1, col1);
    }

    // Check if two positions are adjacent
    areAdjacent(row1, col1, row2, col2) {
        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    // Remove frogs from the board
    removeFrogs(frogs) {
        for (const frog of frogs) {
            frog.markForRemoval();
            this.grid[frog.row][frog.col] = null;
        }
    }

    // Apply gravity - make frogs fall down
    applyGravity() {
        let moved = false;

        for (let col = 0; col < this.size; col++) {
            // Count empty spaces from bottom
            let emptyRow = this.size - 1;

            for (let row = this.size - 1; row >= 0; row--) {
                const frog = this.grid[row][col];

                if (frog) {
                    if (row < emptyRow) {
                        // Move frog down
                        this.grid[emptyRow][col] = frog;
                        this.grid[row][col] = null;
                        frog.moveTo(emptyRow, col);
                        moved = true;
                    }
                    emptyRow--;
                }
            }
        }

        return moved;
    }

    // Fill empty spaces with new frogs
    fillEmpty() {
        let filled = false;

        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (!this.grid[row][col]) {
                    const frog = this.createRandomFrog(row, col);
                    // Start above the board and fall down
                    frog.setPosition(row - this.size, col);
                    frog.moveTo(row, col);
                    this.grid[row][col] = frog;
                    filled = true;
                }
            }
        }

        return filled;
    }

    // Update all frogs (for animations)
    update() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const frog = this.grid[row][col];
                if (frog) {
                    frog.update();
                }
            }
        }
    }

    // Check if any frogs are still animating
    isAnimating() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const frog = this.grid[row][col];
                if (frog && frog.isAnimating()) {
                    return true;
                }
            }
        }
        return false;
    }

    // Render the board
    render(ctx, cellSize, offsetX, offsetY) {
        // Draw grid background
        ctx.fillStyle = '#f7fafc';
        ctx.fillRect(offsetX, offsetY, this.size * cellSize, this.size * cellSize);

        // Draw grid lines
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;

        for (let i = 0; i <= this.size; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(offsetX + i * cellSize, offsetY);
            ctx.lineTo(offsetX + i * cellSize, offsetY + this.size * cellSize);
            ctx.stroke();

            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY + i * cellSize);
            ctx.lineTo(offsetX + this.size * cellSize, offsetY + i * cellSize);
            ctx.stroke();
        }

        // Render all frogs
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const frog = this.grid[row][col];
                if (frog && !frog.removing) {
                    frog.render(ctx, cellSize, offsetX, offsetY);
                }
            }
        }

        // Render removing frogs on top (for animation)
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const frog = this.grid[row][col];
                if (frog && frog.removing) {
                    frog.render(ctx, cellSize, offsetX, offsetY);
                }
            }
        }
    }

    // Get all frogs (for iteration)
    getAllFrogs() {
        const frogs = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const frog = this.grid[row][col];
                if (frog) {
                    frogs.push(frog);
                }
            }
        }
        return frogs;
    }

    // Count frogs of a specific type
    countFrogType(typeId) {
        let count = 0;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const frog = this.grid[row][col];
                if (frog && frog.type.id === typeId) {
                    count++;
                }
            }
        }
        return count;
    }

    // Debug: Print board state
    print() {
        console.log('Board state:');
        for (let row = 0; row < this.size; row++) {
            const rowStr = this.grid[row]
                .map(frog => frog ? frog.type.emoji : '⬜')
                .join(' ');
            console.log(rowStr);
        }
    }
}
