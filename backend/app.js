require('dotenv').config()
const express=require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const Agent = require('./models/Agent');
const Meeting = require('./models/Meeting');
const { verifyToken } = require('@clerk/backend'); 
const axios = require('axios');
const { StreamClient } = require("@stream-io/node-sdk");
const app=express();
// const  { botttsNeutral, initials } = require("@dicebear/collection");
// const { createAvatar } =  require("@dicebear/core")
// FOR CORS POLICY 
app.use(cors())
app.use(express.json())

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const client = new StreamClient(apiKey, apiSecret);


mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('DATABASE Connected!'))
  .catch((error) => console.log(error))

  // const generateAvatarUri = ({ seed, variant }) => {
  //   let avatar;
  
  //   if (variant === "botttsNeutral") {
  //     avatar = createAvatar(botttsNeutral, { seed });
  //   } else {
  //     avatar = createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });
  //   }
  
  //   return avatar.toDataUri();
  // };
  

  app.post('/webhook', async (req,res) => {
    const event = req.body
   const eventType = event?.type
   try {
   if(eventType === "call.session_started"){
    const meetingId = event.call?.custom?.meetingId;
const meeting = await Meeting.findOne({_id:meetingId}).populate('agent').exec()
const agent = meeting.agent

const call = client.video.call("default", meetingId);

async function setupRealtimeClient(realtimeClient) {
  realtimeClient.on("error", (event) => {
    console.error("Error:", event);
  });

  realtimeClient.on("session.update", (event) => {
    console.log("Realtime session update:", event);
  });

  realtimeClient.updateSession({
    instructions: "You are a helpful assistant that can answer questions and help with tasks.",
  });

  return realtimeClient;
}
  const realtimeClient = await client.video.connectOpenAi({
    call,
    openAiApiKey: process.env.OPEN_AI_API_KEY,
    agentUserId: agent._id
  });
  realtimeClient.updateSession({
    instructions:
      agent.instructions
  });

  await setupRealtimeClient(realtimeClient)

  realtimeClient.on('realtime.event', ({ time, source, event }) => {
    console.log(`got an event from OpenAI ${event.type}`);
    if (event.type === 'response.audio_transcript.done') {
        console.log(`got a transcript from OpenAI ${event.transcript}`);
    }
});
  
  res.status(200).json({ status: "ok" })
}else if (eventType === "call.session_participant_left") {
  const event = req.body;
  const meetingId = event.call_cid.split(":")[1];

  if (!meetingId) {
    return res.status(400).json({ error: "Missing meetingId" });
  }

  const call = client.video.call("default", meetingId);
  await call.end();
  res.status(200).json({ status: "ok" })
}
else if (eventType === "call.transcription_ready") {
  try{
  const event = req.body;
  const meetingId = event?.call_cid?.split(":")[1];
  const transcribed_url=event.call_transcription.url ;
  console.log(transcribed_url)
  await Meeting.findOneAndUpdate({_id: meetingId},{transcribed_url:transcribed_url},{new: true})

  res.status(200).json({ status: "ok" })
  }
  catch(error){
    console.log(error)
   return res.status(401).json({code :'FAILURE' ,message:'URL NOT UPDATED'})
  }
}
else if(eventType==="call.recording_ready"){
  try{
    const meetingId = event?.call_cid?.split(":")[1];
    const recording_url = event.call_recording.url;
    console.log("recording url ---",recording_url);
    await Meeting.findOneAndUpdate({_id:meetingId},{recording_url:recording_url},{new:true})
    res.status(200).json({ status: "ok" })
  }
  catch(error){
    console.log(error)
    return res.status(401).json({code :'FAILURE RECORDING URL' ,message:'URL NOT UPDATED'})
  }
}
}
catch (error) {
  console.error("Error:", error);
}
  })

  app.use(async (req,res,next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({code: 'TOKEN_MISSING', message: 'Unauthorized - No token provided'});
    }
  
    const token = authHeader.split(' ')[1];  // splitting the token with Bearer (removing bearer)
  
    try {
      const payload = await verifyToken(token,{secretKey: process.env.CLERK_SECRET_KEY});
      req.userId = payload.sub; 
      next();
    } catch (err) {
       if(err.reason === 'token-expired'){
        return res.status(401).json({code: 'TOKEN_EXPIRED', message: 'Token is expired'});
       }
    
        return res.status(401).json({code:'TOKEN_INVALID', message: 'Unauthorized - Invalid token' });
    }
  
  })

// GET MEETINGS from DB  >>

app.get("/meetings",async(req,res)=>{
    try {
        const userId = req.userId;
        const meetings= await Meeting.find({userId: userId}).populate('agent').exec()
        res.json({status:200,message:"meetings fetched successfully",data:meetings})
    }
        catch(error){
            console.log(error)
            res.status(500).json({status:500,message:'Failure'})
        }
    
})

