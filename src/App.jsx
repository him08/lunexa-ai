import { useState } from 'react'
import './App.css'
import Navbar from './components /Navbar'
import Search from './components /SearchBar'
import MainSection from './components /MainSection'
import Modal from './components /Modal'
import { ToastContainer } from 'react-toastify';
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function App() {
  const [count, setCount] = useState(0)
  const[selected,setSelected]=useState("Meetings");
  const[showSideBar,setShowSideBar]=useState(true)
  const a =  import.meta.env.VITE_VAPI_WEB_KEY_TOKEN
  console.log(a)
  
  return (
    
    <>
    
  <div className='md:flex flex-row h-screen overflow-x-hidden'>
    <Navbar setSelected={setSelected} selected={selected} showSideBar={showSideBar} setShowSideBar={setShowSideBar}/>
   <MainSection setShowSideBar={setShowSideBar} showSideBar={showSideBar} selected={selected} setSelected={setSelected}/>
   <ToastContainer />
    </div>
    </>
    
  )
}

export default App
