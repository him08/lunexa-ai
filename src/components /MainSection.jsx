import { useState } from 'react'
import '../App.css'
// import Navbar from './components /Navbar'
import Search from './SearchBar'
import Meetings from './Meetings'

function MainSection() {
  const [count, setCount] = useState(0)

  return (
    <>
  <div className='flex flex-col flex-1'>
    <Search />
    <Meetings />
  </div>
    </>
    
  )
}

export default MainSection
