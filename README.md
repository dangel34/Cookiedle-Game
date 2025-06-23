# Cookiedle 🍪

A Cookie Run Kingdom-themed guessing game inspired by popular games like Wordle, Loldle, and Pokedle. Guess the mystery cookie by analyzing their traits and receiving color-coded feedback!

## 🎮 Game Overview

Cookiedle is a daily puzzle game where players must guess a randomly selected Cookie Run Kingdom character. Each guess provides feedback on six different traits, helping you narrow down the correct cookie through strategic deduction.

## ✨ Features

- **Beautiful GUI Interface**: Modern, dark-themed interface with bold, readable text
- **Smart Auto-complete**: Type to see cookie name suggestions
- **Color-coded Feedback**: Visual feedback system with green (correct), orange (partial), and red (incorrect)
- **Animated Reveals**: Smooth animations when displaying guess results
- **Comprehensive Database**: 150+ cookies from Cookie Run Kingdom
- **Multiple Game Modes**: Play again or return to main menu after winning

## 🎯 How to Play

### Objective
Guess the mystery cookie in as few attempts as possible by analyzing the feedback from each guess.

### Gameplay
1. **Start the Game**: Click "Start Game" from the main menu
2. **Make a Guess**: Type a cookie name in the entry field
   - Use the auto-complete feature to see suggestions as you type
   - Press Enter or click "Submit" to make your guess
3. **Analyze Feedback**: Each guess shows feedback for six traits:
   - **Cookie Name**: Always displayed in white (for reference)
   - **Primary Color**: Green if correct, orange if it's the secondary color, red if wrong
   - **Secondary Color**: Green if correct, orange if it's the primary color, red if wrong
   - **Rarity**: Green if correct, red if wrong
   - **Type**: Green if correct, red if wrong
   - **Position**: Green if correct, red if wrong

### Color Code System
- 🟢 **Green**: Trait is correct
- 🟠 **Orange**: For colors only - the color exists but in the wrong position
- 🔴 **Red**: Trait is incorrect

### Winning
- Correctly guess the cookie name to win
- Your total number of guesses will be displayed
- Choose to play again or return to the main menu

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.7 or higher
- Required Python packages (see requirements below)

### Installation Steps
1. **Clone or download the project**
2. **Install required packages**:
   ```bash
   pip install pandas tkinter
   ```
3. **Run the game**:
   ```bash
   python main.py
   ```
   or
   ```bash
   python gui.py
   ```

### Required Files
- `main.py` - Main entry point
- `gui.py` - GUI implementation
- `cookies_rows.csv` - Cookie database
- `functions.py` - Game logic functions
- `scraper.py` - Data collection tool (optional)

## 📊 Cookie Database

The game includes 150+ cookies from Cookie Run Kingdom with the following attributes:

### Cookie Traits
- **Cookie Name**: The character's full name
- **Primary Color**: Main color theme
- **Secondary Color**: Secondary color theme
- **Rarity**: Common, Rare, Epic, Super Epic, Legendary, Ancient, Dragon, Beast, Special
- **Type**: Charge, Defense, Magic, Ranged, Ambush, Bomber, Support, Healing
- **Position**: Front, Middle, Rear
- **Skill Name**: Character's special ability
- **Skill Cooldown**: Cooldown time in seconds

### Rarity Tiers
- **Common**: Basic cookies (e.g., GingerBrave, Strawberry Cookie)
- **Rare**: Uncommon cookies (e.g., Adventurer Cookie, Carrot Cookie)
- **Epic**: Powerful cookies (e.g., Dark Choco Cookie, Latte Cookie)
- **Super Epic**: Very powerful cookies (e.g., Clotted Cream Cookie, Sherbet Cookie)
- **Legendary**: Extremely rare cookies (e.g., Sea Fairy Cookie, Frost Queen Cookie)
- **Ancient**: Mythical cookies (e.g., Pure Vanilla Cookie, Dark Cacao Cookie)
- **Dragon**: Dragon-themed cookies (e.g., Pitaya Dragon Cookie)
- **Beast**: Beast-themed cookies (e.g., Burning Spice Cookie)
- **Special**: Limited/crossover cookies (e.g., Sonic Cookie, Tails Cookie)

## 🎨 User Interface

### Main Screen
- Welcome message
- Start Game button
- Quit button

### Game Screen
- Game title
- Guess history with scrollable display
- Input field with auto-complete
- Submit button
- Back to Main button

### Victory Screen
- Congratulations message
- Final guess count
- Revealed cookie information
- Play Again button
- Main Menu button

## 🔧 Technical Details

### File Structure
```
Cookiedle/
├── main.py              # Main entry point
├── gui.py               # GUI implementation
├── functions.py         # Game logic and functions
├── scraper.py           # Data collection tool
├── cookies_rows.csv  # Cookie database
└── README.md           # This file
```

### Key Features
- **Tkinter GUI**: Cross-platform graphical interface
- **Pandas Integration**: Efficient data handling
- **Threading Support**: Smooth animations and responsiveness
- **Error Handling**: Robust error management
- **Accessibility**: Bold text and high contrast design

### Data Collection
The `scraper.py` file contains a web scraper that collects cookie data from the Noff GG site (credits to them). This tool can be used to update the database with new cookies.

## 🎯 Strategy Tips

1. **Start with Common Cookies**: Begin with well-known cookies to establish baseline traits
2. **Use Color Logic**: If a color appears orange, it exists in the other color slot
3. **Consider Rarity**: Use rarity to narrow down possibilities
4. **Position Matters**: Front/Middle/Rear positions can help eliminate many options
5. **Type Analysis**: Different types (Magic, Charge, etc.) have distinct characteristics

## 🐛 Troubleshooting

### Common Issues
- **"Cookie not found"**: Check spelling or use auto-complete suggestions
- **GUI not loading**: Ensure all required packages are installed
- **Data loading errors**: Verify `cookies_rows.csv` is in the same directory

### Performance
- The game runs smoothly on most systems
- Large guess histories are handled with scrollable display
- Animations are optimized for smooth performance

## 🤝 Contributing

Feel free to contribute to this project by:
- Adding new cookies to the database
- Improving the GUI design
- Adding new features
- Fixing bugs
- Improving documentation

## 📝 License

This project is created with love for educational and entertainment purposes.

---

**Made with Love** ❤️  
**For Rayn, From Derek** 🍪

*Enjoy playing Cookiedle!*
