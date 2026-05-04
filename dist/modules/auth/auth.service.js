"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("../../common");
const emailTemp_1 = require("../../common/utils/emailTemp");
const otp_1 = require("../../common/utils/otp");
const sendEmail_1 = require("../../common/utils/sendEmail");
const DB_1 = require("../../DB");
const bcrypt_1 = require("bcrypt");
const cofig_env_1 = require("../../.env/cofig.env");
const repo_1 = require("../../DB/model/repo");
const enums_1 = require("../../common/enums");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const token_1 = require("../../common/utils/token");
class AuthService {
    userRepo;
    constructor() {
        this.userRepo = new repo_1.DBrepo(DB_1.userModel);
    }
    generateOtpAndSendEmail = async (email) => {
        if (await (0, DB_1.TTL)((0, auth_middleware_1.tokenNameInRedis)("UB1", email)) > 0) {
            throw new Error("you are already blocked", { cause: { status: 409 } });
        }
        const cmo = Number(await (0, DB_1.get1)((0, auth_middleware_1.tokenNameInRedis)("OTPMax1", email)));
        if (cmo >= 5) {
            await (0, DB_1.set)({
                key: (0, auth_middleware_1.tokenNameInRedis)("UB1", email),
                val: 0,
                ttl: 300
            });
            throw new Error("you are blocked", { cause: { status: 409 } });
        }
        const code = `${(0, otp_1.createNumberOtp)()}`;
        const hashedCode = await (0, bcrypt_1.hash)(code, cofig_env_1.HASH_ROUND);
        await (0, DB_1.set)({ key: (0, auth_middleware_1.tokenNameInRedis)("OTP1", email), val: hashedCode, ttl: 120 });
        cmo > 0 ? await (0, DB_1.inc)((0, auth_middleware_1.tokenNameInRedis)("OTPMax1", email)) : await (0, DB_1.set)({ key: (0, auth_middleware_1.tokenNameInRedis)("OTPMax1", email), val: 1, ttl: 300 });
        await (0, sendEmail_1.sendEmail)(email, "confirm-email", (0, emailTemp_1.funcs)(code));
    };
    login = async (data) => {
        const { email, password } = data;
        const gettings = (Number(await (0, DB_1.get1)((0, auth_middleware_1.tokenNameInRedis)("WrongPassword1", email)))) || 0;
        const blockedTTL = Number(await (0, DB_1.TTL)((0, auth_middleware_1.tokenNameInRedis)("BlockedUser1", email)));
        if (blockedTTL > 0) {
            throw new common_1.notFoundException(`you are blocked for${blockedTTL}`);
        }
        if (gettings >= 4) {
            await (0, DB_1.set)({
                key: (0, auth_middleware_1.tokenNameInRedis)("BlockedUser1", email),
                val: 1,
                ttl: 300
            });
            await (0, DB_1.delete1)((0, auth_middleware_1.tokenNameInRedis)("WrongPassword1", email));
        }
        const user = await this.userRepo.findOneM({ data: { email, provider: enums_1.ProviderEnum.system, confirmEmail: { $exists: true } }, projection: {} });
        if (!user)
            throw new common_1.notFoundException("invalid email or password");
        const wrongPassword = !(await (0, bcrypt_1.compare)(password, user.password));
        if (wrongPassword) {
            gettings > 0 ? await (0, DB_1.inc)((0, auth_middleware_1.tokenNameInRedis)("WrongPassword1", email)) : await (0, DB_1.set)({ key: (0, auth_middleware_1.tokenNameInRedis)("WrongPassword1", email), val: 1, ttl: 300 });
            throw new common_1.notFoundException("invalid email or password");
        }
        const token = (0, token_1.tokenSign)({ id: user._id, email }, cofig_env_1.JWT_SECRET, cofig_env_1.tokenexpires);
        const refreshToken = (0, token_1.tokenSign)({ sub: user.id }, cofig_env_1.REFRESH_SECRET, cofig_env_1.REFRESH_SECRETtokenexpires);
        await (0, DB_1.delete1)((0, auth_middleware_1.tokenNameInRedis)("WrongPassword1", email));
        return { token, refreshToken };
    };
    signup = async (data) => {
        const { email, password, username, gender } = data;
        const found = await this.userRepo.findOneM({ data: { email }, projection: {} });
        if (found)
            throw new common_1.conflictException("user already exists");
        const hashed = await (0, bcrypt_1.hash)(password, cofig_env_1.HASH_ROUND);
        const genderValue = gender === "female" ? enums_1.GenderEnum.female : enums_1.GenderEnum.male;
        const user = await this.userRepo.create({
            data: { username, email, password: hashed, provider: enums_1.ProviderEnum.system, gender: genderValue }
        });
        await this.generateOtpAndSendEmail(email);
        return {
            email: user.email,
            username: user.username,
            gender: user.gender,
            id: user._id
        };
    };
    confirmEmail = async (data) => {
        const { email, otp } = data;
        let user1 = await this.userRepo.findOneM({ data: { email, confirmEmail: { $exists: false }, provider: enums_1.ProviderEnum.system }, projection: {} });
        if (!user1)
            throw new common_1.notFoundException("user not found");
        const hasshedOTP = await (0, DB_1.get1)((0, auth_middleware_1.tokenNameInRedis)("OTP1", email));
        if (!hasshedOTP) {
            throw new common_1.notFoundException("OTP not found");
        }
        if (!await (0, bcrypt_1.compare)(otp, hasshedOTP)) {
            throw new common_1.BadRequestException("OTP is not correct");
        }
        user1.confirmEmail = new Date();
        await user1.save();
        await this.userRepo.update({
            filter: { email },
            update: { $unset: { verificationExpires: 1 } }
        });
        await (0, DB_1.delete1)((0, auth_middleware_1.tokenNameInRedis)("OTP1", email));
        await (0, DB_1.delete1)((0, auth_middleware_1.tokenNameInRedis)("UB1", email));
        await (0, DB_1.delete1)((0, auth_middleware_1.tokenNameInRedis)("OTPMax1", email));
    };
    reSendConfirmEmail = async (data) => {
        const { email } = data;
        let user1 = await this.userRepo.findOneM({ data: { email, confirmEmail: { $exists: false }, provider: enums_1.ProviderEnum.system }, projection: {} });
        if (!user1)
            throw new common_1.notFoundException("user not found");
        if (await (0, DB_1.TTL)((0, auth_middleware_1.tokenNameInRedis)("OTP1", email)) > 0) {
            throw new common_1.conflictException("enta aslan m3ak otp");
        }
        this.generateOtpAndSendEmail(email);
    };
    forgetPassword = async (data) => {
        const { email } = data;
        await this.generateOtpAndSendEmail(email);
    };
    forgetPasswordOTP = async (data) => {
        const { email, password, otp } = data;
        const hashedOtp = await (0, DB_1.get1)((0, auth_middleware_1.tokenNameInRedis)("OTP1", email));
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
        await (0, DB_1.delete1)((0, auth_middleware_1.tokenNameInRedis)("OTP1", email));
        await (0, DB_1.delete1)((0, auth_middleware_1.tokenNameInRedis)("UB1", email));
        await (0, DB_1.delete1)((0, auth_middleware_1.tokenNameInRedis)("OTPMax1", email));
    };
}
exports.AuthService = AuthService;
exports.default = new AuthService();
