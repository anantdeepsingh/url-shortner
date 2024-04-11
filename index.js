const express =require('express');
const mongoose = require('mongoose')
const path = require('path')
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

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.get('/', async (req, res, next) => {
    res.render('index')
})
  
app.use("/",urlRoute);
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

