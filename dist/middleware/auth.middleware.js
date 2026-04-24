"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = exports.auth = exports.revokeTokenKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DB_1 = require("../DB");
const common_1 = require("../common");
const revokeTokenKey = (userID, jti) => {
    console.log(userID, jti);
    return `revokecToken::2${userID}::${jti}`;
};
exports.revokeTokenKey = revokeTokenKey;
const auth = async (req, res, next) => {
    const authentication = req.headers.authorization;
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(authentication, "JWT_SECRET");
        if (decoded.jti && await (0, DB_1.get1)((0, exports.revokeTokenKey)(decoded.id, decoded.jti))) {
            throw new common_1.forbiddenException("Invalid  tokenss type");
        }
    }
    catch (error) {
        throw new common_1.forbiddenException("Invalid  tokenss type");
    }
    const user = await DB_1.userModel.findById(decoded.id);
    if (!user)
        throw new common_1.notFoundException("user not found");
    req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    };
    req.decoded =
        {
            jti: decoded.jti,
            iat: decoded.iat,
            exp: decoded.exp
        };
    if (user.CCT && user.CCT.getTime() >= decoded.iat * 1000) {
        throw new common_1.forbiddenException("Invalid  tokenss type");
    }
    next();
};
exports.auth = auth;
const authorization = (role) => {
    return async (req, res, next) => {
        if (req.user.role < role) {
            throw new common_1.forbiddenException("you are not allowed to do this");
        }
        next();
    };
};
exports.authorization = authorization;
