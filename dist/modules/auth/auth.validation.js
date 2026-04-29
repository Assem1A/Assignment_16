"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordSchema = exports.resendConfirmEmailSchema = exports.confirmEmailSchema = exports.signupSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = {
    body: zod_1.z.strictObject({
        email: zod_1.z.email(),
        password: zod_1.z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/),
    }).catchall(zod_1.z.string())
};
exports.signupSchema = {
    body: exports.loginSchema.body.safeExtend({
        username: zod_1.z.string().min(2).max(25),
        gender: zod_1.z.enum(["male", "female"]),
        confirmPassword: zod_1.z.string()
    }).refine((data) => {
        return data.password === data.confirmPassword;
    }, { error: "mismatach" }),
    query: zod_1.z.object({
        flag: zod_1.z.coerce.boolean()
    }).strict()
};
exports.confirmEmailSchema = {
    body: zod_1.z.strictObject({
        email: zod_1.z.email(),
        otp: zod_1.z.string().length(6)
    })
};
exports.resendConfirmEmailSchema = {
    body: zod_1.z.strictObject({
        email: zod_1.z.email()
    })
};
exports.forgetPasswordSchema = {
    body: zod_1.z.strictObject({
        email: zod_1.z.email(),
        password: zod_1.z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/),
        confirmPassword: zod_1.z.string(),
        otp: zod_1.z.string()
    }).refine((data) => {
        return data.password === data.confirmPassword;
    }, { error: "mismatach" })
};
