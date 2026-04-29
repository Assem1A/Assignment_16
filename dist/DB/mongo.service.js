"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDataBase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cofig_env_1 = require("../.env/cofig.env");
const connectDataBase = async () => {
    try {
        await mongoose_1.default.connect(cofig_env_1.DBLINK);
        console.log("database connected succefully ✌️😊😂");
    }
    catch (err) {
        console.log(err);
    }
};
exports.connectDataBase = connectDataBase;
