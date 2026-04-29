"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const cofig_env_1 = require("../../.env/cofig.env");
const sendEmail = async (to, subjext, html, cc, bcc, attachments = []) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: cofig_env_1.EMAILY,
            pass: cofig_env_1.PASSWORDY
        },
    });
    const info = await transporter.sendMail({
        to, attachments, html,
        from: `${"MY_FIRST_PROJECT"} <${cofig_env_1.EMAILY}>`,
    });
    console.log("Message sent:", info.messageId);
};
exports.sendEmail = sendEmail;
