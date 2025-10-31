# 🐸 Frog Match - Game Plan

A mobile-friendly match-3 puzzle game featuring adorable frogs, perfect for ages 8+!

## 🎮 Game Overview

**Genre**: Match-3 Puzzle (Fishdom-style)
**Target Audience**: Kids 8+ and casual gamers
**Platform**: Web (GitHub Pages), Mobile-optimized
**Theme**: Cute frogs in a pond environment

## 🎯 Core Features

### Match-3 Mechanics
- **Grid Size**: 8x8 board
- **Frog Types**: 6 different colored frogs (Green, Blue, Red, Yellow, Purple, Orange)
- **Controls**:
  - Desktop: Click and drag to swap
  - Mobile: Touch and swipe to swap
- **Matching**: Match 3+ frogs of the same color horizontally or vertically
- **Cascade**: Frogs fall down with gravity after matches

### Special Frogs & Power-ups
1. **Striped Frog** (Match 4)
   - Clears entire row OR column when matched
   - Direction depends on match orientation

2. **Rainbow Frog** (Match 5)
   - Clears all frogs of one color when matched
   - Can be swapped with any adjacent frog

3. **Bomb Frog** (L or T-shaped Match)
   - Clears 3x3 area around it when matched

### Level System
- **Multiple Levels**: Start with 10 levels, expandable
- **Move Limits**: Each level has a set number of moves
- **Objectives**: Vary by level, examples:
  - Collect X frogs of specific colors
  - Reach a target score
  - Clear frosted tiles
  - Bring lily pads to the bottom
- **Star Rating**: 1-3 stars based on score
  - 1 star: Meet objective
  - 2 stars: Score threshold 1
  - 3 stars: Score threshold 2

### Progression & Scoring
- **Score**: Points for each match (base points × combo multiplier)
- **Combos**: Cascading matches increase multiplier
- **Level Select**: Map-style progression (unlock next level on completion)
- **Local Storage**: Save progress in browser

## 🎨 Visual Design

### Art Style
- Cute, cartoon-style frogs
- Bright, colorful palette appropriate for kids
- Simple CSS-based graphics with emoji fallback (🐸)
- Smooth animations for swaps, matches, and cascades

### UI Screens
1. **Start Screen**: Title, Play button, Settings
2. **Level Select**: Grid of level bubbles showing stars earned
3. **Game Screen**:
   - Game board
   - Moves remaining counter
   - Current score
   - Objective progress
   - Pause button
4. **Victory Screen**: Stars earned, score, next level button
5. **Game Over Screen**: Retry, level select buttons
6. **Settings**: Sound toggle, how to play

### Animations
- Frog hop on match
- Splash effect when cleared
- Gentle bounce when frogs land
- Particle effects for special matches
- Star pop-in for victory screen

## 🔊 Audio (Optional/Toggleable)
- **SFX**:
  - Ribbit on match
  - Splash on clear
  - Pop for cascades
  - Special sound for power-ups
- **Music**: Light, playful background music (looping)
- **Mute Toggle**: Easy to turn off

## 🛠️ Technical Architecture

### Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **No Dependencies**: Keep it lightweight and fast
- **Canvas API**: For smooth rendering and animations
- **Local Storage**: For save data and settings
- **Service Worker**: For offline play (PWA-ready)

### File Structure
```
frog-match/
├── index.html              # Entry point
├── css/
│   ├── styles.css          # Main styles
│   └── animations.css      # Animation definitions
├── js/
│   ├── main.js             # Game initialization
│   ├── game.js             # Core game logic
│   ├── board.js            # Board management
│   ├── frog.js             # Frog class and types
│   ├── matcher.js          # Match detection logic
│   ├── levels.js           # Level definitions
│   ├── ui.js               # UI management
│   ├── audio.js            # Sound manager
│   └── storage.js          # Save/load functionality
├── assets/
│   ├── images/             # Frog sprites, backgrounds
│   ├── sounds/             # SFX and music
│   └── fonts/              # Custom fonts
├── levels/
│   └── level-data.json     # Level configurations
└── README.md
```

### Key Classes & Components

#### 1. Game Manager (`game.js`)
- Orchestrates game flow
- Handles game states (IDLE, PLAYING, ANIMATING, GAME_OVER, VICTORY)
- Move counter management
- Score tracking

