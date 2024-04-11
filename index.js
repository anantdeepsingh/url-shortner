const express =require('express');
const mongoose = require('mongoose')
const{connectToMongoDB}=require('./connect');
require('dotenv').config();

const urlRoute=require("./routes/url");
const URL=require('./models/url');
const app=express();
const PORT=8001;
mongoose.connect(process.env.MONGO_URL,{
    dbName:process.env.DB_NAME
}).then (
    () => {
        console.log('Connected to Database');
    }
).catch(
    (err) => {
        console.log('Error connecting to database'+err);
    }
)

// 
app.use(express.json());

// 
app.use("/url",urlRoute);
app.get('/:shortId',async (req,res)=>{
    const shortId =req.params.shortId;
    const entry =await URL.findOneAndUpdate({
        shortId
    },{$push :{
        visitHistory:{
            timestamp:Date.now(),
        } ,
    }});
    res.redirect(entry.redirectURL);
});
app.listen(PORT,() => console.log(`Server Started at PORT :${PORT}`));

