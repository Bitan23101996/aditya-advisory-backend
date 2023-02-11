var express = require('express');
// var bodyParser = require('body-parser')// importing body parser middleware to parse form content from HTML
var cors = require('./../cors');
const emailRouter = express.Router();
var nodemailer = require('nodemailer');//importing node mailer
const details = require('./../details.json');

emailRouter.route('/')
  .options(cors.cors, (req, res) => {
    // console.log("Coming email here");
    res.sendStatus(200);
  })

  // route which captures form details and sends it to your personal mail
  .post(cors.cors, (req, res, next) => {

    // console.log("oooo",req.body.email)
    /*Transport service is used by node mailer to send emails, it takes service and auth object as parameters.
      here we are using gmail as our service 
      In Auth object , we specify our email and password
    */
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: details.email,
        pass: details.password
      }
    });

    /*
      In mail options we specify from and to address, subject and HTML content.
      In our case , we use our personal email as from and to address,
      Subject is Contact name and 
      html is our form details which we parsed using bodyParser.
    */
    var mailOptions = {
      from: "",//replace with your email
      to: '',//replace with your email
      subject: `Enquiry request received`,
      html: `Hello <strong>Mr. Aditya </strong>, 
      you just received an email from <strong>${req.body.name} </strong> regarding an enquiry of a service. <br/><br/>
      <center>
        <table border="1" cellspacing="0" cellpadding="0" align="left">
        <thead>
          <tr>
            <th>Name<th>
            <th>Email<th>
            <th>Mobile<th>
            <th>Enuiry<th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${req.body.name} </strong><td>
            <td><strong><a href="mailto:${req.body.email}">${req.body.email}</a></strong><td>
            <td><strong><a href="tel:${req.body.mobile}">${req.body.mobile}</a></strong><td>
            <td>${req.body.message}<td>
          </tr>
        </tbody>
        </table>
      </center>
    `
    };

    /* Here comes the important part, sendMail is the method which actually sends email, it takes mail options and
     call back as parameter 
    */

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // res.send('error') // if error occurs send error as response to client
        res.status(500).send({ isError: true, message: 'Failed to send enuiry. Try to connect with another way with us.' });
      } else {
        res.status(200).send({ isError: false, message: 'Enquiry sent successfully' });
        // res.send('Sent Successfully')//if mail is sent successfully send Sent successfully as response
      }
    });
  })


module.exports = emailRouter;