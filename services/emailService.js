
const nodemailer = require("nodemailer");

// module.exports = async ({ from, to, subject, text, html }) => {
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'ankitmb15@gmail.com', 
//           pass: 'ankit2@@5.'
//         }
//       });
      
//       var mailOptions = {
//         from,
//         to,
//         subject,
//         text,
//         html
//       };
      
//       transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });
// }



module.exports = async ({ from, to, subject, text, html }) => {
   try{
    console.log('email list')
    console.log(to)
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({      
        from: `inShare <${from}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
   }catch(error){
    console.log('email error')
    console.log(error)
   }
}
