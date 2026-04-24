import nodemailer from "nodemailer"; 

export const sendEmail = async (to:string,subjext:string,html:string, cc?:null, bcc?:null, attachments = []) => {

    // Create a transporter using Ethereal test credentials.
    // For production, replace with your actual SMTP server details.
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "asemmido0550@gmail.com",
            pass: "jjfryixijogidtsh"
        },
    });

    // Send an email using async/await

    const info = await transporter.sendMail({
        to,  attachments, html,
        from: `${"MY_FIRST_PROJECT"} <${"asemmido0550@gmail.com"}>`,

    });

    console.log("Message sent:", info.messageId);

}