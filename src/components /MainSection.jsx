import { useState } from 'react'
import '../App.css'
// import Navbar from './components /Navbar'
import Search from './SearchBar'
import Meetings from './Meetings'
import Agents from './Agents'

function MainSection({selected,setShowSideBar,showSideBar}) {
  const [count, setCount] = useState(0)
  

  return (
    <>
  <div className='flex flex-col flex-1'>
    <Search setShowSideBar={setShowSideBar} showSideBar={showSideBar}/>
    {selected === "Meetings" ? <Meetings /> :
    <Agents/>
    }
  </div>
    </>
    
  )
}

export default MainSection
