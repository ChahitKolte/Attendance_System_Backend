const express = require('express');
const dotenv   =require('dotenv');
dotenv.config({path: './config/config.env'});
const app = express();
const PORT = process.env.PORT || 3000;
console.log(process.env.NODE_ENV);
app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
