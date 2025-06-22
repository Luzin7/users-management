"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockUsers = void 0;
const User_1 = require("../modules/user/entities/User");
const createMockUsers = (count) => Array.from({ length: count }).map((_, i) => new User_1.User({
    name: `User ${i + 1}`,
    email: `user${i + 1}@email.com`,
    password: 'hashed_password',
    role: i % 2 === 0 ? 'user' : 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
}));
exports.createMockUsers = createMockUsers;
