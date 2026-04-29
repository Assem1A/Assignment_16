"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const common_1 = require("../common");
const validation = (schema) => {
    return (req, res, next) => {
        const issues = [];
        for (const key of Object.keys(schema)) {
            console.log(key);
            if (!schema[key])
                continue;
            const result = schema[key].safeParse(req[key]);
            if (!result.success) {
                console.log("gender");
                const error = result.error;
                issues.push({ key, issues: error.issues.map(issue => {
                        return {
                            path: issue.path,
                            message: issue.message
                        };
                    }) });
            }
        }
        if (issues.length) {
            throw new common_1.BadRequestException("validation error", { cause: issues });
        }
        next();
    };
};
exports.validation = validation;
