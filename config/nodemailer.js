import nodemailer from 'nodemailer';
import {EMAIL_PASSWORD} from "./env.js";

export const  accountEmail = 'londekablessing5@gmail.com';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
})
transporter.verify((err, success) => {
    if (err) {
        console.error('✉️ SMTP connection failed:', err);
    } else {
        console.log('✉️ SMTP ready to send messages');
    }
});


export default transporter;