import {
  useCallStateHooks,
  useCall,
  CallingState,
  ParticipantView
} from "@stream-io/video-react-sdk";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utilities/axiosConfig";
import { useEffect, useState } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";


export default function MeetingLayout({ callId }) {
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const [meeting, setMeeting] = useState()

  const callingState = useCallCallingState();
  const participants = useParticipants();
  const call = useCall();
  const navigate = useNavigate();

  const [micEnabled, setMicEnabled] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);

  const fetchMeetingDetails= async ()=>{
    let response=  await axiosClient.get(`${API_URL}/meetings/${callId}`)
    setMeeting(response.data.data)
}
  const updateMeetingStatus =async () =>{
    try{
      await axiosClient.patch(`${API_URL}/meetings`,{
          meetingId: callId,
          status: "completed"
      })
   
  }
  catch(error){
      alert('something went wrong!')
  }
    call.endCall();
  }

  useEffect(() => {
    fetchMeetingDetails();
  
  }, []);


  if (callingState === CallingState.LEFT) {
    navigate("/");
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-screen items-center justify-center text-white text-2xl bg-white">
        Joining Meeting...
      </div>
    );
  }

  const joinAI = async () => {
    await axiosClient.post(`${API_URL}/join-ai`, { callId });
  };

  const toggleMic = () => {
    call.microphone.toggle();
    setMicEnabled((prev) => !prev);
  };

  const toggleCam = () => {
    call.camera.toggle();
    setCamEnabled((prev) => !prev);
  };
  

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex justify-between items-center p-4 bg-[#061B15] text-white">
        <div className="text-lg font-semibold">{meeting?.name}</div>
      </div>

      <div className="flex-1 flex items-center justify-center gap-4 p-4">
        {participants.map((participant) => (
          <div
            key={participant.sessionId}
            className={`bg-[#1E2938] w-full h-full rounded flex items-center justify-center ${
              participant.isSpeaking ? "speaking border-2 border-green-500" : "border-transparent"}`}
          >
            {camEnabled && participant?.roles?.includes('admin') ? (
              <ParticipantView className="flex justify-center items-center" participant={participant} />
            ) : (
              <img height={90} width={90} src={participant.image} />
            )
            }

          </div>

        ))}
      </div>

      <div className="flex justify-center w-full items-center gap-4 p-4 bg-gray-900">
        <button
          onClick={toggleMic}
          className="px-4 py-2 bg-gray-700 text-white  cursor-pointer rounded hover:bg-gray-600"
        >
          {micEnabled ? <Mic /> : <MicOff />}
        </button>
        <button
          onClick={toggleCam}
          className="px-4 py-2 bg-gray-700 text-white cursor-pointer rounded hover:bg-gray-600"
        >
          {camEnabled ? <Video /> : <VideoOff />}
        </button>

        <button
          onClick={updateMeetingStatus}
          className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700"
        >
          Leave
        </button>
      </div>
    </div>
  );
}
