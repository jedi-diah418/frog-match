// Frog types and their properties
export const FrogType = {
    GREEN: { id: 0, emoji: '🟢', color: '#48bb78', name: 'green' },
    BLUE: { id: 1, emoji: '🔵', color: '#4299e1', name: 'blue' },
    RED: { id: 2, emoji: '🔴', color: '#f56565', name: 'red' },
    YELLOW: { id: 3, emoji: '🟡', color: '#ecc94b', name: 'yellow' },
    PURPLE: { id: 4, emoji: '🟣', color: '#9f7aea', name: 'purple' },
    ORANGE: { id: 5, emoji: '🟠', color: '#ed8936', name: 'orange' }
};

export const SpecialType = {
    NONE: 0,
    STRIPED_HORIZONTAL: 1,
    STRIPED_VERTICAL: 2,
    RAINBOW: 3,
    BOMB: 4
};

export class Frog {
    constructor(row, col, type) {
        this.row = row;
        this.col = col;
        this.type = type; // FrogType
        this.special = SpecialType.NONE;
        this.id = Math.random(); // Unique ID for tracking

        // Animation properties
        this.x = col;
        this.y = row;
        this.targetX = col;
        this.targetY = row;
        this.scale = 1;
        this.targetScale = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.removing = false;
    }

    // Update animation
    update() {
        const speed = 0.3;

        // Smooth movement
        this.x += (this.targetX - this.x) * speed;
        this.y += (this.targetY - this.y) * speed;

        // Smooth scaling
        this.scale += (this.targetScale - this.scale) * speed;

        // Check if close enough to snap
        if (Math.abs(this.x - this.targetX) < 0.01) this.x = this.targetX;
        if (Math.abs(this.y - this.targetY) < 0.01) this.y = this.targetY;
        if (Math.abs(this.scale - this.targetScale) < 0.01) this.scale = this.targetScale;
    }

    // Move to a new position (with animation)
    moveTo(row, col) {
        this.row = row;
        this.col = col;
        this.targetX = col;
        this.targetY = row;
    }

    // Immediate position update (no animation)
    setPosition(row, col) {
        this.row = row;
        this.col = col;
        this.x = col;
        this.y = row;
        this.targetX = col;
        this.targetY = row;
    }

    // Mark for removal with animation
    markForRemoval() {
        this.removing = true;
        this.targetScale = 0;
        this.rotation = Math.random() * 360;
    }

    // Check if animation is complete
    isAnimating() {
        return Math.abs(this.x - this.targetX) > 0.01 ||
               Math.abs(this.y - this.targetY) > 0.01 ||
               Math.abs(this.scale - this.targetScale) > 0.01;
    }

    // Render the frog
    render(ctx, cellSize, offsetX, offsetY) {
        const centerX = offsetX + this.x * cellSize + cellSize / 2;
        const centerY = offsetY + this.y * cellSize + cellSize / 2;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scale, this.scale);

        // Draw emoji
        ctx.font = `${cellSize * 0.7}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.type.emoji, 0, 0);

        // Draw special indicator
        if (this.special !== SpecialType.NONE) {
            this.renderSpecialIndicator(ctx, cellSize);
        }

        ctx.restore();
    }

    renderSpecialIndicator(ctx, cellSize) {
        const size = cellSize * 0.3;

        ctx.font = `${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        switch (this.special) {
            case SpecialType.STRIPED_HORIZONTAL:
                ctx.fillText('➡️', 0, cellSize * 0.35);
                break;
            case SpecialType.STRIPED_VERTICAL:
                ctx.fillText('⬇️', 0, cellSize * 0.35);
                break;
            case SpecialType.RAINBOW:
                ctx.fillText('🌈', 0, cellSize * 0.35);
                break;
            case SpecialType.BOMB:
                ctx.fillText('💣', 0, cellSize * 0.35);
                break;
        }
    }

    // Get all frog types as an array
    static getAllTypes() {
        return Object.values(FrogType);
    }

    // Get a random frog type
    static getRandomType() {
        const types = Frog.getAllTypes();
        return types[Math.floor(Math.random() * types.length)];
    }

    // Clone this frog
    clone() {
        const frog = new Frog(this.row, this.col, this.type);
        frog.special = this.special;
        return frog;
    }
}
