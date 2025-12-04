import { useEffect, useState } from 'react'
import CallModal from './CallModal';
import { ChevronRight, Video, Ban, MessageCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import BotModal from './BotModal'
import axiosClient from '../utilities/axiosConfig'

function MeetingDetails() {
    const [showCallModal, setShowCallModal] = useState(false)
    const [showBotModal, setShowBotModal] = useState(false)
    const [meetingData, setMeetingData] = useState({});
    const [transcript, setTranscript] = useState([]);
    const [filteredTranscript, setFilteredTranscript] = useState([]);
    const [activeTab, setActiveTab] = useState("transcript");
    const { meetingId } = useParams();
    const API_URL = import.meta.env.VITE_API_URL

    const fetchMeetingDetails = async () => {
        try {
            const response = await axiosClient.get(`API_URL/meetings/${meetingId}`);
            const data = response.data.data;
            setMeetingData(data);

            if (data.status === "completed" && data.transcribed_url) {
                const transcriptRes = await fetch(data.transcribed_url);
                const text = await transcriptRes.text();
                const lines = text.trim().split('\n');
                const parsed = lines.map(line => JSON.parse(line));
                setTranscript(parsed);
                setFilteredTranscript(parsed);
            }
        } catch (err) {
            console.error("Failed to fetch transcript:", err);
        }
    };

    useEffect(() => {
        fetchMeetingDetails();
    }, []);

    const formatTime = (milliseconds) => {
        const seconds = milliseconds / 1000;
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };

    const getSpeakerName = (speaker_id) => {
        if (!speaker_id || !meetingData || !meetingData.agent) return "Unknown";
        return speaker_id === meetingData.agent._id ? meetingData.agent.name : "You";
    };

    return (
        <>
            <div className='flex flex-row ml-5 mt-5 p-3 gap-3 items-center'>
                <h1 className='text-2xl'>My Meetings</h1>
                <ChevronRight size={20} height={35} />
                <h1 className='text-xl font-bold mt-0.5'>{meetingId}</h1>
            </div>

            <div className='bg-[#FFFFFF] m-7 rounded-xl p-6'>

                {/* Tabs */}
                {meetingData.status === "completed" && (
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab("transcript")}
                            className={`px-4 py-2 rounded-md font-medium ${
                                activeTab === "transcript" ? "bg-[#3BAC5D] text-white" : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            Transcript
                        </button>
                        <button
                            onClick={() => setActiveTab("recording")}
                            className={`px-4 py-2 rounded-md font-medium ${
                                activeTab === "recording" ? "bg-[#3BAC5D] text-white" : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            Video Recording
                        </button>
                    </div>
                )}

                {/* Transcript Tab */}
                {meetingData.status === "completed" && activeTab === "transcript" && transcript.length > 0 && (
                    <div>
                        <input
                            type="text"
                            placeholder="Search Transcript"
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                            onChange={(e) => {
                                const keyword = e.target.value.toLowerCase();
                                const filtered = transcript.filter((t) =>
                                    t.text.toLowerCase().includes(keyword)
                                );
                                setFilteredTranscript(filtered);
                            }}
                        />

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 px-1">
                            {filteredTranscript.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col items-${item.speaker_id === meetingData.agent?._id ? "start" : "end"} mb-2`}
                                >
                                    <div className="text-xs text-gray-500 mb-1">
                                        {getSpeakerName(item.speaker_id)} • {formatTime(item.start_ts)}
                                    </div>
                                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                                        item.speaker_id === meetingData.agent?._id
                                            ? "bg-gray-100 text-black self-start"
                                            : "bg-[#3BAC5D] text-white self-end"
                                    }`}>
                                        {item.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recording Tab */}
                {meetingData.status === "completed" && activeTab === "recording" && (
                    <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
                        {meetingData.recording_url ? (
                            <video
                                className="w-full h-auto rounded-lg"
                                controls
                                src={meetingData.recording_url}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <p className="text-gray-500">No recording available.</p>
                        )}
                    </div>
                )}

                {/* If not completed */}
                {meetingData.status !== "completed" && (
                    <>
                        <div className='flex justify-center items-center mt-10'>
                            <img className="w-86 h-60" src="/images/processing.svg" alt="processing" />
                        </div>

                        <div className='flex justify-center items-center text-2xl mt-3'>
                            {meetingData.status === "not_started" && "Not Started Yet"}
                            {meetingData.status === "in_progress" && "Meeting In Progress"}
                            {meetingData.status === "completed" && "Meeting Completed"}
                        </div>

                        <div className='flex flex-row gap-5 justify-center items-center mt-8'>
                            {meetingData.status === "not_started" && (
                                <div className='w-44 h-12 gap-2 bg-[#FFFFFF] flex flex-row justify-center items-center rounded-lg cursor-pointer hover:bg-gray-100'>
                                    <Ban size={20} color='black' />
                                    <div className='font-medium text-s'>Cancel meeting</div>
                                </div>
                            )}

                            <div
                                onClick={() =>
                                    meetingData.status === "in_progress"
                                        ? (window.location.href = `/call/${meetingId}`)
                                        : setShowCallModal(true)
                                }
                                className='w-44 h-12 gap-2 bg-[#3BAC5D] flex flex-row justify-center items-center rounded-lg cursor-pointer hover:bg-green-600'>
                                <Video size={20} color='white' />
                                <div className='font-medium text-s text-white cursor-pointer'>
                                    {meetingData.status === "not_started"
                                        ? "Start Meeting"
                                        : meetingData.status === "in_progress"
                                            ? "Resume Meeting"
                                            : "Restart Meeting"}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Floating Chat Button */}
            <div
                onClick={() => setShowBotModal(true)}
                className="fixed bottom-6 right-6 bg-[#3BAC5D] hover:bg-green-600 p-4 rounded-full shadow-lg cursor-pointer"
            >
                <MessageCircle size={24} color='white' />
            </div>

            {/* Modals */}
            {showCallModal && <CallModal callId={meetingId} setShowCallModal={setShowCallModal} />}
            {showBotModal && <BotModal setShowBotModal={setShowBotModal} />}
        </>
    );
}

export default MeetingDetails;
