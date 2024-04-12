const db=require('../models/url');
require('dotenv').config();

const shortid =require("shortid");
const URL= require('../models/url');
require('dotenv').config();
async function handleGenerateNewShortURL(req,res){
   console.log(req.body);
   const url=req.body.url;
   if(!url){
    return res.status(400).json({error:'Url is required'});
   }
//    const db = process.env.DB_NAME; 
   const urlExists = await db.findOne({ redirectURL: url });

    if (urlExists) {
        // URL exists in the database
        console.log('URL already exists:', urlExists);
        // Handle the case where the URL exists, such as returning the existing short ID
        return res.render('index',{
            short_url : `${req.headers.host}/${urlExists.shortId}`
        })
    }
  else{
    const shortID=shortid();
    await URL.create({
        shortId: shortID,
        redirectURL:url,
        visitHistory:[],
    });
    return res.render('index',{
        short_url : `${req.headers.host}/${shortID}`
    });
  }

}
async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result= await URL.findOne({shortId});
    return res.json({totalClicks: result.visitHistory.length,analytics:result.visitHistory});
}
module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics,
}