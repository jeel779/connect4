import { useState, useEffect } from 'react'

function GameBoard({ gameState, playerNumber, players, roomId, timeLeft, onMakeMove, onRestart, onLeaveRoom, darkMode, toggleDarkMode }) {
  const [hoveredColumn, setHoveredColumn] = useState(null)

  if (!gameState) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center w-full max-w-md relative">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-2">Waiting for opponent to join...</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Room ID: <span className="font-mono font-semibold text-gray-900 dark:text-white">{roomId}</span></p>
        <button
          onClick={onLeaveRoom}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          Leave Room
        </button>
      </div>
    )
  }

  const currentPlayerName = players.find(p => p.playerNumber === gameState.currentPlayer)?.name || `Player ${gameState.currentPlayer}`
  const isYourTurn = gameState.currentPlayer === playerNumber && !gameState.gameOver
  const yourPlayerName = players.find(p => p.playerNumber === playerNumber)?.name || `Player ${playerNumber}`
  const opponentPlayerName = players.find(p => p.playerNumber !== playerNumber)?.name || `Player ${playerNumber === 1 ? 2 : 1}`

  const getCellColor = (cell) => {
    if (cell === 1) return 'bg-red-500'
    if (cell === 2) return 'bg-yellow-400'
    return 'bg-white'
  }

  const handleColumnClick = (column) => {
    if (isYourTurn && !gameState.gameOver) {
      onMakeMove(column)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 w-full max-w-2xl relative">
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Room: <span className="font-mono text-gray-700 dark:text-gray-300">{roomId}</span></h2>
              <button
                onClick={onLeaveRoom}
                className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                Exit
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You: <span className="font-medium text-gray-700 dark:text-gray-300">{yourPlayerName}</span>
            </p>
          </div>
          {gameState.gameOver && (
            <button
              onClick={onRestart}
              className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              Play Again
            </button>
          )}
        </div>

        {/* Timer */}
        {!gameState.gameOver && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {isYourTurn ? 'Your Turn' : `${currentPlayerName}'s Turn`}
              </span>
              <span className={`text-sm font-semibold ${timeLeft <= 5 ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  timeLeft <= 5 ? 'bg-red-600' : 'bg-gray-900 dark:bg-gray-300'
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Game Status */}
        {gameState.gameOver && (
          <div className={`p-3 rounded-md mb-4 border ${
            gameState.winner === playerNumber 
              ? 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600' 
              : gameState.winner 
              ? 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
          }`}>
            <p className="text-center font-medium text-sm text-gray-900 dark:text-white">
              {gameState.winner === playerNumber 
                ? 'You Win!' 
                : gameState.winner 
                ? `${players.find(p => p.playerNumber === gameState.winner)?.name || `Player ${gameState.winner}`} Wins!`
                : "It's a Draw!"}
            </p>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-300 dark:bg-gray-600 p-3 rounded-md">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, col) => {
              // Find the bottommost empty row (where piece will land)
              const findBottomEmptyRow = () => {
                for (let row = 5; row >= 0; row--) {
                  if (gameState.board[row][col] === 0) {
                    return row;
                  }
                }
                return -1;
              };
              const bottomEmptyRow = findBottomEmptyRow();
              
              return (
                <div
                  key={col}
                  className="flex flex-col cursor-pointer"
                  onMouseEnter={() => isYourTurn && setHoveredColumn(col)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  onClick={() => handleColumnClick(col)}
                >
                  {Array.from({ length: 6 }).map((_, row) => {
                    const cell = gameState.board[row][col]
                    const isHovered = hoveredColumn === col && row === bottomEmptyRow && isYourTurn && bottomEmptyRow !== -1 && !cell
                    
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`w-11 h-11 rounded-full border border-gray-400 dark:border-gray-500 transition-all ${
                          getCellColor(cell)
                        } ${
                          isHovered 
                            ? `ring-2 ring-gray-500 dark:ring-gray-400 opacity-75 ${playerNumber === 1 ? 'bg-red-400' : 'bg-yellow-300'}`
                            : ''
                        }`}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Player Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-md border ${
          gameState.currentPlayer === 1 && !gameState.gameOver
            ? 'bg-gray-50 dark:bg-gray-700 border-gray-900 dark:border-gray-400'
            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {players.find(p => p.playerNumber === 1)?.name || 'Player 1'}
            </span>
            {gameState.currentPlayer === 1 && !gameState.gameOver && (
              <span className="ml-auto text-gray-900 dark:text-white font-semibold text-xs">→</span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-md border ${
          gameState.currentPlayer === 2 && !gameState.gameOver
            ? 'bg-gray-50 dark:bg-gray-700 border-gray-900 dark:border-gray-400'
            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {players.find(p => p.playerNumber === 2)?.name || 'Player 2'}
            </span>
            {gameState.currentPlayer === 2 && !gameState.gameOver && (
              <span className="ml-auto text-gray-900 dark:text-white font-semibold text-xs">→</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameBoard

