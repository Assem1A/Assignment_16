"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const middleware_1 = require("./middleware");
const DB_1 = require("./DB");
const user_1 = require("./modules/user");
const bootsrap = async () => {
    console.log("hla hla hla");
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/auth", modules_1.authRouter);
    app.use("/user", user_1.userRouter);
    (0, DB_1.connectDataBase)();
    (0, DB_1.connectRedis)();
    app.get('/', (req, res, next) => {
        res.status(200).json({ msg: "ahlan wa shlan" });
    });
    app.get('/*dummy', (req, res, next) => {
        res.status(404).json({ msg: "braaaaaa" });
    });
    app.use(middleware_1.globalErrorHandler);
    app.listen(3000, () => {
        console.log("mahmoud abo rsou");
    });
};
exports.default = bootsrap;
