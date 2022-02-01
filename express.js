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

app.post('/api/sendnotify', function(req, res) {
     try{
         let body  = req.body
         mail.serverChanMail(body.title,body.desp,body.to,"通知")
         res.send({body:200})
     }catch (e) {
        res.send({code:200,msg:"unknown error:"+e})
     }
});
app.post("/api/newComment",(req,resp)=>{
        try {
            let body = req.body
            console.log(body)
            mail.notice(body)
            resp.send({code:200})
        }catch (e) {
            resp.send({code:500,msg:"unknown error:"+e})
        }
    // let object = JSON.parse(req.body);
    // console.log(data)
    // //let comment = new Comment(JSON.parse(newMsg.data));
    // mail.notice(data)
});
app.listen(6000)