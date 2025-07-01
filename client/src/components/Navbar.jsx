import React from 'react'

const Navbar = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
  return (
    <nav className="flex items-center justify-between bg-white shadow px-4 py-2">
      <button className="text-2xl mr-2 focus:outline-none">
        <span className="material-icons">menu</span>
      </button>
      <div className="flex items-center">
        <img src={`${baseUrl}/vite.svg`} alt="FlytEasy Logo" className="h-8 mr-2" />
        <span className="font-bold text-lg text-blue-900">FLYTEASY</span>
      </div>
      <button className="bg-yellow-400 text-blue-900 px-4 py-1 rounded font-semibold hover:bg-yellow-500 transition-colors">Install App</button>
    </nav>
  )
}

export default Navbar 