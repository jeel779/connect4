import { useState } from 'react'

function Lobby({ playerName, setPlayerName, onCreateRoom, onJoinRoom, darkMode, toggleDarkMode }) {
  const [joinRoomId, setJoinRoomId] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-8 w-full max-w-md relative">
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
        <h1 className="text-3xl font-semibold text-center mb-2 text-gray-900 dark:text-white">
          Connect 4
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">Play with friends online</p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 outline-none transition text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={onCreateRoom}
              className="w-full bg-gray-900 dark:bg-gray-700 text-white py-2.5 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              Create Room
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs">OR</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Join Room
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                placeholder="Room ID"
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 outline-none transition uppercase text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                maxLength={6}
              />
              <button
                onClick={() => onJoinRoom(joinRoomId)}
                className="px-5 py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lobby

