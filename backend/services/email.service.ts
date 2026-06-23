import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    }
})


export const emailService = {
    async send({to,subject,body}:{to:string, subject:string, body:string}){
        await transporter.sendMail({
            from: `"Notification Engine" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #f5f5f5;">
                <div style="background: white; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #333;">${subject}</h2>
                    <p style="color: #666;">${body}</p>
                    <small style="color: #999;">Sent via Notification Engine</small>
                </div>
                </div>
            `
        })
    }
}