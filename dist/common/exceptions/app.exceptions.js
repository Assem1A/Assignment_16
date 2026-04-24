"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppExceptions = void 0;
class AppExceptions extends Error {
    statusCode;
    constructor(message, statusCode, cause) {
        super(message, { cause });
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.AppExceptions = AppExceptions;
