const mongoose =require('mongoose');
require('dotenv').config();
mongoose.set("strictQuery",true);
async function connectToMongoDB(url){
    return mongoose.connect(url);
}
module.exports={
    connectToMongoDB
};