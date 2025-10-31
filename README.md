# 🐸 Frog Match

A delightful match-3 puzzle game featuring adorable frogs! Perfect for kids ages 8+ and casual gamers of all ages.

![Frog Match](https://img.shields.io/badge/Game-Frog%20Match-brightgreen) ![Version](https://img.shields.io/badge/version-1.0.0-blue) ![Mobile](https://img.shields.io/badge/mobile-friendly-success)

## 🎮 Play Now

Play the game at: [GitHub Pages URL will be here]

## ✨ Features

### Core Gameplay
- **Match-3 Mechanics**: Swap adjacent frogs to create matches of 3 or more
- **6 Colorful Frogs**: Green, Blue, Red, Yellow, Purple, and Orange frogs
- **8×8 Grid**: Classic match-3 board size optimized for mobile
- **Smooth Animations**: Satisfying cascading effects and transitions

### Special Power-Ups
- 🟢🟢🟢🟢 **Striped Frog** (Match 4): Clears entire row or column
- 🔵🔵🔵🔵🔵 **Rainbow Frog** (Match 5): Clears all frogs of one color
- 💣 **Bomb Frog** (L or T-shape): Explodes in a 3×3 area

### 10 Exciting Levels
- Progressive difficulty curve
- Multiple objective types: score targets, collection goals, special frog challenges
- Move limits add strategic depth
- 3-star rating system

### Mobile-Optimized
- Responsive design works on any screen size
- Touch and swipe controls
- Prevents accidental scrolling and zooming
- Smooth 60fps animations

### Progress Tracking
- Auto-save progress in browser
- Star ratings saved per level
- Track high scores
- Unlock levels progressively

### Audio (Optional)
- Sound effects using Web Audio API
- Background music support (can be toggled)
- **Sound off by default** for kid-friendly experience

## 🎯 How to Play

1. **Swap Frogs**: Tap and drag to swap adjacent frogs
2. **Make Matches**: Line up 3 or more frogs of the same color
3. **Create Combos**: Cascading matches increase your score multiplier
4. **Complete Objectives**: Each level has specific goals to achieve
5. **Earn Stars**: Score higher for more stars (up to 3 per level)
6. **Use Strategy**: Plan your moves carefully - you have a limited number!

### Special Frog Combos

| Match | Result | Effect |
|-------|--------|--------|
| Match 4 in a row | Striped Frog ➡️⬇️ | Clears entire row or column |
| Match 5 in a row | Rainbow Frog 🌈 | Clears all frogs of one color |
| L or T shape | Bomb Frog 💣 | 3×3 explosion |

## 🛠️ Tech Stack

- **Pure HTML5, CSS3, JavaScript (ES6+)**
- No frameworks or dependencies
- Canvas API for rendering
- LocalStorage for save data
- Web Audio API for sound
- Mobile-first responsive design

## 📁 Project Structure

```
frog-match/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Main styles
│   └── animations.css      # Animation definitions
├── js/
│   ├── main.js             # Game initialization
│   ├── game.js             # Core game loop and state
│   ├── board.js            # Board management
│   ├── frog.js             # Frog class and types
│   ├── matcher.js          # Match detection logic
│   ├── levels.js           # Level definitions
│   ├── ui.js               # UI management
│   ├── audio.js            # Sound manager
│   └── storage.js          # Save/load functionality
├── assets/
│   └── sounds/             # Sound files
├── GAME_PLAN.md            # Detailed game design document
└── README.md               # This file
```

## 🚀 Local Development

1. Clone the repository:
```bash
git clone https://github.com/jedi-diah418/frog-match.git
cd frog-match
```

2. Open in your browser:
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx serve

# Then open http://localhost:8000
```

3. Or simply open `index.html` directly in your browser!

## 🎨 Customization

### Adding New Levels

Edit `js/levels.js` and add new level definitions:

```javascript
new Level(11, {
    moves: 25,
    objectives: [
        { type: ObjectiveType.SCORE, target: 4000 }
    ],
    stars: { one: 4000, two: 5000, three: 6500 },
    description: "Your Level Name"
})
```

### Changing Frog Types

Edit `js/frog.js` to add or modify frog types:

```javascript
export const FrogType = {
    GREEN: { id: 0, emoji: '🟢', color: '#48bb78', name: 'green' },
    // Add more types...
};
```

### Adjusting Difficulty

Modify board size in `js/game.js`:
```javascript
this.board = new Board(8); // Change 8 to your desired size
```

## 🎯 Game Objectives

Levels can have multiple objective types:

- **SCORE**: Reach a target score
- **COLLECT**: Collect X number of specific colored frogs
- **CLEAR_SPECIAL**: Create and clear X special frogs

## 🏆 Scoring System

- **Base Match**: 10 points per frog
- **Combo Multiplier**: Each cascade increases the multiplier
- **Special Frogs**: 15 points per frog cleared
- **Stars**: Based on score thresholds defined per level

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & iOS)
- ✅ Opera
- ⚠️ Requires JavaScript enabled
- ⚠️ Requires localStorage for save data

## 🐛 Known Issues

None currently! If you find a bug, please report it.

## 🔮 Future Enhancements

- [ ] More levels (50+)
- [ ] New obstacles (ice blocks, locked frogs, chains)
- [ ] Daily challenges
- [ ] Achievement system
- [ ] Social sharing
- [ ] Leaderboards
- [ ] More frog types
- [ ] Power-up shop
- [ ] Different game modes

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

Built with 💚 by the Frog Match Team

## 🙏 Acknowledgments

- Inspired by classic match-3 games like Fishdom
- Emoji graphics from Unicode standard
- Built for fun and learning!

---

**Have fun matching those froggies! 🐸✨**