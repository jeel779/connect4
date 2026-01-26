import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import GameBoard from './components/GameBoard'
import Lobby from './components/Lobby'
import './App.css'

const socket = io('http://localhost:3000')

function App() {
  const [gameState, setGameState] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [playerNumber, setPlayerNumber] = useState(null)
  const [players, setPlayers] = useState([])
  const [playerName, setPlayerName] = useState('')
  const [showLobby, setShowLobby] = useState(true)
  const [timer, setTimer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  useEffect(() => {
    socket.on('roomCreated', ({ roomId, playerNumber }) => {
      setRoomId(roomId)
      setPlayerNumber(playerNumber)
      setShowLobby(false)
    })

    socket.on('roomJoined', ({ roomId, playerNumber }) => {
      setRoomId(roomId)
      setPlayerNumber(playerNumber)
      setShowLobby(false)
    })

    socket.on('joinError', ({ message }) => {
      alert(message)
    })

    socket.on('playerJoined', ({ players, gameState }) => {
      setPlayers(players)
      setGameState(gameState)
    })

    socket.on('moveMade', (newGameState) => {
      setGameState(newGameState)
    })

    socket.on('turnStarted', ({ currentPlayer, timeLimit, startTime }) => {
      setTimer({ timeLimit, startTime })
    })

    socket.on('timeUp', (newGameState) => {
      setGameState(newGameState)
      setTimer(null)
      alert(`Time's up! Player ${newGameState.winner} wins!`)
    })

    socket.on('gameRestarted', (newGameState) => {
      setGameState(newGameState)
      setTimer(null)
    })

    socket.on('playerLeft', () => {
      alert('Opponent left the game')
      setGameState(null)
      setRoomId(null)
      setPlayerNumber(null)
      setPlayers([])
      setShowLobby(true)
    })

    return () => {
      socket.off('roomCreated')
      socket.off('roomJoined')
      socket.off('joinError')
      socket.off('playerJoined')
      socket.off('moveMade')
      socket.off('turnStarted')
      socket.off('timeUp')
      socket.off('gameRestarted')
      socket.off('playerLeft')
    }
  }, [])

  useEffect(() => {
    if (timer) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - timer.startTime
        const remaining = Math.max(0, timer.timeLimit - elapsed)
        setTimeLeft(Math.ceil(remaining / 1000))
        
        if (remaining <= 0) {
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [timer])

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert('Please enter your name')
      return
    }
    socket.emit('createRoom', playerName)
  }

  const handleJoinRoom = (roomIdToJoin) => {
    if (!playerName.trim()) {
      alert('Please enter your name')
      return
    }
    socket.emit('joinRoom', { roomId: roomIdToJoin, playerName })
  }

  const handleMakeMove = (column) => {
    if (gameState?.currentPlayer === playerNumber && !gameState?.gameOver) {
      socket.emit('makeMove', { roomId, column })
    }
  }

  const handleRestart = () => {
    socket.emit('restartGame', { roomId })
  }

  const handleLeaveRoom = () => {
    if (roomId) {
      socket.emit('leaveRoom', { roomId })
      setGameState(null)
      setRoomId(null)
      setPlayerNumber(null)
      setPlayers([])
      setShowLobby(true)
      setTimer(null)
    }
  }

  if (showLobby) {
    return (
      <>
        <Lobby
          playerName={playerName}
          setPlayerName={setPlayerName}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <GameBoard
        gameState={gameState}
        playerNumber={playerNumber}
        players={players}
        roomId={roomId}
        timeLeft={timeLeft}
        onMakeMove={handleMakeMove}
        onRestart={handleRestart}
        onLeaveRoom={handleLeaveRoom}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </div>
  )
}

export default App

