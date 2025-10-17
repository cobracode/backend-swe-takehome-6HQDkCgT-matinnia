# Nader's Backend SWE Take-Home Assignment - TypeScript

## Overview

This is a **3-4 hour take-home assignment**. You will build a small, network-accessible backend web service that manages a turn-based, grid-driven game from pre-defined rules. Your assignment is tailored: a randomized (but reproducible) set of TODOs, features, and bugs has been embedded inline.

You should focus on:
- Clear, maintainable API handlers and service logic
- Robust input validation and error handling
- Simple, reliable tests (unit and integration)
- Helpful logs/metrics stubs where applicable

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm ci
```

### Running the Application

```bash
npm run build
npm run dev
```

The application will start on port 3000.

### Running Tests

```bash
npm test
```

### Running the Simulation

```bash
npm run simulation
```

You may run into rate limiting. The default window is 60 seconds, and 100 requests in that timeframe.

You can change these with the environment variables in an .env file or on the terminal:

```
RATE_LIMIT_WINDOW_MS: max requests window
RATE_LIMIT_MAX: max number of requests
```

## Project Structure

```
src/
├── models/
├── services/
├── routes/
├── middleware/
└── index.ts
```

## AI Use

A note on AI usage in this assignment: I use Cursor as my IDE, and at times asked it questions of the codebase to accelerate my debugging and problem-solving.
Some of its suggestions have been better- or best-practices, in terms of game architecture. For example, pulling out the `app.listen()` from the App declaration
in `index.ts` into its own `server.ts` file, makes for cleaner integration testing and separation of concerns.

It also suggested pulling in the `express-rate-limit` library to quickly handle that in a standardized way.

Quickly building out unit tests is another way it accelerated my work.


## What's Been Implemented

### Selected Tasks

#### TODOs
- [x] Expand TypeScript tests for win/draw and routes
- [x] Standardize service error handling and messages
- [x] Harden route validation for IDs and payloads
- [x] Add API integration tests for core endpoints
- [x] Extend leaderboard endpoints (pagination, filters)
- [x] Implement PlayerService (create/get/update/delete/search/stats)
- [x] Complete games routes (status, join, moves, stats, delete, list)
- [x] Add player email validation
- [x] Add unit tests for GameModel and PlayerModel

#### Feature Requests
- [x] Add basic rate limiting middleware

#### Bugs To Fix
- [x] Move bounds check off-by-one allows row&#x3D;3 or col&#x3D;3 (symptom: )

### Core Requirements (high-level)

1. Turn-based rules on a finite grid with obvious invalid-move conditions
2. Multiple sessions can run concurrently; two players start a session
3. End a session on win or draw; expose session status
4. Leaderboard endpoint returning top users by wins or "efficiency" (lower moves per win is better)
5. A small simulation or test path that exercises the API

Additionally, look for inline TODOs in language-appropriate files. Examples:
- TypeScript: `src/routes/*`, `src/services/*`, `src/models/*`, `src/index.ts`

> Focus on correctness, quality, and clarity. If you finish early, feel free to polish or extend.

## Notes

- Inline TODOs are your primary guide. GitHub Issues are intentionally disabled.
- Keep commits small and frequent with clear messages.
- You may add libraries if they help you implement tasks cleanly.

## Quick API Examples

Assuming your server is running on http://localhost:3000

Create a game
```bash
curl -s -X POST http://localhost:3000/games -H 'Content-Type: application/json' -d '{"name":"Sample"}' | jq .
```

Join the game
```bash
GAME_ID=<paste-from-create>
curl -s -X POST http://localhost:3000/games/$GAME_ID/join -H 'Content-Type: application/json' -d '{"playerId":"player-1"}' | jq .
curl -s -X POST http://localhost:3000/games/$GAME_ID/join -H 'Content-Type: application/json' -d '{"playerId":"player-2"}' | jq .
```

Make a move and get status
```bash
curl -s -X POST http://localhost:3000/games/$GAME_ID/moves -H 'Content-Type: application/json' -d '{"playerId":"player-1","row":0,"col":0}' | jq .
curl -s http://localhost:3000/games/$GAME_ID/status | jq .
```

Leaderboard (optional)
```bash
curl -s http://localhost:3000/leaderboard | jq .
```

## Submission

1. Ensure tests pass
2. Run the simulation script
3. Update this README with any setup notes
4. Submit your repository URL

Good luck! 🚀
