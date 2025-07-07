import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    useCallStateHooks,
    useCall,
    CallingState,
    StreamTheme,
    ParticipantView,
  } from "@stream-io/video-react-sdk";
  
  import { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import MeetingLayout from "./MeetingLayout";
import axiosClient from "../utilities/axiosConfig";
import { useUser } from "@clerk/clerk-react";
import { HashLoader } from "react-spinners";

  
  export default function VideoRoom() {

    const { callId } = useParams()
    const { user } = useUser();

    const apiKey = "qe2y6r3mxmhy";

    const [client, setClient]  = useState(null);
    const [call, setCall]  = useState(null);
    const setupCall = async () => {
      if(user){
      const response = await axiosClient.post(`http://localhost:5000/join-call`,{callId, id: user.id, name: user.firstName, image: user.imageUrl})
      const token = response.data.token
      const streamUser = {
        id: user.id
      }
      const client = new StreamVideoClient({ apiKey, token, user: streamUser });
      const call = client.call("default",callId)
      await call.microphone.enable()
      await call.camera.disable()
      await call.join()
      setClient(client)
      setCall(call)
    }
    }
 
    useEffect(() => {
     setupCall()

    }, [user]);
  
    return (
      <>
      {client && call ? (
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <MeetingLayout callId={callId} />
        </StreamCall>
      </StreamVideo>) : 
     <div className="flex items-center justify-center h-full">
     <HashLoader color="#36d7b7" size={60} />
   </div>
   
      }
      </>
    );
  }
  