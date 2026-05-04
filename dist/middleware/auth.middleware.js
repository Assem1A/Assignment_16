"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = exports.auth = exports.tokenNameInRedis = void 0;
const DB_1 = require("../DB");
const common_1 = require("../common");
const cofig_env_1 = require("../.env/cofig.env");
const repo_1 = require("../DB/model/repo");
const token_1 = require("../common/utils/token");
const tokenNameInRedis = (message, userID, jti) => {
    if (jti) {
        return `${message}${userID}${jti}`;
    }
    return `${message}${userID}`;
};
exports.tokenNameInRedis = tokenNameInRedis;
const auth = async (req, res, next) => {
    const authentication = req.headers.authorization;
    const userRepo = new repo_1.DBrepo(DB_1.userModel);
    const decoded = (0, token_1.tokenVerify)(authentication, cofig_env_1.JWT_SECRET);
    if (decoded.jti && await (0, DB_1.get1)((0, exports.tokenNameInRedis)("rt2", decoded.id, decoded.jti))) {
        throw new common_1.forbiddenException("Invalid  tokenss type");
    }
    const user = await userRepo.findOneM({ data: { _id: decoded.id }, projection: {} });
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
