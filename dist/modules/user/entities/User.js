"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Entity_1 = require("../../../shared/core/Entities/Entity");
class User extends Entity_1.Entity {
    constructor(props, id) {
        const userProps = {
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? null,
            lastLoginAt: props.lastLoginAt ?? null,
            name: props.name,
            password: props.password,
            email: props.email,
            role: props.role ?? 'user',
        };
        super(userProps, id);
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get name() {
        return this.props.name;
    }
    set name(name) {
        this.props.name = name;
        this.touch();
    }
    get password() {
        return this.props.password;
    }
    set password(password) {
        this.props.password = password;
        this.touch();
    }
    get email() {
        return this.props.email;
    }
    set email(email) {
        this.props.email = email;
        this.touch();
    }
    get role() {
        return this.props.role;
    }
    set role(role) {
        this.props.role = role;
        this.touch();
    }
    get lastLoginAt() {
        return this.props.lastLoginAt;
    }
    set lastLoginAt(lastLoginAt) {
        this.props.lastLoginAt = lastLoginAt;
        this.touch();
    }
    touch() {
        this.props.updatedAt = new Date();
    }
}
exports.User = User;
