# Connect 4 Online

An online multiplayer Connect 4 game built with React, Socket.IO, and Node.js. Features real-time gameplay, room-based matchmaking, and turn timers.

## Features

- 🎮 Real-time multiplayer gameplay
- 🏠 Create and join rooms with unique IDs
- ⏱️ Turn timer (30 seconds per turn)
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔄 Auto-win on timeout
- 🎯 Win detection for Connect 4

## Installation

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
cd ..
```

## Running the Application

### Development Mode

Run both server and client concurrently:
```bash
npm run dev
```

Or run them separately:

**Terminal 1 (Server):**
```bash
npm run server
```

**Terminal 2 (Client):**
```bash
npm run client
```

The server will run on `http://localhost:3000` and the client on `http://localhost:5173`.

## How to Play

1. Enter your name
2. **Create a Room**: Click "Create Room" to start a new game
3. **Join a Room**: Share your Room ID with a friend, they can enter it to join
4. Players take turns dropping pieces (red for Player 1, yellow for Player 2)
5. Each player has 30 seconds per turn - if time runs out, they lose!
6. First to get 4 in a row (horizontal, vertical, or diagonal) wins!

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Real-time Communication**: Socket.IO

## Project Structure

```
connect4/
├── server/
│   └── index.js          # Socket.IO server and game logic
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameBoard.jsx
│   │   │   └── Lobby.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── package.json
```

