"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const response_1 = require("../../common/response");
const auth_validation_1 = require("./auth.validation");
const middleware_1 = require("../../middleware");
const router = (0, express_1.Router)();
router.post('/signup', (0, middleware_1.validation)(auth_validation_1.signupSchema), async (req, res, next) => {
    console.log("gender");
    const data = await auth_service_1.default.signup(req.body);
    console.log("gender");
    return (0, response_1.successResponse)({
        res,
        message: "Account created successfully",
        status: 201,
        data
    });
});
router.patch("/confirm-Email", (0, middleware_1.validation)(auth_validation_1.confirmEmailSchema), async (req, res, next) => {
    const data = await auth_service_1.default.confirmEmail(req.body);
    return (0, response_1.successResponse)({
        res,
        message: "email verified successfully",
        status: 200,
        data
    });
});
router.patch("/resend-confirm-email", (0, middleware_1.validation)(auth_validation_1.resendConfirmEmailSchema), async (req, res, next) => {
    {
        const data = await auth_service_1.default.reSendConfirmEmail(req.body);
        return (0, response_1.successResponse)({
            res,
            message: "email sent successfully",
            status: 200,
            data
        });
    }
});
router.post("/login", (0, middleware_1.validation)(auth_validation_1.loginSchema), async (req, res, next) => {
    {
        const data = await auth_service_1.default.login(req.body);
        return (0, response_1.successResponse)({
            res,
            message: "login done succefully",
            status: 200,
            data
        });
    }
});
router.patch('/forget-password-otp', (0, middleware_1.validation)(auth_validation_1.forgetPasswordSchema), async (req, res, next) => {
    {
        await auth_service_1.default.forgetPasswordOTP(req.body);
        return (0, response_1.successResponse)({
            res,
            message: "password updated successfully",
            status: 200,
        });
    }
});
router.patch('/forget-password', (0, middleware_1.validation)(auth_validation_1.resendConfirmEmailSchema), async (req, res, next) => {
    await auth_service_1.default.forgetPassword(req.body);
    return (0, response_1.successResponse)({
        res,
        message: "we have sent to you OTP",
        status: 200,
    });
});
exports.default = router;
