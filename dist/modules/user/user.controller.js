"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const DB_1 = require("../../DB");
const response_1 = require("../../common/response");
const user_validation_1 = require("./user.validation");
const common_1 = require("../../common");
const user_service_1 = __importDefault(require("./user.service"));
const router = (0, express_1.Router)();
router.get("/get-my-profile", auth_middleware_1.auth, (0, auth_middleware_1.authorization)(0), async (req, res, next) => {
    const user = await DB_1.userModel.findById(req.user.id);
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
router.patch("/update-password", auth_middleware_1.auth, async (req, res, next) => {
    const result = await user_validation_1.updatePasswordSchema.body.safeParseAsync(req.body);
    if (!result.success) {
        throw new common_1.BadRequestException("validation error", {
            cause: result.error.flatten(),
        });
    }
    user_service_1.default.updatePassword({ id: req.user?.id, oldPassword: req.body.oldPassword, password: req.body.password });
    return (0, response_1.successResponse)({
        res,
        message: "password updated successfully",
        status: 200
    });
});
router.post("/logout", auth_middleware_1.auth, async (req, res, next) => {
    const valids = await user_validation_1.logoutSchema.body.safeParseAsync(req.body);
    if (!valids.success) {
        throw new common_1.BadRequestException("validation error", {
            cause: valids.error.flatten(),
        });
    }
    console.log(req.body.flag);
    user_service_1.default.logout({ id: req.user?.id, decoded: req.decoded, flag: req.body.flag });
    return (0, response_1.successResponse)({
        res,
        message: "logout done successfully",
        status: 200
    });
});
exports.default = router;
