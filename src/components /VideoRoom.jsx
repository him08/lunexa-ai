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
      if (!user) return;
      const response = await axiosClient.post(`http://localhost:5000/join-call`, {
        callId,
        id: user.id,
        name: user.firstName,
        image: user.imageUrl,
      });

      const transcript = await fetch("https://mumbai.stream-io-cdn.com/1399789/video/transcriptions/default_686fd4b403efe5b406a31350/transcript_default_686fd4b403efe5b406a31350_1752161638747.jsonl?Expires=1753371253&Signature=flBSdnPVN87DWRDnk1l6oUIzyt1pgVr11Y-aTCHo2VGEIpNUNEEzxoWqsAjH1HBZ9xqm0JmOaoHuYkWZAYmaSV5kBiSgu0Cl6pA1HBmk5D1nMTrGZ8ToMjJK8nwNseE44GSdLvjOo3GiQd~MRigdEJfv4z1tsNl2ndQQJRAr1ljSLydt-jhyFhJZzgKt-j1mGVTNxPQEcbwwnhqcZaEHibQlXyXRO5C-DOkvVmqVCU1GVH3f4ZnA21J3AEUAGU-9tj1T5CKa0G3jp0C7jOPFI9TCvXXYgn2JUX4qYnl6eh1u9m6BBzv60eJBmBkQQyphPXZwOcnSG4QbFJ0B24XUmw__&Key-Pair-Id=APKAIHG36VEWPDULE23Q")
        .then((res) => res.text())
        .then((text) => JSONL.parse(text))
        .catch(() => {
          return [];
        });

        console.log('ishan',transcript)
    
      const token = response.data.token;
      const streamUser = { id: user.id };
    
      const client = new StreamVideoClient({ apiKey , token, user: streamUser});
      const call = client.call("default", callId);
    
      await call.microphone.disable();
      await call.camera.disable();
      await call.join();
    
      setClient(client);
      setCall(call);
    };
  
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
  <div className="flex items-center justify-center h-screen bg-white">
  <HashLoader color="#36d7b7" size={60} />
</div>
      }
      </>
    );
  }
  