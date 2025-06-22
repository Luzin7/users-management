"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const SessionExpiredError_1 = require("../../../modules/user/errors/SessionExpiredError");
const common_1 = require("@nestjs/common");
exports.RefreshToken = (0, common_1.createParamDecorator)((_, context) => {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies?.refresh_token;
    if (!refreshToken) {
        throw new SessionExpiredError_1.SessionExpiredError();
    }
    return refreshToken;
});
