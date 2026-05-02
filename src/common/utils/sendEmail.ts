import nodemailer from "nodemailer"; 
import { EMAILY, PASSWORDY } from "../../.env/cofig.env";

export const sendEmail = async (to:string,subjext:string,html:string, cc?:null, bcc?:null, attachments = []):Promise<void> => {

    // Create a transporter using Ethereal test credentials.
    // For production, replace with your actual SMTP server details.
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:EMAILY  ,
            pass:PASSWORDY
        },
    });

    // Send an email using async/await

    const info = await transporter.sendMail({
        to,  attachments, html,
        from: `${"MY_FIRST_PROJECT"} <${EMAILY}>`,

    });

    console.log("Message sent:", info.messageId);

}