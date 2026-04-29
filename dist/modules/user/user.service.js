"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = require("bcrypt");
const common_1 = require("../../common");
const DB_1 = require("../../DB");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const cofig_env_1 = require("../../.env/cofig.env");
const repo_1 = require("../../DB/model/repo");
class userService {
    userRepo;
    constructor() {
        this.userRepo = new repo_1.DBrepo(DB_1.userModel);
    }
    updatePassword = async (data) => {
        const { id, oldPassword, password } = data;
        const user = await this.userRepo.findOneM({ data: { _id: id }, projection: {} });
        if (!user)
            throw new common_1.notFoundException("user not found");
        const wrongPassword = !await (0, bcrypt_1.compare)(oldPassword, user.password);
        if (wrongPassword)
            throw new common_1.notFoundException("wrong password");
        const samePassword = await (0, bcrypt_1.compare)(password, user.password);
        if (samePassword) {
            throw new common_1.BadRequestException("user password must not be the same with old password");
        }
        user.password = await (0, bcrypt_1.hash)(password, cofig_env_1.HASH_ROUND);
        user.save();
    };
    logout = async (data) => {
        const { id, decoded, flag } = data;
        console.log(flag);
        const user = await this.userRepo.findOneM({ data: { _id: id }, projection: {} });
        if (!user)
            throw new common_1.notFoundException("user not found");
        switch (flag) {
            case 1:
                user.CCT = new Date;
                console.log("omars");
                await user.save();
                console.log(await (0, DB_1.keys)(`revokecToken::2${id}`));
                await (0, DB_1.delete1)(await (0, DB_1.keys)(`revokecToken::2${id}`));
                break;
            default:
                await (0, DB_1.set)({
                    key: (0, auth_middleware_1.revokeTokenKey)(id, decoded?.jti),
                    val: decoded?.jti,
                    ttl: (decoded?.iat + 7 * 24 * 60 * 60)
                });
        }
    };
    getProfile = async (id) => {
        const user = await this.userRepo.findOneM({ data: { _id: id }, projection: {} });
        return user;
    };
}
exports.userService = userService;
exports.default = new userService();
