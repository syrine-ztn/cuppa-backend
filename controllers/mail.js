const Participant = require('../db/participant.js');
const Team = require('../db/team.js');
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

// notify the mail code   a modifier later ...
const contact = async (req, res) => {
     console.log('*******', req.body);
     console.log('*******', typeof req.body);
     //console.log(req);
     var transporter = nodemailer.createTransport({
          service: 'gmail',
          port: 465,
          secure: false, // true for 465, false for other ports

          auth: {
               user: 'hackadon.event@gmail.com', // generated ethereal user
               pass: 'hackadon', // generated ethereal password
          },
          tls: {
               rejectUnAuthorized: true,
          },
     });
     try {
          const { name, email, message, subject } = req.body;

          // Validate user input
          if (!(email && message && name && subject)) {
               console.log('All input is required');
               res.status(400).json({
                    status: false,
                    errorMessage: 'All inputs are required',
               });
               return;
          }

          var textBody = `FROM: ${name} EMAIL: ${email} MESSAGE: ${message}`;
          var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${name} <a href="mailto:${email}">${email}</a></p><p>${message}</p>`;
          await transporter.sendMail(
               {
                    from: process.env.email, // sender address
                    to: process.env.email, // list of receivers (THIS COULD BE A DIFFERENT ADDRESS or ADDRESSES SEPARATED BY COMMAS)
                    subject: 'Mail From Contact Form : ' + subject, // Subject line
                    text: textBody,
                    html: htmlBody,
               },
               (err, sec) => {
                    if (err) console.log(err);
                    else console.log('secuss');
               }
          );
          console.log('email sent  succsefly');

          res.status(200).json({
               status: true,
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({ status: false });
     }
};

const getLogin = (req, res) => {
     res.render('adminlogin');
};
const login = async (req, res) => {
     try {
          if (req.body.Username != 'esms2') {
               res.redirect('/login', {
                    message: 'no such admin with that name',
               });
               return;
          }
          const pass = 'esms2';
          const rp = req.body.Password == pass;

          if (rp) {
               req.session.logged = true;
               req.session.username = 'esms2';
               res.redirect('/users');
          } else {
               res.redirect('/login', { message: 'wrong password' });
          }
     } catch (error) {
          console.log(error);
          res.status(500).send(error);
     }
};

module.exports = {
     create,
     getAllUsers,
     getAllteams,
     login,
     getLogin,
     auth,
     contact,
};