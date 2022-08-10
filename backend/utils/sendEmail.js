const nodeMailer = require("nodemailer");

// sendt message t uer for rest password
const sendEmail = async(options)=>{

const transporter = nodeMailer.createTransport({
    // if not working use below code
    //  host:process.env.SMPT_HOST,
    //  port:process.env.SMPT_PORT,
    service:process.env.SMPT_SERVICE,
    auth:{
        user:process.env.SMPT_MAIL,
        pass:peocess.env.SMPT_PASSWORD,
    }
});
const mailOptions ={
    from :process.env.SMPT_MAIL,
    to:options.emial,
    subject:options.subject,
    text:options.message
};
await transporter.sendMail(mailOptions)

};

module.exports= sendEmail;