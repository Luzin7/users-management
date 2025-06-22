"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const statusCode_1 = require("../core/types/statusCode");
class UnauthorizedError extends Error {
    statusCode = statusCode_1.statusCode.FORBIDDEN;
    constructor() {
        super('Você não possui permissão para executar essa ação');
    }
}
exports.UnauthorizedError = UnauthorizedError;
