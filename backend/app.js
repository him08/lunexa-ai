require('dotenv').config()
const express=require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const Agent = require('./models/Agent');
const Meeting = require('./models/Meeting');
const { verifyToken } = require('@clerk/backend'); 
const { default: axiosClient } = require('../src/utilities/axiosConfig');
const { StreamClient } = require("@stream-io/node-sdk");
const app=express();
// FOR CORS POLICY 
app.use(cors())
app.use(express.json())

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const client = new StreamClient(apiKey, apiSecret);

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('DATABASE Connected!'))
  .catch(() => process.exit(1))


  app.use(async (req,res,next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({code: 'TOKEN_MISSING', message: 'Unauthorized - No token provided'});
    }
  
    const token = authHeader.split(' ')[1];
  
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
        const result =await Meeting.findOneAndDelete({meetingId: meetingId, userId: userId})
       res.json({status:200,message:"deleted successfully",data:result})
    }
    catch(error){
        res.status(500).json({status:500, message:"Not Deleted"})
    }
})

// app.get("/stream-token", (req, res) => {
//   const userId = req.query.userId;

//   if (!userId) {
//     return res.status(400).json({ error: "userId is required" });
//   }

//   const token = client.generateUserToken({user_id: userId});
//   res.json({ token });
// });

app.post("/join-call", async (req, res) => {

  const { callId , id, name, image} = req.body;

  if (!callId) {
    return res.status(400).json({ error: "callId is required" });
  }
  try {
  const user = {
    id,
    name,
    image: image,
    role: "admin"
  };
  await client.upsertUsers([user])
  const token = client.generateUserToken({user_id: user.id})
  
const call = client.video.call("default", callId);
await call.create({
  data:{
    created_by_id: user.id,
    custom: {
    meetingId: callId
    },
    settings_override: {
      transcription: {
        language: 'en',
        mode: 'auto-on',
        closed_caption_mode: 'auto-on'
      },
      recording: {
        mode: 'auto-on',
        quality: '1080p'
      }
    }
  }
})
    res.json({ success: true, token, message: "User joined successfully" });
  } catch (error) {
    console.error("Error in AI join:", error);
    res.status(500).json({ error: "Failed to join AI Agent." });
  }
});

app.post("/join-ai", async (req, res) => {

  const { callId} = req.body;

  if (!callId) {
    return res.status(400).json({ error: "callId is required" });
  }
  const call = client.video.call("default", callId);
  try {
    const realtimeClient = await client.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPEN_AI_API_KEY,
      agentUserId: "agent_Robo",
      // model: "gpt-4o-realtime-preview",
    });
    realtimeClient.updateSession({ voice: "alloy" });
    realtimeClient.updateSession({
      instructions:
        "You are a helpful assistant that can answer questions and help with tasks.",
    });
    res.json({ success: true, message: "AI joined successfully" });
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
      const response = await axiosClient.post(
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

app.listen(5000,()=>{
    console.log("SERVER STARTED");
})