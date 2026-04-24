"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forbiddenException = exports.unAuthorizedException = exports.notFoundException = exports.conflictException = exports.BadRequestException = void 0;
const app_exceptions_1 = require("./app.exceptions");
class BadRequestException extends app_exceptions_1.AppExceptions {
    constructor(message = "BadRequest", cause) {
        super(message, 400, cause);
    }
}
exports.BadRequestException = BadRequestException;
class conflictException extends app_exceptions_1.AppExceptions {
    constructor(message = "conflict", cause) {
        super(message, 409, cause);
    }
}
exports.conflictException = conflictException;
class notFoundException extends app_exceptions_1.AppExceptions {
    constructor(message = "NotFound", cause) {
        super(message, 404, cause);
    }
}
exports.notFoundException = notFoundException;
class unAuthorizedException extends app_exceptions_1.AppExceptions {
    constructor(message = "unAuthorized", cause) {
        super(message, 401, cause);
    }
}
exports.unAuthorizedException = unAuthorizedException;
class forbiddenException extends app_exceptions_1.AppExceptions {
    constructor(message = "forbidden", cause) {
        super(message, 403, cause);
    }
}
exports.forbiddenException = forbiddenException;
