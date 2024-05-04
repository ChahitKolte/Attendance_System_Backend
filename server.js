const express = require('express');
const dotenv  =require('dotenv');
const connectDB = require('./config/db');
dotenv.config({path: './config/config.env'});

const app = express();
app.use(express.json());
const bootcamps = require('./routes/bootcamp');
const course= require('./routes/course');
app.use('/api/v1/bootcamp',bootcamps);
app.use('/api/v1/course',course);
const PORT = process.env.PORT || 3000;

const start = async () => {
    try{
        app.listen(PORT,() => {
            console.log(`Server listening on ${PORT}`);
        });
        await connectDB(process.env.MONGO_URL);
    }catch(err){
        console.log(err);
    }
};

start();