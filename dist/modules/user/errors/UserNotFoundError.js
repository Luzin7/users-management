"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundError = void 0;
const statusCode_1 = require("../../../shared/core/types/statusCode");
class UserNotFoundError extends Error {
    statusCode = statusCode_1.statusCode.NOT_FOUND;
    constructor() {
        super('Usuário não encontrado');
    }
}
exports.UserNotFoundError = UserNotFoundError;
