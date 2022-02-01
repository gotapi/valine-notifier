#!/usr/bin/env node
const {Direction, MessageBus, SocketBus} = require( "node-gotapi-ws");
const channel = "/pushmail/notifier/hpq1SCEJulwBRQy0u8fnhX0Y"
require('dotenv').config();
const mail = require(  "./utilities/send-mail")
const wsHost = "ws.gotapi.net"
let socketBus = new SocketBus(`wss://${wsHost}${channel}`);
let messageBus = new MessageBus(Direction.Customer, socketBus, `https://${wsHost}/__/history/`,
    `${channel}`, 1, 0)
//设置一个回调，在有新消息到达时，会被触发。

 messageBus.setNewMessageCallback(
     (newMsg, uuid) => {
         //console.log("new msg arrived")
         let data = JSON.parse(newMsg.data);
         console.log(data)
         //let comment = new Comment(JSON.parse(newMsg.data));
         mail.notice(data)
     }
 );
