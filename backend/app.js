require('dotenv').config()
const express=require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const Agent = require('./models/Agent');
const Meeting = require('./models/Meeting');
const app=express();
// FOR CORS POLICY 
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('DATABASE Connected!'))
  .catch(() => process.exit(1))


// GET MEETINGS >>
app.get("/meetings",async(req,res)=>{
    try {
        const meetings= await Meeting.find({})
        res.json({status:200,message:"meetings fetched successfully",data:meetings})
    }
        catch(error){
            res.json({status:500,message:'Failure'})
        }
    
})

//  NEW MEETING DB >>
app.post("/meetings",async(req,res)=>{
    const{name,agent}=req.body
    try{
        const meetings = await Meeting.create({name,agent})
        res.json({status:200,message:"success",data: meetings})
        }
        catch(error){
            res.json({status: 500, message: "Failure"})
        }
})

// GET THE AGENT FROM TE DATABASE  >>

app.get("/agents",async(req,res)=>{
    try{
    const agents= await Agent.find({})
    res.json({status:200,message:"agents fetched successfully",data:agents})
    }
    catch(error){
    res.json({status: 500, message: "Failure"})
    }
})


// CREATE NEW AGENT in database save >>>
app.post("/agents",async (req,res)=>{
    const {name, instructions}  = req.body
    try{
    const agent = await Agent.create({name,instructions})
    res.json({status:200,message:"success",data: agent})
    }
    catch(error){
        res.json({status: 500, message: "Failure"})
    }
})

app.listen(5000,()=>{
    console.log("SERVER STARTED");
})