app.get("/meetings/:id",async(req,res)=>{
  try {
      const userId = req.userId;
      const meetingId = req.params.id
      const meeting= await Meeting.findOne({_id: meetingId, userId: userId})
      res.json({status:200,message:"meeting fetched successfully",data:meeting})
  }
      catch(error){
          console.log(error)
          res.status(500).json({status:500,message:'Failure'})
      }
  
})

//  NEW MEETING to DB >>
app.post("/meetings",async(req,res)=>{
    const{name,agentName}=req.body
    const userId = req.userId;
    try{
        const foundAgent = await Agent.findOne({name: agentName, userId})
        if(!foundAgent){
            res.status(400).json({status: 400, message: "Agent not found"})
        }
        const meetings = await Meeting.create({name,agent: foundAgent._id,userId: userId})
        res.status(200).json({status:200,message:"success",data: meetings})
        }
        catch(error){
            res.status(500).json({status: 500, message: "Failure"})
        }
})

// UPDATE MEETING IN DATABASE >>>>>>>
app.patch("/meetings",async(req,res)=>{
  const {status,meetingId}= req.body
  const userId = req.userId; // this is coming from middleware
  try {
    const updatedMeeting = await Meeting.findOneAndUpdate({_id: meetingId,userId: userId},{status:status},{new: true})
    res.status(200).json({status:200,message:"success",data: updatedMeeting})
  }
  catch(error){
    res.status(500).json({status: 500, message: "Failure"})
}
})

// GET THE AGENT FROM ThE DATABASE  >>

app.get("/agents",async(req,res)=>{
    try{
        const userId = req.userId;
    const agents= await Agent.find({userId: userId})
    res.status(200).json({status:200,message:"agents fetched successfully",data:agents})
    }
    catch(error){
    res.status(500).json({status: 500, message: "Failure"})
    }
})

// DELETE THE MEETING >>

app.delete("/meetings/:id",async(req,res)=>{
    try{       
        const meetingId = req.params.id
        const userId = req.userId;
        const result =await Meeting.findOneAndDelete({_id: meetingId, userId: userId})
       res.json({status:200,message:"deleted successfully",data:result})
    }
    catch(error){
        res.status(500).json({status:500, message:"Not Deleted"})
    }
})

app.post("/join-call", async (req, res) => {

  const { callId , id, name, image} = req.body;
  const userId = req.userId

  if (!callId) {
    return res.status(400).json({ error: "callId is required" });
  }
  try {
  const user = {
    id,
    name,
    image,
    role: "admin"
  };
  await client.upsertUsers([user])
  const token = client.generateUserToken({user_id: user.id})
  
const call = client.video.call("default", callId);

// STREAM SDK >>>
const streamCall = await call.getOrCreate({
  data:{
    created_by_id: user.id,
    custom: {
    meetingId: callId
    },
    settings_override: {
      transcription: {
        language: "en",
        mode: "auto-on",
        closed_caption_mode: "auto-on",
      },
      recording: {
        mode: "auto-on",
        quality: "720p",
      },
    },
  }
})
const meeting = await Meeting.findOne({_id:callId,userId:userId}).populate('agent').exec()
const agent = meeting.agent


await client.upsertUsers([
  {
    id: agent._id,
    name: agent.name,
    role: "admin",
    image: "https://img.freepik.com/free-psd/cute-3d-robot-waving-hand-cartoon-vector-icon-illustration-people-technology-isolated-flat-vector_138676-10649.jpg?t=st=1764876119~exp=1764879719~hmac=f3f9744f04cee1be1ff77c66210f7dbb4248ae2705e46a58c3535124fecab3dd&w=2000"
  },
])

    res.json({ success: true, token,call: streamCall.call, message: "User joined successfully" });
  } catch (error) {
    console.error("Error in AI join:", error);
    res.status(500).json({ error: "Failed to join AI Agent." });
  }
});



// CREATE NEW AGENT in database save >>>
app.post("/agents",async (req,res)=>{
    const {avatar,name,instructions}  = req.body
    const userId = req.userId;
   
    try{
    const agent = await Agent.create({avatar,name,instructions, userId: userId})
    res.json({status:200,message:"success",data: agent})
    
    }
    catch(error){
        res.json({status: 500, message: "Failure"})
    }
})


// GEMINI AI >>>>

app.post('/generate-response', async (req, res) => {
    const { prompt } = req.body;
  
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent",
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          params: { key: process.env.GOOGLE_GENERATIVE_AI_API_KEY}
        }
      );
  
      const reply = response.data.candidates[0].content.parts[0].text;
      res.json({ reply });
  
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({ error: "Gemini API error" });
    }
  });

  const serverless = require('serverless-http');
  module.exports = serverless(app);



