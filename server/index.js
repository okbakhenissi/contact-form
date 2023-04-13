require('dotenv').config();
const express = require('express');
const cors = require('cors');
const request = require('request');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

const PORT = 3000;

app.get('/', function(req, res) {
  res.status(200).json({message : 'Welcome to our server'});
})

app.post('/send-email', async function(req, res) {
  try {
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail = {
      to: [{
          email: 'codeazur23@gmail.com',
          name: 'Okba KHENISSI'
      }],
      templateId: 1,
      params: {
          name: req.body.name,
          email:req.body.email,
          message: req.body.message
      },
      headers: {
          'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
      }
    };
    // send the email to an email service provider
    const emailResponse = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log(emailResponse);
    res.status(200).json({message : 'your email has been sent'});
  } catch(error) {
    console.log(error);
    res.status(500).json({message : 'your email has not been sent'});
  }
})

app.post('/verify', async function(req, res){
  try {
    console.log(process.env.CAPTCHA_KEY)
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_KEY}&response=${req.body.token}&remoteip=${req.socket.remoteAddress}`;
    request(url, (error, response, body) => {
      if(error) {
        console.log(error);
        res.status(400).json({success : false});
      } else {
        const responseBody = JSON.parse(body);
        res.status(200).json({success : true, score : responseBody.score});
      }
    })
  } catch(error) {
    console.log(error);
    res.status(400).json({success : false});
  }
  
})

app.listen(PORT, function(){
  console.log('The server is running on port 3000');
});