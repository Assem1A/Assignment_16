"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const response_1 = require("../../common/response");
const auth_validation_1 = require("./auth.validation");
const common_1 = require("../../common");
const router = (0, express_1.Router)();
router.post('/signup', async (req, res, next) => {
    const result = await auth_validation_1.signupSchema.body.safeParseAsync(req.body);
    if (!result.success) {
        throw new common_1.BadRequestException("validation error", {
            cause: result.error.flatten(),
        });
    }
    const data = await auth_service_1.default.signup(req.body);
    return (0, response_1.successResponse)({
        res,
        message: "Account created successfully",
        status: 201,
        data
    });
});
router.patch("/confirm-Email", async (req, res, next) => {
    const result = await auth_validation_1.confirmEmailSchema.body.safeParseAsync(req.body);
    if (result.success) {
        const data = await auth_service_1.default.confirmEmail(req.body);
        return (0, response_1.successResponse)({
            res,
            message: "email verified successfully",
            status: 200,
            data
        });
    }
    else {
        throw new common_1.BadRequestException("validation error", {
            cause: result.error.flatten(),
        });
    }
});
router.patch("/resend-confirm-email", async (req, res, next) => {
    const validation = await auth_validation_1.resendConfirmEmailSchema.body.safeParse(req.body);
    if (validation.success) {
        const data = await auth_service_1.default.reSendConfirmEmail(req.body);
        return (0, response_1.successResponse)({
            res,
            message: "email sent successfully",
            status: 200,
            data
        });
    }
    else {
        throw new common_1.BadRequestException("validation error", {
            cause: validation.error.flatten(),
        });
    }
});
router.post("/login", async (req, res, next) => {
    const result = await auth_validation_1.loginSchema.body.safeParseAsync(req.body);
    if (result.success) {
        const data = await auth_service_1.default.login(req.body);
        return (0, response_1.successResponse)({
            res,
            message: "login done succefully",
            status: 200,
            data
        });
    }
    else {
        throw new common_1.BadRequestException("validation error", {
            cause: result.error.flatten(),
        });
    }
});
router.patch('/forget-password-otp', async (req, res, next) => {
    const result = await auth_validation_1.forgetPasswordSchema.body.safeParseAsync(req.body);
    if (result.success) {
        await auth_service_1.default.forgetPasswordOTP(req.body);
        return (0, response_1.successResponse)({
            res,
            message: "password updated successfully",
            status: 200,
        });
    }
    else {
        throw new common_1.BadRequestException("validation error", {
            cause: result.error.flatten(),
        });
    }
});
router.patch('/forget-password', async (req, res, next) => {
    const result = await auth_validation_1.resendConfirmEmailSchema.body.safeParseAsync(req.body);
    if (result.success) {
        await auth_service_1.default.forgetPassword(req.body);
        return (0, response_1.successResponse)({
            res,
            message: "we have sent to you OTP",
            status: 200,
        });
    }
    else {
        throw new common_1.BadRequestException("validation error", {
            cause: result.error.flatten(),
        });
    }
});
exports.default = router;
