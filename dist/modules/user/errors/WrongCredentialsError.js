"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrongCredentialsError = void 0;
const statusCode_1 = require("../../../shared/core/types/statusCode");
class WrongCredentialsError extends Error {
    statusCode = statusCode_1.statusCode.UNAUTHORIZED;
    constructor() {
        super('Email ou senha inválidos');
    }
}
exports.WrongCredentialsError = WrongCredentialsError;
