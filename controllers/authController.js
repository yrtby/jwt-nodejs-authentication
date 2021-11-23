const User = require('../models/User');
const Confirmation = require('../models/Confirmation');

const extensions = require('../modules/extensions');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { ENV_JWT_TOKEN_KEY, ENV_JWT_EXPIRED_TIME } = process.env;

// User Create
exports.create = async (req,res)=>{
    try{
        // Get inputs on req.body
        const {first_name, last_name, email, password} = req.body;
            
        // Check inputs
        if(!(first_name && last_name && email && password)){
            return res.status(400).json({
                status:'fail',
                message:'all inputs are required'
            });
        }

        // If all inputs exist, check user on collections
        const existingUser = await User.findOne({email: email});

        if(existingUser){
            return res.status(409).json({
                status:'fail',
                message:'user already exists'
            });
        }

        // Encrypt input password
        encryptedPassword = await bcrypt.hash(password,10);

        // Create user
        const user = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email.toLowerCase(),
            password: encryptedPassword
        });

        // Create confirmation token
        let confirmationToken = extensions.makeToken(90);

        // Include collection
        await Confirmation.create({
            user: user._id,
            token: confirmationToken
        });

        // Send activation mail
        extensions.activationMailSender(first_name, last_name, email, confirmationToken);

        // return success message
        return res.status(201).json({
            status:'success',
            message:'user created, check your email for activation'
        });
    }
    catch(error){
        return res.status(400).json({
            status:'fail',
            message: error
        });
    }
}

// User Activate
exports.activate = async (req,res)=>{
    try{
        // Get inputs on req.query
        const { token } = req.query;
        // Check inputs
        if(!token){
            return res.status(400).json({
                status:'fail',
                message:'all inputs are required'
            });
        }

        // If input exist, check confirmation token on collections
        const activation = await Confirmation.findOne({token: token}).sort('-createdAt');
        const user = await User.findOne({_id:activation.user});

        // Check user enabled
        if(user.enabled){
            return res.status(400).json({
                status:'fail',
                message:'this user already active'
            })
        }

        // If the token has a confirmation date
        if(activation.confirmedAt){
            return res.status(409).json({
                status:'fail',
                message:'account already confirmed'
            });
        }

        // If the token has not
        if(!activation){
            return res.status(409).json({
                status:'fail',
                message:'token not found, please request token again'
            });
        }

        // If the current date is greater than the token expired date
        if(Date.now()>activation.expiredAt){
            return res.status(409).json({
                status:'fail',
                message:'token expired, please request token again'
            });
        }

        // check user on collections and enabled
        user.enabled = true;
        user.save();
        activation.confirmedAt = Date.now();
        activation.save();

        return res.status(200).json({
            status:'success',
            message:'activation success'
        });
    }
    catch(error){
        return res.status(400).json({
            status:'fail',
            message: error
        });
    }
}

// Re-send activation email
exports.resendActivation = async (req,res)=>{
    try{
        // Get inputs on req.body
        const { email } = req.body;

        // Check inputs
        if(!email){
            return res.status(400).json({
                status:'fail',
                message:'all inputs are required'
            });
        }

        // Find user
        const user = await User.findOne({email: email});

        // Check user, is not found, return message
        if(!user){
            return res.status(400).json({
                status:'fail',
                message:'user not found'
            });
        }

        // Check user status, is enabled, return message
        if(user.enabled){
            return res.status(400).json({
                status:'fail',
                message:'this user already active'
            });
        }

        // Old confirmation token delete
        await Confirmation.findOneAndRemove({user: user._id});

        // Create confirmation token
        let confirmationToken = extensions.makeToken(90);

        // Include collection
        await Confirmation.create({
            user: user._id,
            token: confirmationToken
        });

        // Send activation mail
        extensions.activationMailSender(user.first_name, user.last_name, email, confirmationToken);

        // return success message
        return res.status(200).json({
            status:'success',
            message:'activation email has been sent again, check your email for activation'
        });
    }
    catch(error){
        return res.status(400).json({
            status:'fail',
            message: error
        });
    }

}

// User Login
exports.login = async (req,res)=>{
    try{
        // Get inputs on req.body
        const {email, password} = req.body;

        // Check inputs
        if(!(email && password)){
            return res.status(400).json({
                status:'fail',
                message:'all inputs are required'
            });
        }
    
        // Find user
        const existingUser = await User.findOne({email: email});
    
        // Check user, is not found, return message
        if(!existingUser){
            return res.status(409).json({
                status:'fail',
                message:'user not found'
            });
        }
    
        // Check crypted password match
        const checkPassword = await bcrypt.compare(password, existingUser.password);
    
        // is not match, return message
        if(!checkPassword){
            return res.status(400).json({
                status:'fail',
                message:'password not match'
            });
        }
    
        // Check user, is not enabled, return message
        if(!existingUser.enabled){
            return res.status(400).json({
                status:'fail',
                message:'user need activation'
            });
        }
    
        // Create JWT token
        const token = jwt.sign(
            { user_id: existingUser._id, email},
            ENV_JWT_TOKEN_KEY,
            { expiresIn: ENV_JWT_EXPIRED_TIME}
        );
    
        // Return success message and token
        return res.status(200).json({
            status:'success',
            message:'login success',
            token
        });
    }
    catch(error){
        return res.status(400).json({
            status:'fail',
            message: error
        })
    }
}

