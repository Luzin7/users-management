"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorPresenter = void 0;
const common_1 = require("@nestjs/common");
const statusCode_1 = require("../../shared/core/types/statusCode");
/**
 *
 * @class ErrorPresenter - Present all possible application errors
 */
class ErrorPresenter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static errorMap = {
        [statusCode_1.statusCode.NOT_FOUND]: common_1.NotFoundException,
        [statusCode_1.statusCode.BAD_REQUEST]: common_1.BadRequestException,
        [statusCode_1.statusCode.FORBIDDEN]: common_1.ForbiddenException,
        [statusCode_1.statusCode.UNAUTHORIZED]: common_1.UnauthorizedException,
        [statusCode_1.statusCode.CONFLICT]: common_1.ConflictException,
    };
    static toHTTP(error) {
        const Exception = this.errorMap[error.statusCode] || common_1.InternalServerErrorException;
        throw new Exception(error.message);
    }
}
exports.ErrorPresenter = ErrorPresenter;
