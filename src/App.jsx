import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Weather from './Weather.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="weather-form">
        <Weather />
      </section>
    </>
  )
}

export default App
