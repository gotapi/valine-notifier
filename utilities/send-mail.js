'use strict';
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs  = require('fs');
const path = require('path');

let config = {
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
}

if (process.env.SMTP_SERVICE != null) {
    config.service = process.env.SMTP_SERVICE;
} else {
    config.host = process.env.SMTP_HOST;
    config.port = parseInt(process.env.SMTP_PORT);
    config.secure = process.env.SMTP_SECURE === "false" ? false : true;
}
console.log(process.env)
console.log(config)
const transporter = nodemailer.createTransport(config);
let templateName = process.env.TEMPLATE_NAME ?  process.env.TEMPLATE_NAME : "default";
let noticeTemplate = ejs.compile(fs.readFileSync(path.resolve(process.cwd(), 'template', templateName, 'notice.ejs'), 'utf8'));

let commonTemplate = ejs.compile(fs.readFileSync(path.resolve(process.cwd(), 'template', templateName, 'common.ejs'), 'utf8'));

// 提醒站长
exports.serverChanMail = (title,content,toEmail,senderName) => {
    console.log("title:"+title)
    console.log("content:"+content)
    let mailSubject = title;
    let mailContent = commonTemplate({
        content:content
    })
    let mailOptions = {
        from: '"' + senderName + '" <' + process.env.SMTP_USER + '>',
        to: toEmail,
        subject: mailSubject,
        html: mailContent
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("smtp transport failed:");
            console.log(error);
            return console.log(error);
        }
    })

}
exports.notice = (comment) => {
    console.warn("notice called")
    console.log(comment)
    // 站长自己发的评论不需要通知
    if (comment.mail === process.env.TO_EMAIL
        || comment.mail === process.env.SMTP_USER) {
        console.log("自己的评论不需要邮件通知")
        //return;
    }

    console.log("38")
    let emailSubject = '👉 咚！「' + process.env.SITE_NAME + '」上有新评论了';
    let emailContent =  noticeTemplate({
                            siteName: process.env.SITE_NAME,
                            siteUrl: process.env.SITE_URL,
                            name: comment.nick,
                            text: comment.comment,
                            url: process.env.SITE_URL + comment.url
                        });

    let mailOptions = {
        from: '"' + process.env.SENDER_NAME + '" <' + process.env.SMTP_USER + '>',
        to: process.env.TO_EMAIL ? process.env.TO_EMAIL : process.env.SMTP_USER,
        subject: emailSubject,
        html: emailContent
    };
    console.log("mailOptions")
    console.log(mailOptions)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("收到一条评论, 已提醒站长");
    })
}

// 该方法可验证 SMTP 是否配置正确
exports.verify = function(){
    console.log("....");
    transporter.verify(function(error, success) {
        if (error) {
            console.log(error);
        }
        console.log("Server is ready to take our messages");
    });
};
