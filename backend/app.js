const express=require('express')
const cors = require('cors')
const app=express();
app.use(cors())
app.use(express.json())
app.get("/hello",(req,res)=>{
    res.json({status:200,message:"hello"})
})

app.post("/agents",(req,res)=>{
    console.log(req.body)
    res.json({status:200,message:"success"})
})
app.listen(5000,()=>{
    console.log("SERVER STARTED");
})