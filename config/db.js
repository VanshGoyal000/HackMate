const mongoose = require('mongoose');
require('dotenv').config();
async function connectDb(){
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log("Monogo connected")
    } catch (error) {
        console.error("Error while connecting to db")
    }
}

module.exports = {connectDb}