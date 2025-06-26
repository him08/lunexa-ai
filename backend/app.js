require('dotenv').config()
const express=require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const Agent = require('./models/Agent');
const Meeting = require('./models/Meeting');
const axios = require('axios');
const app=express();
// FOR CORS POLICY 
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('DATABASE Connected!'))
  .catch(() => process.exit(1))


// GET MEETINGS from DB  >>

app.get("/meetings",async(req,res)=>{
    try {
        const meetings= await Meeting.find({}).populate('agent').exec()
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
    try{
        const foundAgent = await Agent.findOne({name: agentName})
        if(!foundAgent){
            res.json({status: 400, message: "Agent not found"})
        }
        const meetings = await Meeting.create({name,agent: foundAgent._id})
        res.json({status:200,message:"success",data: meetings})
        }
        catch(error){
            res.status(500).json({status: 500, message: "Failure"})
        }
})

// GET THE AGENT FROM ThE DATABASE  >>

app.get("/agents",async(req,res)=>{
    try{
    const agents= await Agent.find({})
    res.json({status:200,message:"agents fetched successfully",data:agents})
    }
    catch(error){
    res.json({status: 500, message: "Failure"})
    }
})

// DELETE THE MEETING >>

app.delete("/meetings/:id",async(req,res)=>{
    try{       
        const meetingId = req.params.id
        const result =await Meeting.findByIdAndDelete(meetingId)
       res.json({status:200,message:"deleted successfully",data:result})
    }
    catch(error){
        res.json({status:500, message:"Not Deleted"})
    }
})

//GET THE MEETING DETAILS >>>




// CREATE NEW AGENT in database save >>>
app.post("/agents",async (req,res)=>{
    const {avatar,name,instructions}  = req.body
   
    try{
    const agent = await Agent.create({avatar,name,instructions})
    res.json({status:200,message:"success",data: agent})
    
    }
    catch(error){
        res.json({status: 500, message: "Failure"})
    }
})

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

app.listen(5000,()=>{
    console.log("SERVER STARTED");
})