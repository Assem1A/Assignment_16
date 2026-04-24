"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDataBase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDataBase = async () => {
    try {
        await mongoose_1.default.connect("mongodb://localhost:27017/Social_Media_App");
        console.log("database connected succefully ✌️😊😂");
    }
    catch (err) {
        console.log(err);
    }
};
exports.connectDataBase = connectDataBase;
