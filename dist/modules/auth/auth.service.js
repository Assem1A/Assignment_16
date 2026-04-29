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
const cofig_env_1 = require("../../.env/cofig.env");
const repo_1 = require("../../DB/model/repo");
const enums_1 = require("../../common/enums");
class AuthService {
    userRepo;
    constructor() {
        this.userRepo = new repo_1.DBrepo(DB_1.userModel);
    }
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
        const hashedCode = await (0, bcrypt_1.hash)(code, cofig_env_1.HASH_ROUND);
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
        const user = await this.userRepo.findOneM({ data: { email, provider: enums_1.ProviderEnum.system, confirmEmail: { $exists: true } }, projection: {} });
        if (!user)
            throw new common_1.notFoundException("invalid email or password");
        const wrongPassword = !(await (0, bcrypt_1.compare)(password, user.password));
        if (wrongPassword) {
            gettings > 0 ? await (0, DB_1.inc)(`wrongPAssword2${email}`) : await (0, DB_1.set)({ key: `wrongPAssword2${email}`, val: 1, ttl: 300 });
            throw new common_1.notFoundException("invalid email or password");
        }
        const jwtid = (0, node_crypto_1.randomUUID)();
        const accessOptions = {
            expiresIn: cofig_env_1.tokenexpires,
            jwtid,
        };
        const refreshOptions = {
            expiresIn: cofig_env_1.REFRESH_SECRETtokenexpires,
            jwtid,
        };
        const token = jsonwebtoken_1.default.sign({ id: user._id, email }, cofig_env_1.JWT_SECRET, accessOptions);
        const refreshToken = jsonwebtoken_1.default.sign({ sub: user.id }, cofig_env_1.REFRESH_SECRET, refreshOptions);
        await (0, DB_1.delete1)(`wrongPAssword2${email}`);
        return { token, refreshToken };
    };
    signup = async (data) => {
        const { email, password, username, gender } = data;
        const found = await this.userRepo.findOneM({ data: { email }, projection: {} });
        if (found)
            throw new common_1.conflictException("user already exists");
        const hashed = await (0, bcrypt_1.hash)(password, cofig_env_1.HASH_ROUND);
        const genderValue = gender === "female" ? enums_1.GenderEnum.female : enums_1.GenderEnum.male;
        const user = await this.userRepo.create({ data: { username, email, password: hashed, provider: enums_1.ProviderEnum.system, gender: genderValue }
        });
        await this.generateOtpAndSendEmail(email);
        return {
            email: user.email,
            username: user.username,
            gender: user.gender
        };
    };
    confirmEmail = async (data) => {
        const { email, otp } = data;
        let user1 = await this.userRepo.findOneM({ data: { email, confirmEmail: { $exists: false }, provider: enums_1.ProviderEnum.system }, projection: {} });
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
        let user1 = await this.userRepo.findOneM({ data: { email, confirmEmail: { $exists: false }, provider: enums_1.ProviderEnum.system }, projection: {} });
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
        const user = await this.userRepo.findOneM({ data: { email, confirmEmail: { $exists: true }, provider: enums_1.ProviderEnum.system }, projection: {} });
        if (!user) {
            throw new common_1.notFoundException("user not found");
        }
        const hashedPassword = await (0, bcrypt_1.hash)(password, cofig_env_1.HASH_ROUND);
        user.password = hashedPassword;
        await user.save();
        await (0, DB_1.delete1)(`OTP::User::2${email}`);
        await (0, DB_1.delete1)(`OTP::User::blocked2::${email}`);
        await (0, DB_1.delete1)(`otp:max:req:2${email}`);
    };
}
exports.AuthService = AuthService;
exports.default = new AuthService();
