#!/usr/bin/env node

require('dotenv').config();
const mail = require(  "./utilities/send-mail")
const express =require( 'express')
const bodyParser =   require( "body-parser")
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/sendmail', function(req, res) {
     try{
         let body  = req.body
         mail.serverChanMail(body.title,body.desp,body.to,"通知")
         res.send({body:200})
     }catch (e) {
        res.send({code:200,msg:"unknown error:"+e})
     }
});
app.listen(6000)