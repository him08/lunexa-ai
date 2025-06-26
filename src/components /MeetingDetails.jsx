import { useState } from 'react'
import CallModal from './CallModal';
import { ChevronRight, Video, Ban, MessageCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import BotModal from './BotModal'  // Create this component

function MeetingDetails() {
    const [showCallModal, setShowCallModal] = useState(false)
    const [showBotModal, setShowBotModal] = useState(false)
    const { meetingId } = useParams()

    return (
        <>
            <div className='flex flex-row ml-5 mt-5 p-3 gap-3 items-center'>
                <h1 className='text-2xl'>My Meetings</h1>
                <ChevronRight size={20} height={35} />
                <h1 className='text-xl font-bold mt-0.5'>{meetingId}</h1>
            </div>

            <div className='bg-[#FFFFFF] m-7 h-120 flex-col justify-center items-center rounded-xl'>
                <div className='flex justify-center items-center mt-10'>
                    <img className="w-86 h-60" src="/processing.svg" alt="processing" />
                </div>
                <div className='flex justify-center items-center text-2xl'>Not Started Yet</div>
                <div className='font-extralight flex justify-center items-center mt-2 text-gray-500'>
                    Once you start this meeting, a summary will appear here
                </div>
                <div className='flex flex-row gap-5 justify-center items-center mt-8'>
                    <div className='w-44 h-12 gap-2 bg-[#FFFFFF] flex flex-row justify-center items-center rounded-lg cursor-pointer hover:bg-gray-100'>
                        <Ban size={20} color='black' />
                        <div className='font-medium text-s'>Cancel meeting</div>
                    </div>
                    <div onClick={() => setShowCallModal(true)} className='w-44 h-12 gap-2 bg-[#3BAC5D] flex flex-row justify-center items-center rounded-lg cursor-pointer hover:bg-green-600'>
                        <Video size={20} color='white' />
                        <div className='font-medium text-s text-white'>Start meeting</div>
                    </div>
                </div>
            </div>

            {/* Floating Chat Button */}
            <div onClick={() => setShowBotModal(true)} className="fixed bottom-6 right-6 bg-[#3BAC5D] hover:bg-green-600 p-4 rounded-full shadow-lg cursor-pointer">
                <MessageCircle size={24} color='white' />
            </div>

            {/* Modals */}
            {showCallModal && <CallModal setShowCallModal={setShowCallModal} />}
            {showBotModal && <BotModal setShowBotModal={setShowBotModal} />}
        </>
    )
}

export default MeetingDetails;
