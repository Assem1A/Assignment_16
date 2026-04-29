"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const cofig_env_1 = require("../.env/cofig.env");
exports.redisClient = (0, redis_1.createClient)({
    url: cofig_env_1.REDISLINK
});
const connectRedis = async () => {
    try {
        await exports.redisClient.connect();
        console.log("Redis_connected");
    }
    catch (error) {
        console.log("connection failed");
    }
};
exports.connectRedis = connectRedis;
