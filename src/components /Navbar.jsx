import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
// import { useUser } from '@clerk/clerk-react';
import '../App.css'
import { Video } from 'lucide-react';
import { Bot } from 'lucide-react';
import { Star } from 'lucide-react';
import { Rocket } from 'lucide-react';
function Navbar({setSelected,selected,showSideBar,setShowSideBar}) {
  const navigate = useNavigate();
    const location = useLocation();
    // const { user } = useUser()

    useEffect(() => {
      if (location.pathname == '/meetings' && selected != 'Meetings') {
        setSelected('Meetings')
      }
      if (location.pathname == '/agents' && selected != 'Agents') {
        setSelected('Agents')
      }
    }, [location.pathname]);

  return (
    <>
    
     { showSideBar &&
       <div className="fixed md:relative inset-0 z-50 flex items-center justify-center backdrop-opacity-60 bg-black/30">
      <div className={`flex bg-[#061B15]  text-white w-75 md:w-80 h-screen flex-col font-bold fixed top-0 left-0 z-50 md:relative md:z-auto`}>

        {/* NAME AND LOGO */}
        <div className='mt-6 gap-3 px-4 flex flex-row items-center'>
          <div><img src='/logo.svg' /></div>
          <div className='font-bold text-2xl'>Meet.AI</div>
         <div className='ml-22 mt-2' > <UserButton  /> </div>
        </div>
        {/* LINE */}
        <div className='mt-4 h-1 bg-[#1D2E2A] mx-4'></div>
        {/* MEETINGS TAB */}
        <div onClick={() => {setSelected("Meetings");navigate("/meetings");}} className= {`mt-6 px-4 p-2 gap-3 flex flex-row items-center cursor-pointer rounded-xl hover:bg-[#092E24] ${selected==="Meetings" ? "bg-[#092E24]" : "bg-[#061B15]"}`}>
          <div><Video color="white" size={30} /></div>
          <div className=' font-normal text-lg'>Meetings</div>
        </div>
        {/* AGENTS TAB */}
        <div onClick={() => {setSelected("Agents");navigate("/agents")}} className={`mt-6 px-4 p-2 gap-3 flex flex-row items-center cursor-pointer rounded-xl hover:bg-[#092E24] ${selected === "Agents" ? "bg-[#092E24]" : "bg-[#061B15]"}` }>
          <div><Bot color="white" size={30} /></div>
          <div className=' font-normal text-lg'>Agents</div>
        </div>
        {/* LINE */}
        <div className='mt-8 h-1 bg-[#1D2E2A] mx-4'></div>
        {/* UPGRADE TAB */}
        <div className='p-2 mt-2 px-4 gap-3 flex flex-row items-center cursor-pointer rounded-xl hover:bg-[#092E24]'>
          <div> <Star color="white" size={30} /></div>
          <div className=' font-normal text-lg'>Upgrade</div>
        </div>
        <div className='grow'></div>
        {/* BOX DOWN */}
        <div className='flex flex-col p-6 mx-2 rounded-xl bg-[#1D2E2A] mb-2 gap-3'>
          <div className='gap-3 flex flex-row items-center'>
            <div><Rocket color="white" size={15} /></div>
            <div className='font-normal text-lg'>Free Trial</div>
          </div>
          <div className='  font-normal text-sm'>
            0/1 Agents
          </div>
          <div className=' h-2 bg-[#163F29] rounded-xl'></div>
          <div className=' font-normal text-sm'>
            0/3 Meetings
          </div>
          <div className=' h-2 bg-[#163F29] rounded-xl'></div>
          {/* UPGRADE BUTTON */}
          <div className="mt-4 -mx-6 -mb-6 hover:bg-[#2B3C38] transition-colors duration-200 cursor-pointer rounded-b-xl">
            <div className="h-[1px] bg-[#2B3C38]"></div>
            <div className="text-center py-3 text-base font-medium">Upgrade</div>
          </div>
        </div>
        {/* EMAIL ID AND NAME BOX
        <div className='flex flex-col p-6 mx-2 mb-2 rounded-xl bg-[#1D2E2A] '>
           AVATAR CIRCLE 
          <div className='flex flex-row gap-4'>
              <div className='w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center'>  <UserButton /></div>
         NAME AND EMAIL 
          <div className='flex flex-col justify-center'>
              <div className='text-s font-normal'>{user?.fullName} </div>
              <div className='gap-6 text-xs font-normal'>{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
          </div>
        </div> */}
      </div>
      </div>
}
    </>
  )
}

export default Navbar