#### 2. Board (`board.js`)
- 8x8 grid management
- Frog placement and swapping
- Gravity/cascade logic
- Initial board generation (no matches)

#### 3. Frog (`frog.js`)
- Frog types and colors
- Special frog behaviors
- Rendering

#### 4. Matcher (`matcher.js`)
- Match detection algorithms
- Special match patterns (4, 5, L, T)
- Combo calculation

#### 5. Level Manager (`levels.js`)
- Level data structure
- Objective tracking
- Star calculation
- Level progression

#### 6. UI Manager (`ui.js`)
- Screen transitions
- HUD updates
- Modal dialogs

#### 7. Audio Manager (`audio.js`)
- Sound effect playback
- Music control
- Mute state

#### 8. Storage Manager (`storage.js`)
- Save/load game progress
- Settings persistence

## 📱 Mobile Optimization

### Responsive Design
- Viewport meta tags for proper scaling
- Touch-optimized hit areas (minimum 44×44px)
- Landscape and portrait support
- Flexible grid sizing based on screen size

### Performance
- RequestAnimationFrame for smooth animations
- Object pooling for frogs to reduce GC
- Efficient canvas rendering
- Lazy loading of assets

### Touch Controls
- Swipe gestures for swapping
- Prevent accidental scrolling during gameplay
- Visual feedback for touches

## 🎮 Game Loop

```
1. Player swaps two frogs
2. Check if swap creates a match
   - If yes: proceed
   - If no: swap back with animation
3. Remove matched frogs (with animation)
4. Award points and update objectives
5. Create special frogs if applicable
6. Apply gravity (frogs fall down)
7. Fill empty spaces with new frogs
8. Check for cascade matches (repeat from step 3)
9. Check for game end conditions:
   - Objective met: VICTORY
   - No moves left: GAME OVER
   - No moves available: GAME OVER
10. If game continues, wait for next player move
```

## 📊 Level Design Philosophy

### Difficulty Curve
- **Levels 1-3**: Tutorial levels, simple objectives, plenty of moves
- **Levels 4-6**: Introduce obstacles, tighter move limits
- **Levels 7-10**: Multiple objectives, strategic planning needed
- **Future levels**: New mechanics (ice blocks, locked frogs, etc.)

### Example Levels

**Level 1**: "Lily Pond Basics"
- Objective: Score 1000 points
- Moves: 20
- Special: None
- 1⭐: 1000, 2⭐: 1500, 3⭐: 2000

**Level 2**: "Green Frog Gathering"
- Objective: Collect 15 green frogs
- Moves: 18
- Special: None
- Stars based on score

**Level 5**: "Rainbow Challenge"
- Objective: Create 2 rainbow frogs
- Moves: 25
- Special: Encouraged use of 5-matches

## 🚀 Development Phases

### Phase 1: Core Gameplay (MVP)
- Basic 8x8 grid rendering
- Frog swapping mechanics
- Match-3 detection and removal
- Gravity and cascading
- Simple scoring

### Phase 2: Special Frogs
- Striped frog (4-match)
- Rainbow frog (5-match)
- Bomb frog (L/T match)
- Power-up activation logic

### Phase 3: Level System
- Level data structure
- Objectives system
- Move counter
- Win/lose conditions
- Star rating

### Phase 4: UI/UX
- All game screens
- Level select map
- Victory/game over modals
- Settings panel
- Animations and polish

### Phase 5: Audio
- Sound effect integration
- Background music
- Audio settings

### Phase 6: Content & Polish
- Create 10 initial levels
- Balance difficulty
- Mobile testing
- Performance optimization
- GitHub Pages deployment

## 🎯 Success Criteria

- ✅ Runs smoothly on mobile devices (60 fps)
- ✅ Touch controls feel responsive
- ✅ Game is fun and understandable for 8-year-olds
- ✅ Clear visual feedback for all actions
- ✅ Progress saves reliably
- ✅ No bugs in core game loop
- ✅ Appealing visual design
- ✅ At least 10 fun, varied levels

## 🔮 Future Enhancements

- More frog types and power-ups
- New obstacles (ice, chains, rocks)
- Daily challenges
- Leaderboards
- More levels (50+)
- Frog collection/customization
- Power-up shop
- Social sharing
- Achievements system

---

**Let's make the most ribbiting match-3 game ever!** 🐸✨
