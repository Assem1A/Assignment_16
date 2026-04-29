"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const response_1 = require("../../common/response");
const user_validation_1 = require("./user.validation");
const user_service_1 = __importDefault(require("./user.service"));
const middleware_1 = require("../../middleware");
const router = (0, express_1.Router)();
router.get("/get-my-profile", auth_middleware_1.auth, (0, auth_middleware_1.authorization)(0), async (req, res, next) => {
    const user = await user_service_1.default.getProfile(req.user?.id);
    return (0, response_1.successResponse)({
        res,
        message: "user selected successfully",
        status: 201,
        data: {
            id: user?._id.toString(),
            email: user?.email,
            role: user?.role
        }
    });
});
router.patch("/update-password", (0, middleware_1.validation)(user_validation_1.updatePasswordSchema), auth_middleware_1.auth, async (req, res, next) => {
    user_service_1.default.updatePassword({ id: req.user?.id, oldPassword: req.body.oldPassword, password: req.body.password });
    return (0, response_1.successResponse)({
        res,
        message: "password updated successfully",
        status: 200
    });
});
router.post("/logout", (0, middleware_1.validation)(user_validation_1.logoutSchema), auth_middleware_1.auth, async (req, res, next) => {
    console.log(req.body.flag);
    user_service_1.default.logout({ id: req.user?.id, decoded: req.decoded, flag: req.body.flag });
    return (0, response_1.successResponse)({
        res,
        message: "logout done successfully",
        status: 200
    });
});
exports.default = router;
