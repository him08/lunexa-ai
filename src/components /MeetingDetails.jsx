import { useEffect, useState } from 'react'
import CallModal from './CallModal';
import { ChevronRight, Video, Ban, MessageCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import BotModal from './BotModal'  // Create this component
import VideoRoom from './VideoRoom';
import axiosClient from '../utilities/axiosConfig'
function MeetingDetails() {
    const [showCallModal, setShowCallModal] = useState(false)
    const [showBotModal, setShowBotModal] = useState(false)
    const [meetingData, setMeetingData] = useState([]);
    const { meetingId } = useParams()
    const fetchMeetingDetails = async () => {
        let response = await axiosClient.get(`http://localhost:5000/meetings/${meetingId}`)
        setMeetingData(response.data.data);
    }

    useEffect(() => {
        fetchMeetingDetails();

    }, []);


    return (
        <>
            <div className='flex flex-row ml-5 mt-5 p-3 gap-3 items-center'>
                <h1 className='text-2xl'>My Meetings</h1>
                <ChevronRight size={20} height={35} />
                <h1 className='text-xl font-bold mt-0.5'>{meetingId}</h1>
            </div>

            <div className='bg-[#FFFFFF] m-7 h-120 flex-col justify-center items-center rounded-xl'>
                <div className='flex justify-center items-center mt-10'>
                    <img className="w-86 h-60" src="/images/processing.svg" alt="processing" />
                </div>
                {meetingData.status === "not_started" && (
                    <div className='flex justify-center items-center text-2xl'>Not Started Yet</div>
                )}
                {meetingData.status === "in_progress" &&
                    (
                        <div className='flex justify-center items-center text-2xl'>Meeting In Progress</div>
                    )
                }
                {meetingData.status === "completed" &&
                    (
                        <div className='flex justify-center items-center text-2xl'>Meeting Completed</div>
                    )
                }

                <div className='flex flex-row gap-5 justify-center items-center mt-8'>
                    {meetingData.status === "not_started" && (
                        <div className='w-44 h-12 gap-2 bg-[#FFFFFF] flex flex-row justify-center items-center rounded-lg cursor-pointer hover:bg-gray-100'>
                            <Ban size={20} color='black' />
                            <div className='font-medium text-s'>Cancel meeting</div>
                        </div>
                    )
                    }

                    <div onClick={() => meetingData.status === "in_progress" ? (window.location.href =  `/call/${meetingId}`) : setShowCallModal(true)} className='w-44 h-12 gap-2 bg-[#3BAC5D] flex flex-row justify-center items-center rounded-lg cursor-pointer hover:bg-green-600'>
                        <Video size={20} color='white' />
                        <div className='font-medium text-s text-white cursor-pointer'>
                            {
                                meetingData.status === "not_started"
                                    ? "Start Meeting"
                                    : meetingData.status === "in_progress"
                                        ? "Resume Meeting"
                                        : "Restart Meeting"
                            }
                        </div>
                    </div>


                </div>
            </div>

            {/* Floating Chat Button */}
            <div onClick={() => setShowBotModal(true)} className="fixed bottom-6 right-6 bg-[#3BAC5D] hover:bg-green-600 p-4 rounded-full shadow-lg cursor-pointer">
                <MessageCircle size={24} color='white' />
            </div>

            {/* Modals */}
            {showCallModal && <CallModal callId={meetingId} setShowCallModal={setShowCallModal} />}
            {showBotModal && <BotModal setShowBotModal={setShowBotModal} />}
        </>
    )
}

export default MeetingDetails;
