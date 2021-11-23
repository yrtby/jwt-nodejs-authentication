require('dotenv').config();

const nodemailer = require('nodemailer');

const {ENV_DOMAIN, ENV_PORT, ENV_SMTP_HOST, ENV_SMTP_PORT, ENV_SMTP_SECURE, ENV_SENDER_MAIL_ADDRESS, ENV_SENDER_MAIL_PASSWORD} = process.env;

// Random token creator
exports.makeToken = (length)=>{
    var result           = [];
    var characters       = '0123456789qwertyuopilkjhgfdsazxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * 
        charactersLength)));
    }
    return result.join('');
}

// Activation mail sender
exports.activationMailSender = async (firstName,lastName,email,confirmationToken)=>{
    const outputMessage = `
    <h1> Message Details </h1>
    <ul>
        <li>Name: ${firstName} ${lastName}</li>
        <li>Email: ${email}</li>
    
    </ul>
    <h1>Message: </h1>
    <p>Activation link: http://${ENV_DOMAIN}:${ENV_PORT}/auth/activate?token=${confirmationToken}</p>
    `
    
    let transporter = nodemailer.createTransport({
        host: ENV_SMTP_HOST,
        port: ENV_SMTP_PORT,
        secure: ENV_SMTP_SECURE,
        auth: {
            user: ENV_SENDER_MAIL_ADDRESS,
            pass: ENV_SENDER_MAIL_PASSWORD,
        },
    });
    
    await transporter.sendMail({
        from: `"Rest API Activation 👻" <${ENV_SENDER_MAIL_ADDRESS}>`,
        to: email,
        subject: "Rest API New Message ✔",
        html: outputMessage
    });
}