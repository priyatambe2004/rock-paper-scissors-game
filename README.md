# Throwdown – Rock Paper Scissors

**Task 24 · Web Development Track ·**

An interactive Rock Paper Scissors game where players compete against the computer. The game uses JavaScript logic to determine the winner and keeps track of scores across multiple rounds.

## Objective

Practice conditional logic, random choice, and simple game state.

## Tools

- HTML5
- CSS3
- JavaScript (vanilla, no libraries)

## Project structure

```
rps-game/
├── index.html   # Page and game markup
├── style.css    # Design, animation, dark and light themes
├── script.js    # Game logic and state
└── README.md
```

## How to run

Keep the three files together and open `index.html` in a browser. No server is needed. Fonts load from Google Fonts and fall back to system fonts offline.

## Deliverables

| Deliverable | How it is done |
| --- | --- |
| Three choice buttons | Rock, Paper and Scissors buttons (also keys R, P, S) |
| Computer's random choice | `Math.random()` picks an index into the `CHOICES` array |
| Win/lose/draw logic | `getResult()` compares the two choices |
| Running score display | Scoreboard for You, Draws and Computer, plus round and streak |

## Hints from the task

- **Array and Math.random:** `CHOICES[Math.floor(Math.random() * CHOICES.length)]`.
- **Compare function:** `getResult(player, computer)` returns `'win'`, `'lose'` or `'draw'`.
- **Reset button:** "Reset score" restarts the match and clears the running score.

## Extra features

- Match lengths: Endless, Best of 3, 5 or 7, with a winner banner and "New match".
- Adaptive computer mode that sometimes counters your most-used move.
- Shake countdown animation before each reveal (buttons pause during it).
- Win streak, round counter and a history of the last 8 rounds.
- All-time wins, losses, draws and best streak, saved in the browser's localStorage.
- Keyboard shortcuts and screen-reader announcements of each result.
- Dark and light theme toggle, responsive layout, reduced-motion support.

## Interview questions

**How would you determine the winner between two choices?**
Store what each move beats in an object: `{ rock: 'scissors', paper: 'rock', scissors: 'paper' }`. If both choices match it is a draw. Otherwise the player wins when `BEATS[player] === computer`, and loses in every other case. This replaces nine if/else branches with a single lookup.

**How would you make the computer's choice random?**
Use `Math.floor(Math.random() * 3)` to get an index from 0 to 2, then read that index from the choices array. `Math.random()` returns a number from 0 up to, but not including, 1, so the result is always a valid index.

**How would you handle a tie?**
Check for equal choices first and return `'draw'`. A draw adds no point for either side, does not break your win streak, and does not count toward a best-of match total. This game tracks draws separately.

## 👩‍💻 Author

Priya Tambe
