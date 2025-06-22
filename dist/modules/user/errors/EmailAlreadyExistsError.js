"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAlreadyExistsError = void 0;
const statusCode_1 = require("../../../shared/core/types/statusCode");
class EmailAlreadyExistsError extends Error {
    statusCode = statusCode_1.statusCode.CONFLICT;
    constructor() {
        super('Já existe um usuário com este e-mail cadastrado');
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
