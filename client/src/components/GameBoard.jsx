import { useState, useEffect } from 'react'

function GameBoard({ gameState, playerNumber, players, roomId, timeLeft, onMakeMove, onRestart, onLeaveRoom, darkMode, toggleDarkMode, inviteState, onSendPlayAgainInvite, onAcceptPlayAgainInvite, onDeclinePlayAgainInvite, countdown }) {
  const [hoveredColumn, setHoveredColumn] = useState(null)

  if (!gameState) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-8 text-center w-full max-w-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10"></div>
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:scale-110 z-[100] shadow-sm cursor-pointer"
          aria-label="Toggle dark mode"
          style={{ pointerEvents: 'auto' }}
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
        <div className="relative z-10">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Waiting for opponent...</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Share this room ID with your friend</p>
          <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Room ID</p>
            <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white tracking-wider">{roomId}</p>
          </div>
          <button
            onClick={onLeaveRoom}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all hover:scale-105"
          >
            Leave Room
          </button>
        </div>
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
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 w-full max-w-2xl relative overflow-hidden">
      {countdown !== null && (
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center rounded-2xl pointer-events-none">
          <div className="text-center">
            {countdown > 0 ? (
              <div className="text-9xl font-bold text-white animate-pulse">
                {countdown}
              </div>
            ) : countdown === 0 ? (
              <div className="text-6xl font-bold text-white animate-bounce">
                Let's Go!
              </div>
            ) : null}
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10 pointer-events-none"></div>
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:scale-110 z-[100] shadow-sm cursor-pointer"
        aria-label="Toggle dark mode"
        style={{ pointerEvents: 'auto' }}
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
      <div className="mb-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 shadow-sm">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Room</span>
                <span className="ml-2 font-mono font-bold text-gray-900 dark:text-white text-sm">{roomId}</span>
              </div>
              <button
                onClick={onLeaveRoom}
                className="px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white border-2 border-red-300 dark:border-red-600 rounded-lg hover:bg-red-500 dark:hover:bg-red-600 transition-all hover:scale-105 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md"
              >
                <svg className="w-3.5 h-3.5 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Exit
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Playing as <span className="font-semibold text-gray-700 dark:text-gray-300">{yourPlayerName}</span>
            </p>
          </div>
          {gameState.gameOver && (
            <div className="flex gap-2">
              {inviteState.pendingInvite === 'sent' && (
                <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Invite sent...
                </div>
              )}
              {inviteState.pendingInvite === 'received' && (
                <div className="flex gap-2">
                  <button
                    onClick={onAcceptPlayAgainInvite}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all text-sm flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accept
                  </button>
                  <button
                    onClick={onDeclinePlayAgainInvite}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm flex items-center gap-2 hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Decline
                  </button>
                </div>
              )}
              {!inviteState.pendingInvite && (
                <button
                  onClick={onSendPlayAgainInvite}
                  className="px-5 py-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 text-white rounded-lg font-medium hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all text-sm flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Play Again
                </button>
              )}
            </div>
          )}
        </div>

        {!gameState.gameOver && (
          <div className="mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isYourTurn && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
                <span className={`text-sm font-semibold ${isYourTurn ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {isYourTurn ? 'Your Turn' : `${currentPlayerName}'s Turn`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-lg font-bold ${timeLeft <= 5 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  timeLeft <= 5 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {gameState.gameOver && (
          <div className={`p-4 rounded-xl mb-4 border-2 shadow-lg ${
            gameState.winner === playerNumber 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-700' 
              : gameState.winner 
              ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border-red-300 dark:border-red-700'
              : 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-slate-700 border-gray-300 dark:border-gray-600'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {gameState.winner === playerNumber ? (
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : gameState.winner ? (
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className={`text-center font-bold text-base ${
                gameState.winner === playerNumber 
                  ? 'text-green-700 dark:text-green-300' 
                  : gameState.winner 
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {gameState.winner === playerNumber 
                  ? '🎉 You Win! 🎉' 
                  : gameState.winner 
                  ? `${players.find(p => p.playerNumber === gameState.winner)?.name || `Player ${gameState.winner}`} Wins!`
                  : "It's a Draw!"}
              </p>
            </div>
            {inviteState.pendingInvite === 'received' && (
              <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="font-semibold">{inviteState.inviteFrom}</span> wants to play again
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center mb-6 relative z-10">
        <div className="bg-gradient-to-b from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 p-4 rounded-2xl shadow-2xl border-4 border-blue-800 dark:border-blue-700">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, col) => {
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
                  className="flex flex-col cursor-pointer group"
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
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 transition-all duration-200 ${
                          cell === 0 
                            ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600' 
                            : getCellColor(cell) + ' border-gray-400 dark:border-gray-500 shadow-lg'
                        } ${
                          isHovered 
                            ? `ring-4 ring-white dark:ring-gray-300 ring-opacity-75 scale-110 ${playerNumber === 1 ? '!bg-red-500 !border-red-600 shadow-red-500/50' : '!bg-yellow-400 !border-yellow-500 shadow-yellow-400/50'}`
                            : ''
                        } ${cell !== 0 ? 'drop-shadow-lg' : ''}`}
                        style={{
                          transform: isHovered ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
                        }}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 relative z-10">
        <div className={`p-4 rounded-xl border-2 transition-all ${
          gameState.currentPlayer === 1 && !gameState.gameOver
            ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border-red-400 dark:border-red-600 shadow-lg scale-105'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full ${gameState.currentPlayer === 1 && !gameState.gameOver ? 'bg-red-500 ring-2 ring-red-300 dark:ring-red-700 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-semibold ${
              gameState.currentPlayer === 1 && !gameState.gameOver
                ? 'text-red-700 dark:text-red-300'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {players.find(p => p.playerNumber === 1)?.name || 'Player 1'}
            </span>
            {gameState.currentPlayer === 1 && !gameState.gameOver && (
              <span className="ml-auto text-red-600 dark:text-red-400 font-bold text-lg animate-pulse">→</span>
            )}
          </div>
        </div>
        <div className={`p-4 rounded-xl border-2 transition-all ${
          gameState.currentPlayer === 2 && !gameState.gameOver
            ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-400 dark:border-yellow-600 shadow-lg scale-105'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full ${gameState.currentPlayer === 2 && !gameState.gameOver ? 'bg-yellow-400 ring-2 ring-yellow-300 dark:ring-yellow-700 animate-pulse' : 'bg-yellow-400'}`}></div>
            <span className={`text-sm font-semibold ${
              gameState.currentPlayer === 2 && !gameState.gameOver
                ? 'text-yellow-700 dark:text-yellow-300'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {players.find(p => p.playerNumber === 2)?.name || 'Player 2'}
            </span>
            {gameState.currentPlayer === 2 && !gameState.gameOver && (
              <span className="ml-auto text-yellow-600 dark:text-yellow-400 font-bold text-lg animate-pulse">→</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameBoard

