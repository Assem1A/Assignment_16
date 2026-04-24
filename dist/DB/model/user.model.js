"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.users = void 0;
exports.users = [];
const mongoose_1 = __importStar(require("mongoose"));
const zod_1 = require("zod");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    DOB: Date,
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    verificationExpires: {
        type: Date || zod_1.string,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        expires: 0
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male"
    },
    phone: String,
    confirmEmail: Date, _2stepVerification: Date,
    provider: {
        type: String,
        enum: ["system", "gmail"],
        default: "system"
    },
    profileCoverPic: { type: [String], default: null },
    profileImage: { type: String, default: null }, CCT: Date,
    role: {
        type: Number,
        enum: [0, 1],
        default: 0
    }
}, {
    collection: "Users",
    timestamps: true,
    strict: true,
    strictQuery: false
});
exports.userModel = mongoose_1.default.model("Users", userSchema);
