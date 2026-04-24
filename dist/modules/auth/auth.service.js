"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("../../common");
const emailTemp_1 = require("../../common/utils/emailTemp");
const otp_1 = require("../../common/utils/otp");
const sendEmail_1 = require("../../common/utils/sendEmail");
const DB_1 = require("../../DB");
const bcrypt_1 = require("bcrypt");
const node_crypto_1 = require("node:crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() { }
    generateOtpAndSendEmail = async (email) => {
        if (await (0, DB_1.TTL)(`OTP::User::blocked2::${email}`) > 0) {
            throw new Error("you are already blocked", { cause: { status: 409 } });
        }
        const cmo = Number(await (0, DB_1.get1)(`otp:max:req:2${email}`));
        if (cmo >= 5) {
            await (0, DB_1.set)({
                key: `OTP::User::blocked2::${email}`,
                val: 0,
                ttl: 300
            });
            throw new Error("you are blocked", { cause: { status: 409 } });
        }
        const code = `${(0, otp_1.createNumberOtp)()}`;
        const hashedCode = await (0, bcrypt_1.hash)(code, 8);
        await (0, DB_1.set)({ key: `OTP::User::2${email}`, val: `${hashedCode}`, ttl: 120 });
        cmo > 0 ? await (0, DB_1.inc)(`otp:max:req:2${email}`) : await (0, DB_1.set)({ key: `otp:max:req:2${email}`, val: 1, ttl: 300 });
        await (0, sendEmail_1.sendEmail)(email, "confirm-email", (0, emailTemp_1.funcs)(code));
    };
    login = async (data) => {
        const { email, password } = data;
        const gettings = (Number(await (0, DB_1.get1)(`wrongPAssword2${email}`))) || 0;
        const blockedTTL = Number(await (0, DB_1.TTL)(`blockedwrongPAssword2${email}`));
        if (blockedTTL > 0) {
            throw new common_1.notFoundException(`you are blocked for${blockedTTL}`);
        }
        if (gettings >= 4) {
            await (0, DB_1.set)({
                key: `blockedwrongPAssword2${email}`,
                val: 1,
                ttl: 300
            });
        }
        const user = await DB_1.userModel.findOne({ email, provider: "system", confirmEmail: { $exists: true } });
        if (!user)
            throw new common_1.notFoundException("invalid email or password");
        const wrongPassword = !(await (0, bcrypt_1.compare)(password, user.password));
        if (wrongPassword) {
            gettings > 0 ? await (0, DB_1.inc)(`wrongPAssword2${email}`) : await (0, DB_1.set)({ key: `wrongPAssword2${email}`, val: 1, ttl: 300 });
            throw new common_1.notFoundException("invalid email or password");
        }
        const jwtid = (0, node_crypto_1.randomUUID)();
        const token = jsonwebtoken_1.default.sign({ id: user._id, email }, "JWT_SECRET", { expiresIn: "15m", jwtid });
        const refreshToken = jsonwebtoken_1.default.sign({ sub: user.id }, "REFRESH_SECRET", { expiresIn: "7d", jwtid });
        await (0, DB_1.delete1)(`wrongPAssword2${email}`);
        return { token, refreshToken };
    };
    signup = async (data) => {
        const { email, password, username, gender } = data;
        const found = await DB_1.userModel.findOne({ email });
        if (found)
            throw new common_1.conflictException("user already exists");
        const hashed = await (0, bcrypt_1.hash)(password, 8);
        const user = await DB_1.userModel.create({ email, password: (hashed), gender, username });
        await this.generateOtpAndSendEmail(email);
        return {
            email: user.email,
            username: user.username,
            gender: user.gender
        };
    };
    confirmEmail = async (data) => {
        const { email, otp } = data;
        let user1 = await DB_1.userModel.findOne({ email, confirmEmail: { $exists: false }, provider: "system" });
        if (!user1)
            throw new common_1.notFoundException("user not found");
        const hasshedOTP = await (0, DB_1.get1)(`OTP::User::2${email}`);
        if (!hasshedOTP) {
            throw new common_1.notFoundException("OTP not found");
        }
        if (!await (0, bcrypt_1.compare)(otp, hasshedOTP)) {
            throw new common_1.BadRequestException("OTP is not correct");
        }
        user1.confirmEmail = new Date();
        await user1.save();
        await DB_1.userModel.updateOne({ email }, { $unset: { verificationExpires: 1 } });
        await (0, DB_1.delete1)(`OTP::User::2${email}`);
        await (0, DB_1.delete1)(`OTP::User::blocked2::${email}`);
        await (0, DB_1.delete1)(`otp:max:req:2${email}`);
        return {
            email
        };
    };
    reSendConfirmEmail = async (data) => {
        const { email } = data;
        let user1 = await DB_1.userModel.findOne({ email, confirmEmail: { $exists: false }, provider: "system" });
        if (!user1)
            throw new common_1.notFoundException("user not found");
        if (await (0, DB_1.TTL)(`OTP::User::2${email}`) > 0) {
            throw new common_1.conflictException("enta aslan m3ak otp");
        }
        this.generateOtpAndSendEmail(email);
        return {
            email
        };
    };
    forgetPassword = (data) => {
        const { email } = data;
        this.generateOtpAndSendEmail(email);
    };
    forgetPasswordOTP = async (data) => {
        const { email, password, otp } = data;
        const hashedOtp = await (0, DB_1.get1)(`OTP::User::2${email}`);
        if (!hashedOtp) {
            throw new common_1.notFoundException("OTP not found");
        }
        const match = await (0, bcrypt_1.compare)(otp, hashedOtp);
        if (!match) {
            throw new common_1.BadRequestException("OTP is not correct");
        }
        const user = await DB_1.userModel.findOne({ email, confirmEmail: { $exists: true }, provider: "system" });
        if (!user) {
            throw new common_1.notFoundException("user not found");
        }
        const hashedPassword = await (0, bcrypt_1.hash)(password, 8);
        user.password = hashedPassword;
        await user.save();
        await (0, DB_1.delete1)(`OTP::User::2${email}`);
        await (0, DB_1.delete1)(`OTP::User::blocked2::${email}`);
        await (0, DB_1.delete1)(`otp:max:req:2${email}`);
    };
}
exports.AuthService = AuthService;
exports.default = new AuthService();
