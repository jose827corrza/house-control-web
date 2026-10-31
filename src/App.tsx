import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import HousesScreen from './components/HousesScreen'

function App() {

  return (
    <>
    <h1 className="text-4xl font-bold mb-4 text-white">House Control Dashboard</h1>
      <HousesScreen />
    </>
  )
}

export default App
