import { useState } from 'react'
import CallModal from './CallModal';
import { ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Video } from 'lucide-react'
import {Ban } from 'lucide-react'
function MeetingDetails() {
    const [showCallModal,setShowCallModal]= useState(false)
    const { meetingId } = useParams()
    return (
        <>
            <div className=' flex flex-row ml-5 mt-5 p-3 gap-3 items-center'>
                <h1 className='text-2xl'>My Meetings</h1>
                <ChevronRight size={20} height={35} />
                <h1 className='text-xl font-bold mt-0.5'>{meetingId}</h1>
            </div>
            <div className='bg-[#FFFFFF]  m-7 h-120 flex-col justify-center items-center rounded-xl'>
                <div className='flex justify-center items-center mt-10'>
                    <img className="w-86 h-60" src="/processing.svg"></img></div>
                <div className='flex justify-center items-center text-2xl'>Not Started Yet</div>
                <div className='font-extralight flex justify-center items-center mt-2 text-gray-500' >Once you start this meeting, a summary will appear here </div>
                <div className='flex flex-row gap-5 justify-center items-center mt-8' >
                    <div className='w-44 h-12 gap-2 bg-[#FFFFFF] flex flex-row justify-center items-center rounded-lg cursor-pointer hover:bg-gray-100'>

                        <div><Ban size={20} color='black' /></div>
                        <div className='font-medium text-s '>Cancel meeting</div>
                    </div>
                    <div className='w-44 h-12 gap-2 bg-[#3BAC5D] flex flex-row justify-center items-center rounded-lg cursor-pointer hover:bg-green-600'>

                        <div><Video size={20} color='white' /></div>
                        <div  onClick={() => setShowCallModal(true)} className='font-medium text-s text-white'>Start meeting</div>
                        {showCallModal && <CallModal setShowCallModal={setShowCallModal} />}
                    </div>

                </div>
            </div>
        </>

    )
}

export default MeetingDetails
