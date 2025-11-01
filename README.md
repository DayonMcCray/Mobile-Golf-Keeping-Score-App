# Golf Scorecard Pro

A mobile-first web app for tracking golf scores during your round.

## Features

- 1-4 players with real-time leaderboard
- 9 or 18 hole rounds
- Per-hole score entry with auto-calculated totals
- Undo last entry & full reset
- localStorage persistence (scores survive refresh)
- Prevents screen sleep during rounds
- Mobile-optimized numeric keyboard

## Live Demo

**Deployed App:** `[INSERT YOUR URL HERE]`  

## Run Locally
```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Tech Stack

React 18 • Vite • Lucide React • localStorage API • Wake Lock API

## Known Issues

- Wake Lock only works on HTTPS (works on localhost & deployed sites)
- No score history - only current game saved
- Wake Lock unsupported in older browsers (app still functions)

## Future Work

- Par tracking with over/under scores
- Handicap calculations
- Score history for multiple rounds
- Export as PDF/image
- Player profiles and statistics

## AI-Assisted Development

Built with assistance from Claude AI (Anthropic). AI generated the complete React component, implemented localStorage persistence, and created responsive styling. Human contributions included testing, verification, environment setup, and demo recording.

See `ai-notes.md` for detailed documentation of prompts, outputs, and verification process.

## Author

**[YOUR NAME]**  
[YOUR GITHUB PROFILE] ddm5544@psu.edu