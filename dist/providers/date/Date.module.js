"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateModule = void 0;
const common_1 = require("@nestjs/common");
const DateAddition_1 = require("./contracts/DateAddition");
const DateVerification_1 = require("./contracts/DateVerification");
const Dayjs_1 = require("./implementations/Dayjs");
let DateModule = class DateModule {
};
exports.DateModule = DateModule;
exports.DateModule = DateModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: DateAddition_1.DateAddition,
                useClass: Dayjs_1.DayJs,
            },
            {
                provide: DateVerification_1.DateVerification,
                useClass: Dayjs_1.DayJs,
            },
        ],
        exports: [DateAddition_1.DateAddition, DateVerification_1.DateVerification],
    })
], DateModule);
