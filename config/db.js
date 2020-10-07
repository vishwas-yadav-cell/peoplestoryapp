require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() {
    mongoose.connect(process.env.MONGO_URL,{
        useUnifiedTopology:true,
        useNewUrlParser:true,
        useFindAndModify:false
    });

    const connection = mongoose.connection;

    connection.once('open',()=>{
        console.log('MongoDB Connected: '+connection.host);
    }).catch(err => {
        console.log('Error.');
    });
}

module.exports = connectDB;