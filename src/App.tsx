import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform duration-300">
          <img src={viteLogo} className="h-24 w-24 drop-shadow-lg" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform duration-300">
          <img src={reactLogo} className="h-24 w-24 animate-spin-slow drop-shadow-lg" alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
        Vite + React + Tailwind v4
      </h1>
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg mb-6 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          count is {count}
        </button>
        <p className="text-gray-600 text-center text-sm">
          Edit <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-8 text-gray-500 text-sm text-center max-w-md">
        ✨ Click on the Vite and React logos to learn more. This is built with <span className="font-semibold text-blue-600">Tailwind CSS v4</span>!
      </p>
    </div>
  )
}

export default App
