import { lazy, Suspense, useState } from 'react'
import '../App.css'
// import Navbar from './components /Navbar'
import Search from './SearchBar'

import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
import Meetings from '../pages/Meetings';
const Agents = lazy(() => import('../pages/Agents'));


function MainSection({ setShowSideBar, showSideBar }) {
  const [count, setCount] = useState(0)

  return (
    <>
     
        <div className='flex flex-col flex-1'>
          <Search setShowSideBar={setShowSideBar} showSideBar={showSideBar} />
          <Suspense fallback={<div className="text-white text-center p-4">Loading...</div>}>
          <Routes>
          <Route path='/' element={<Navigate to="/meetings" replace/> } />
            <Route path='/meetings' element={<Meetings />} />
            <Route path='/agents' element={<Agents />} />
          </Routes>
          </Suspense>
        </div>
      
    </>
  )
}

export default MainSection;
