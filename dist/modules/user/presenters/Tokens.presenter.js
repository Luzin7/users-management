"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensPresenter = void 0;
class TokensPresenter {
    static toHTTP({ accessToken }) {
        return {
            access_token: accessToken,
        };
    }
}
exports.TokensPresenter = TokensPresenter;
