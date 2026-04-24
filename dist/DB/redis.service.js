"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete1 = exports.keys = exports.mGet = exports.expire = exports.exists = exports.TTL = exports.get1 = exports.inc = exports.update = exports.set = void 0;
const redis_connection_1 = require("./redis.connection");
const set = async ({ key, val, ttl }) => {
    return ttl ? await redis_connection_1.redisClient.set(key, val, { EX: ttl }) : await redis_connection_1.redisClient.set(key, val);
};
exports.set = set;
const update = async ({ key, val, ttl }) => {
    if (!await redis_connection_1.redisClient.exists(key))
        return 0;
    return await (0, exports.set)({ key, val, ttl });
};
exports.update = update;
const inc = async (key) => {
    if (!await redis_connection_1.redisClient.exists(key))
        return 0;
    return redis_connection_1.redisClient.incr(key);
};
exports.inc = inc;
const get1 = async (key) => {
    let data = await redis_connection_1.redisClient.get(key);
    try {
        return JSON.parse(data);
    }
    catch {
        return data;
    }
};
exports.get1 = get1;
const TTL = async (key) => {
    console.log({ key });
    let data = await redis_connection_1.redisClient.ttl(key);
    return (data);
};
exports.TTL = TTL;
const exists = async ({ key }) => {
    console.log({ key });
    let data = await redis_connection_1.redisClient.exists(key);
    return (data);
};
exports.exists = exists;
const expire = async ({ key, ttl }) => {
    console.log({ key });
    let data = await redis_connection_1.redisClient.expire(key, ttl);
    return (data);
};
exports.expire = expire;
const mGet = async (keys = []) => {
    console.log({ keys });
    let data = await redis_connection_1.redisClient.mGet(keys);
    return (data);
};
exports.mGet = mGet;
const keys = async (prefix) => {
    let data = await redis_connection_1.redisClient.keys(`${prefix}*`);
    return (data);
};
exports.keys = keys;
const delete1 = async (key) => {
    let data = await redis_connection_1.redisClient.del(key);
    return (data);
};
exports.delete1 = delete1;
