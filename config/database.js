const mongoose = require('mongoose');

const {ENV_CONNECTION_STRING} = process.env;

// DB Connection
exports.connect = ()=>{
    mongoose.connect(ENV_CONNECTION_STRING,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log("DB Connection Successfull");
    }).catch((err)=>{
        console.log(err);
    })
};