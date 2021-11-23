const User = require('../models/User');
const jwt = require('jsonwebtoken');

const { ENV_JWT_TOKEN_KEY } = process.env;

module.exports = async (req,res,next)=>{

    const authHeader = req.headers['authorization'];
    //const authHeader = req.body.token || req.query.token || req.headers["x-access-token"]; 
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status:"fail",
            message:"a token is required for authentication"
        });
    }

    try{
        const decode = jwt.verify(token, ENV_JWT_TOKEN_KEY);
        const user = await User.findById(decode.user_id);
        let userArr = {
            "id":user._id,
            "email":user.email
        };
        req.user = userArr;
    }
    catch(error){
        return res.status(401).json({
            status:"fail",
            message:"invalid token"
        });
    }

    return next();
};