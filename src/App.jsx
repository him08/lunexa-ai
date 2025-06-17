import { useState } from 'react'
import './App.css'
import Navbar from './components /Navbar'
import Search from './components /SearchBar'
import MainSection from './components /MainSection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <div className='flex flex-row h-screen'>
    <Navbar />
   <MainSection/>
    </div>
    </>
    
  )
}

export default App
