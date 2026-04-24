"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({
    url: "rediss://default:gQAAAAAAAQAnAAIncDI2ZTEyMjc0NmY0N2U0MDg4ODJhMzNlN2Y4OTY5NzJlYnAyNjU1NzU@fresh-mule-65575.upstash.io:6379"
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
