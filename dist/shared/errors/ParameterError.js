"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterError = void 0;
const statusCode_1 = require("../core/types/statusCode");
class ParameterError extends Error {
    statusCode = statusCode_1.statusCode.BAD_REQUEST;
    constructor(msg) {
        super(msg ?? 'Há parâmetros inválidos na requisição');
    }
}
exports.ParameterError = ParameterError;
