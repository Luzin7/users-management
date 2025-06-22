"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionExpiredError = void 0;
const statusCode_1 = require("../../../shared/core/types/statusCode");
class SessionExpiredError extends Error {
    statusCode = statusCode_1.statusCode.FORBIDDEN;
    constructor() {
        super('Token Inválido');
    }
}
exports.SessionExpiredError = SessionExpiredError;
