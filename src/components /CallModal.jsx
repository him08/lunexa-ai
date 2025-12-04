import { useState } from 'react'

import { MicOff } from 'lucide-react'
import { VideoOff } from 'lucide-react'
import {LogIn} from 'lucide-react'
import {  useNavigate } from 'react-router-dom'
import axiosClient from '../utilities/axiosConfig'
function CallModal({ setShowCallModal,callId }) {
    const API_URL = import.meta.env.VITE_API_URL
const joinCall = async () => {
    try{
    await axiosClient.patch(`${API_URL}/meetings`,{
        meetingId: callId,
        status: "in_progress"
    })
    window.location.href = `/call/${callId}`
}
catch(error){
    alert('something went wrong')
}
}
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className={`flex flex-col items-center overflow-auto  w-[600px] h-[580px] bg-white rounded-xl gap-4 p-4 cursor-pointer transition-all duration-200`}>

                    {/* Heading */}
                    <h2 className="mt-5 text-xl font-bold mb-1">Ready to join?</h2>
                    <p className="text-sm text-gray-500 mb-4">Set up your call before joining</p>

                    {/* Avatar Circle */}
                    <div className='w-88 h-82 bg-[#19232C] rounded-xl flex justify-center items-center border-4 border-blue-700'>
                        <div className="w-32 h-32 bg-[#AB46BF] rounded-full flex items-center justify-center mb-4 ">
                            <div className="text-4xl text-white font-bold">HV</div>
                        </div>
                    </div>
                    {/* Controls */}
                    <div className="flex gap-4 mb-4">
                        <button className="bg-red-700 p-3 rounded-full cursor-pointer hover:bg-red-800">
                            <MicOff size={20} color="white" />


                        </button>
                        <button className="bg-red-700 p-3 rounded-full cursor-pointer hover:bg-red-800">
                            <VideoOff size={20} color="white" />
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between w-full">
                        <div onClick = {() => setShowCallModal(false)} className='w-32 h-12 gap-2 bg-[#FFFFFF] flex flex-row justify-center items-center rounded-lg cursor-pointer hover:bg-gray-100'>

                            {/* <div><Ban size={20} color='black' /></div> */}
                            <div className='font-medium text-s '>Cancel</div>
                        </div>
                        <div className='w-32 h-10 gap-2 bg-[#3BAC5D] flex flex-row justify-center items-center rounded-lg cursor-pointer hover:bg-green-600'>

                             <div><LogIn size={20} color='white' /></div> 
                            <div onClick={joinCall} className='font-medium text-s text-white'>Join Call</div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default CallModal

