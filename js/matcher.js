import { SpecialType } from './frog.js';

export class Matcher {
    constructor(board) {
        this.board = board;
    }

    // Find all matches on the board
    findMatches() {
        const matches = [];
        const grid = this.board.grid;
        const size = this.board.size;

        // Check horizontal matches
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size - 2; col++) {
                const frog = grid[row][col];
                if (!frog) continue;

                const match = this.findHorizontalMatch(row, col);
                if (match.length >= 3) {
                    matches.push({
                        frogs: match,
                        type: 'horizontal',
                        length: match.length
                    });
                }
            }
        }

        // Check vertical matches
        for (let col = 0; col < size; col++) {
            for (let row = 0; row < size - 2; row++) {
                const frog = grid[row][col];
                if (!frog) continue;

                const match = this.findVerticalMatch(row, col);
                if (match.length >= 3) {
                    matches.push({
                        frogs: match,
                        type: 'vertical',
                        length: match.length
                    });
                }
            }
        }

        // Merge overlapping matches and remove duplicates
        return this.mergeMatches(matches);
    }

    findHorizontalMatch(row, col) {
        const grid = this.board.grid;
        const type = grid[row][col].type;
        const match = [grid[row][col]];

        for (let c = col + 1; c < this.board.size; c++) {
            const frog = grid[row][c];
            if (!frog || frog.type.id !== type.id) break;
            match.push(frog);
        }

        return match.length >= 3 ? match : [];
    }

    findVerticalMatch(row, col) {
        const grid = this.board.grid;
        const type = grid[row][col].type;
        const match = [grid[row][col]];

        for (let r = row + 1; r < this.board.size; r++) {
            const frog = grid[r][col];
            if (!frog || frog.type.id !== type.id) break;
            match.push(frog);
        }

        return match.length >= 3 ? match : [];
    }

    // Merge overlapping matches
    mergeMatches(matches) {
        if (matches.length === 0) return [];

        const uniqueFrogs = new Map();
        const mergedMatches = [];

        for (const match of matches) {
            const matchInfo = {
                frogs: match.frogs,
                type: match.type,
                length: match.length
            };

            for (const frog of match.frogs) {
                const key = `${frog.row}-${frog.col}`;
                if (!uniqueFrogs.has(key)) {
                    uniqueFrogs.set(key, { frog, matches: [] });
                }
                uniqueFrogs.get(key).matches.push(matchInfo);
            }
        }

        // Create combined match result
        const allMatchedFrogs = Array.from(uniqueFrogs.values()).map(v => v.frog);

        if (allMatchedFrogs.length > 0) {
            mergedMatches.push({
                frogs: allMatchedFrogs,
                specialMatches: this.detectSpecialMatches(uniqueFrogs)
            });
        }

        return mergedMatches;
    }

    // Detect special match patterns (4-match, 5-match, L-shape, T-shape)
    detectSpecialMatches(uniqueFrogs) {
        const specials = [];

        for (const [key, data] of uniqueFrogs) {
            const frog = data.frog;
            const matches = data.matches;

            // Check for 5-match (Rainbow Frog)
            const hasLongMatch = matches.some(m => m.length >= 5);
            if (hasLongMatch) {
                specials.push({
                    frog,
                    type: SpecialType.RAINBOW
                });
                continue;
            }

            // Check for L or T shape (Bomb Frog)
            const hasHorizontal = matches.some(m => m.type === 'horizontal' && m.length >= 3);
            const hasVertical = matches.some(m => m.type === 'vertical' && m.length >= 3);

            if (hasHorizontal && hasVertical) {
                specials.push({
                    frog,
                    type: SpecialType.BOMB
                });
                continue;
            }

            // Check for 4-match (Striped Frog)
            const horizontal4 = matches.find(m => m.type === 'horizontal' && m.length === 4);
            const vertical4 = matches.find(m => m.type === 'vertical' && m.length === 4);

            if (horizontal4) {
                specials.push({
                    frog,
                    type: SpecialType.STRIPED_HORIZONTAL
                });
            } else if (vertical4) {
                specials.push({
                    frog,
                    type: SpecialType.STRIPED_VERTICAL
                });
            }
        }

        return specials;
    }

    // Check if a swap would create a match
    wouldCreateMatch(row1, col1, row2, col2) {
        // Temporarily swap
        this.board.swap(row1, col1, row2, col2);

        // Check for matches at both positions
        const matches = this.findMatchesAt(row1, col1) || this.findMatchesAt(row2, col2);

        // Swap back
        this.board.swap(row1, col1, row2, col2);

        return matches;
    }

    // Find matches at a specific position
    findMatchesAt(row, col) {
        const frog = this.board.grid[row][col];
        if (!frog) return false;

        const hMatch = this.findHorizontalMatch(row, col);
        const vMatch = this.findVerticalMatch(row, col);

        return hMatch.length >= 3 || vMatch.length >= 3;
    }

    // Get frogs affected by special frog activation
    getSpecialFrogTargets(frog) {
        const targets = [];
        const grid = this.board.grid;

        switch (frog.special) {
            case SpecialType.STRIPED_HORIZONTAL:
                // Clear entire row
                for (let c = 0; c < this.board.size; c++) {
                    if (grid[frog.row][c]) {
                        targets.push(grid[frog.row][c]);
                    }
                }
                break;

            case SpecialType.STRIPED_VERTICAL:
                // Clear entire column
                for (let r = 0; r < this.board.size; r++) {
                    if (grid[r][frog.col]) {
                        targets.push(grid[r][frog.col]);
                    }
                }
                break;

            case SpecialType.RAINBOW:
                // Clear all frogs of the same type
                for (let r = 0; r < this.board.size; r++) {
                    for (let c = 0; c < this.board.size; c++) {
                        const targetFrog = grid[r][c];
                        if (targetFrog && targetFrog.type.id === frog.type.id) {
                            targets.push(targetFrog);
                        }
                    }
                }
                break;

            case SpecialType.BOMB:
                // Clear 3x3 area
                for (let r = Math.max(0, frog.row - 1); r <= Math.min(this.board.size - 1, frog.row + 1); r++) {
                    for (let c = Math.max(0, frog.col - 1); c <= Math.min(this.board.size - 1, frog.col + 1); c++) {
                        if (grid[r][c]) {
                            targets.push(grid[r][c]);
                        }
                    }
                }
                break;
        }

        return targets;
    }

    // Check if there are any possible moves left
    hasPossibleMoves() {
        const size = this.board.size;
        const grid = this.board.grid;

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                // Try swapping with right neighbor
                if (col < size - 1 && grid[row][col] && grid[row][col + 1]) {
                    if (this.wouldCreateMatch(row, col, row, col + 1)) {
                        return true;
                    }
                }

                // Try swapping with bottom neighbor
                if (row < size - 1 && grid[row][col] && grid[row + 1][col]) {
                    if (this.wouldCreateMatch(row, col, row + 1, col)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
