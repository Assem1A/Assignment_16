"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    const st = err.statusCode || 500;
    return res.status(st).json({ msg: err.message || "internal server error", err, cause: err.cause, stack: err.stack });
};
exports.globalErrorHandler = globalErrorHandler;
