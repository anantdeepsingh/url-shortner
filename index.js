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
    //  res.sendFile(path.join(__dirname, 'index.html'));
    res.render('index');
    
})
  
app.use("/",urlRoute);

// this feature may be used for the local host
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } },
        { new: true } // This option ensures that the updated document is returned
    );

    if (entry && entry.redirectURL) {
        res.redirect(entry.redirectURL);
    } else {
        // Handle the case when entry is null or redirectURL is not defined
        res.render('notfound')
    }
});
app.listen(PORT,() => console.log(`Server Started at PORT :${PORT}`));

