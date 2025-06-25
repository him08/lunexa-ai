import { lazy, Suspense, useState } from 'react'
import '../App.css'
// import Navbar from './components /Navbar'
import Search from './SearchBar'
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
import Meetings from '../pages/Meetings';
import MeetingDetails from './MeetingDetails';
const Agents = lazy(() => import('../pages/Agents'));


function MainSection({ setShowSideBar, showSideBar , setSelected}) {

  return (
    <>
     
        <div className='flex flex-col bg-[#F5F5F5] flex-1'>
          <Search setShowSideBar={setShowSideBar} showSideBar={showSideBar} />
          <Suspense fallback={<div className="text-white text-center p-4">Loading...</div>}>
          <Routes>
          <Route path='/' element={<Navigate to="/meetings" replace/> } />
          <Route path='/meetings/:meetingId' element={<MeetingDetails/>} />
            <Route path='/meetings' element={<Meetings />} />
            <Route path='/agents' element={<Agents />} />
          </Routes>
          </Suspense>
        </div>
      
    </>
  )
}

export default MainSection;
