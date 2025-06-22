"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const Entity_1 = require("../../../shared/core/Entities/Entity");
class RefreshToken extends Entity_1.Entity {
    constructor(props, id) {
        const refreshTokenProps = {
            ...props,
            createdAt: props.createdAt ?? new Date(),
        };
        super(refreshTokenProps, id);
    }
    get token() {
        return this.props.token;
    }
    get expiresIn() {
        return this.props.expiresIn;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get userId() {
        return this.props.userId;
    }
}
exports.RefreshToken = RefreshToken;
