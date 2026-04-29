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
const mongoose_2 = require("mongoose");
const enums_1 = require("../../common/enums");
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    profilePicutre: { type: String },
    profileCoverPictures: { type: [String] },
    gender: { type: Number, enum: enums_1.GenderEnum, default: enums_1.GenderEnum.male },
    role: { type: Number, required: false },
    provider: { type: Number, enum: enums_1.ProviderEnum, default: 0 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function () {
            return this.provider === 0;
        } },
    DOB: { type: Date },
    CCT: { type: Date },
    confirmEmail: { type: Date },
}, {
    collection: "Users",
    timestamps: true,
    strict: true,
    strictQuery: false,
    virtuals: true
});
userSchema.virtual("username").set(function (value) {
    const [firstName, lastName] = (value.split(" ") || []);
    this.firstName = firstName;
    this.lastName = lastName;
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
});
exports.userModel = mongoose_2.models.User || mongoose_1.default.model("Users", userSchema);
