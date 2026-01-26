const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Game state storage
const rooms = new Map();
const TURN_TIME_LIMIT = 30000; // 30 seconds per turn

// Connect 4 game logic
class Connect4Game {
  constructor() {
    this.board = Array(6).fill(null).map(() => Array(7).fill(0));
    this.currentPlayer = 1; // 1 or 2
    this.winner = null;
    this.gameOver = false;
  }

  makeMove(column) {
    if (this.gameOver || this.winner) return null;

    // Find the lowest empty row in the column
    for (let row = 5; row >= 0; row--) {
      if (this.board[row][column] === 0) {
        this.board[row][column] = this.currentPlayer;

        // Check for win
        if (this.checkWin(row, column)) {
          this.winner = this.currentPlayer;
          this.gameOver = true;
        } else if (this.isBoardFull()) {
          this.gameOver = true;
        } else {
          this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        }

        return { row, column };
      }
    }
    return null; // Column is full
  }

  checkWin(row, col) {
    const player = this.board[row][col];
    const directions = [
      [[0, 1], [0, -1]], // horizontal
      [[1, 0], [-1, 0]], // vertical
      [[1, 1], [-1, -1]], // diagonal /
      [[1, -1], [-1, 1]] // diagonal \
    ];

    for (const [forward, backward] of directions) {
      let count = 1; // Count the current piece

      // Check forward direction
      let r = row + forward[0];
      let c = col + forward[1];
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === player) {
        count++;
        r += forward[0];
        c += forward[1];
      }

      // Check backward direction
      r = row + backward[0];
      c = col + backward[1];
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === player) {
        count++;
        r += backward[0];
        c += backward[1];
      }

      if (count >= 4) return true;
    }

    return false;
  }

  isBoardFull() {
    return this.board[0].every(cell => cell !== 0);
  }

  reset() {
    this.board = Array(6).fill(null).map(() => Array(7).fill(0));
    this.currentPlayer = 1;
    this.winner = null;
    this.gameOver = false;
  }
}

// Generate unique room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', (playerName) => {
    const roomId = generateRoomId();
    const game = new Connect4Game();

    rooms.set(roomId, {
      id: roomId,
      players: [{ id: socket.id, name: playerName, playerNumber: 1 }],
      game: game,
      turnTimer: null,
      turnStartTime: null
    });

    socket.join(roomId);
    socket.emit('roomCreated', { roomId, playerNumber: 1 });
    console.log(`Room created: ${roomId} by ${playerName}`);
  });

  socket.on('joinRoom', ({ roomId, playerName }) => {
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('joinError', { message: 'Room not found' });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('joinError', { message: 'Room is full' });
      return;
    }

    room.players.push({ id: socket.id, name: playerName, playerNumber: 2 });
    socket.join(roomId);

    socket.emit('roomJoined', { roomId, playerNumber: 2 });
    io.to(roomId).emit('playerJoined', {
      players: room.players,
      gameState: {
        board: room.game.board,
        currentPlayer: room.game.currentPlayer,
        winner: room.game.winner,
        gameOver: room.game.gameOver
      }
    });

    // Start the game and timer
    startTurnTimer(roomId);
    console.log(`Player ${playerName} joined room: ${roomId}`);
  });

  socket.on('makeMove', ({ roomId, column }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    // Check if it's the player's turn
    if (room.game.currentPlayer !== player.playerNumber) {
      socket.emit('moveError', { message: 'Not your turn' });
      return;
    }

    // Make the move
    const moveResult = room.game.makeMove(column);
    if (!moveResult) {
      socket.emit('moveError', { message: 'Invalid move' });
      return;
    }

    // Clear the timer
    if (room.turnTimer) {
      clearTimeout(room.turnTimer);
      room.turnTimer = null;
    }

    // Broadcast the move
    io.to(roomId).emit('moveMade', {
      board: room.game.board,
      currentPlayer: room.game.currentPlayer,
      winner: room.game.winner,
      gameOver: room.game.gameOver,
      lastMove: moveResult
    });

    // If game is over, clear timer
    if (room.game.gameOver) {
      if (room.turnTimer) {
        clearTimeout(room.turnTimer);
        room.turnTimer = null;
      }
    } else {
      // Start timer for next player
      startTurnTimer(roomId);
    }
  });

  socket.on('restartGame', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    if (room.turnTimer) {
      clearTimeout(room.turnTimer);
      room.turnTimer = null;
    }

    room.game.reset();
    io.to(roomId).emit('gameRestarted', {
      board: room.game.board,
      currentPlayer: room.game.currentPlayer,
      winner: null,
      gameOver: false
    });

    // Start timer for player 1
    startTurnTimer(roomId);
  });

  socket.on('leaveRoom', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const playerIndex = room.players.findIndex(p => p.id === socket.id);
    if (playerIndex !== -1) {
      // Notify other players
      socket.to(roomId).emit('playerLeft', {
        playerNumber: room.players[playerIndex].playerNumber
      });

      // Clear timer if exists
      if (room.turnTimer) {
        clearTimeout(room.turnTimer);
      }

      // Remove player from room
      room.players.splice(playerIndex, 1);

      // If no players left, delete room
      if (room.players.length === 0) {
        rooms.delete(roomId);
      }

      socket.leave(roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Find and remove player from rooms
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        if (room.turnTimer) {
          clearTimeout(room.turnTimer);
        }

        io.to(roomId).emit('playerLeft', { playerNumber: room.players[playerIndex].playerNumber });
        rooms.delete(roomId);
        break;
      }
    }
  });
});

function startTurnTimer(roomId) {
  const room = rooms.get(roomId);
  if (!room || room.game.gameOver) return;

  if (room.turnTimer) {
    clearTimeout(room.turnTimer);
  }

  room.turnStartTime = Date.now();

  room.turnTimer = setTimeout(() => {
    // Time's up! Current player loses
    room.game.gameOver = true;
    room.game.winner = room.game.currentPlayer === 1 ? 2 : 1;

    io.to(roomId).emit('timeUp', {
      winner: room.game.winner,
      gameOver: true,
      board: room.game.board
    });

    room.turnTimer = null;
  }, TURN_TIME_LIMIT);

  // Notify clients about the timer start
  io.to(roomId).emit('turnStarted', {
    currentPlayer: room.game.currentPlayer,
    timeLimit: TURN_TIME_LIMIT,
    startTime: room.turnStartTime
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

