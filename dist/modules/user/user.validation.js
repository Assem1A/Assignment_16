"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.updatePasswordSchema = void 0;
const zod_1 = require("zod");
exports.updatePasswordSchema = {
    body: zod_1.z.strictObject({
        oldPassword: zod_1.z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/),
        password: zod_1.z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/),
        confirmPassword: zod_1.z.string()
    }).refine((data) => {
        return data.password === data.confirmPassword;
    }, { error: "mismatach" })
};
exports.logoutSchema = {
    body: zod_1.z.strictObject({
        flag: zod_1.z.number()
    })
};
