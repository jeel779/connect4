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

const rooms = new Map();
const TURN_TIME_LIMIT = 30000; 


class Connect4Game {
  constructor() {
    this.board = Array(6).fill(null).map(() => Array(7).fill(0));
    this.currentPlayer = 1; 
    this.winner = null;
    this.gameOver = false;
  }

  makeMove(column) {
    if (this.gameOver || this.winner) return null;

    for (let row = 5; row >= 0; row--) {
      if (this.board[row][column] === 0) {
        this.board[row][column] = this.currentPlayer;

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
    return null;
  }

  checkWin(row, col) {
    const player = this.board[row][col];
    const directions = [
      [[0, 1], [0, -1]],
      [[1, 0], [-1, 0]], 
      [[1, 1], [-1, -1]], 
      [[1, -1], [-1, 1]] 
    ];

    for (const [forward, backward] of directions) {
      let count = 1;

      let r = row + forward[0];
      let c = col + forward[1];
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === player) {
        count++;
        r += forward[0];
        c += forward[1];
      }

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
      turnStartTime: null,
      pendingInvite: null
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

    startTurnTimer(roomId);
    console.log(`Player ${playerName} joined room: ${roomId}`);
  });

  socket.on('makeMove', ({ roomId, column }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    if (room.game.currentPlayer !== player.playerNumber) {
      socket.emit('moveError', { message: 'Not your turn' });
      return;
    }

    const moveResult = room.game.makeMove(column);
    if (!moveResult) {
      socket.emit('moveError', { message: 'Invalid move' });
      return;
    }

    if (room.turnTimer) {
      clearTimeout(room.turnTimer);
      room.turnTimer = null;
    }

    io.to(roomId).emit('moveMade', {
      board: room.game.board,
      currentPlayer: room.game.currentPlayer,
      winner: room.game.winner,
      gameOver: room.game.gameOver,
      lastMove: moveResult
    });

    if (room.game.gameOver) {
      if (room.turnTimer) {
        clearTimeout(room.turnTimer);
        room.turnTimer = null;
      }
      room.pendingInvite = null;
    } else {
      startTurnTimer(roomId);
    }
  });

  socket.on('sendPlayAgainInvite', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    if (!room.game.gameOver) {
      socket.emit('inviteError', { message: 'Game is not over yet' });
      return;
    }

    room.pendingInvite = player.playerNumber;

    const opponent = room.players.find(p => p.id !== socket.id);
    if (opponent) {
      io.to(opponent.id).emit('playAgainInviteReceived', {
        fromPlayer: player.name || `Player ${player.playerNumber}`
      });
    }

    socket.emit('playAgainInviteSent');
  });

  socket.on('acceptPlayAgainInvite', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    if (!room.pendingInvite) {
      socket.emit('inviteError', { message: 'No pending invite' });
      return;
    }

    if (room.pendingInvite === player.playerNumber) {
      socket.emit('inviteError', { message: 'Cannot accept your own invite' });
      return;
    }

    room.pendingInvite = null;

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

    startTurnTimer(roomId);
  });

  socket.on('declinePlayAgainInvite', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    if (room.pendingInvite) {
      const inviter = room.players.find(p => p.playerNumber === room.pendingInvite);
      if (inviter) {
        io.to(inviter.id).emit('playAgainInviteDeclined', {
          fromPlayer: player.name || `Player ${player.playerNumber}`
        });
      }
      room.pendingInvite = null;
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

    startTurnTimer(roomId);
  });

  socket.on('leaveRoom', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const playerIndex = room.players.findIndex(p => p.id === socket.id);
    if (playerIndex !== -1) {
      socket.to(roomId).emit('playerLeft', {
        playerNumber: room.players[playerIndex].playerNumber
      });

      if (room.turnTimer) {
        clearTimeout(room.turnTimer);
      }

      room.players.splice(playerIndex, 1);

      if (room.players.length === 0) {
        rooms.delete(roomId);
      }

      socket.leave(roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

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
    room.game.gameOver = true;
    room.game.winner = room.game.currentPlayer === 1 ? 2 : 1;

    io.to(roomId).emit('timeUp', {
      winner: room.game.winner,
      gameOver: true,
      board: room.game.board
    });

    room.turnTimer = null;
    room.pendingInvite = null;
  }, TURN_TIME_LIMIT);


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

