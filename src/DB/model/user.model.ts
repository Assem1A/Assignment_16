export const users = []
import mongoose, { Schema } from "mongoose"
import { string } from "zod"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25
    }
    ,
    email: {
        type: String,
        required: true,
        unique: true
    }
    ,
    DOB: Date,
    password: {
        type: String,
          required: true,
        minLength: 8
    }
    , verificationExpires: {
        type: Date||string,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        expires: 0
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male"
    }
    , phone: String,
    confirmEmail: Date, _2stepVerification: Date,
    provider: {
        type: String,
        enum: ["system", "gmail"],
        default: "system"
    },
    profileCoverPic: { type: [String], default: null },
    profileImage: { type: String, default: null }, CCT: Date
    , role: {
        type: Number,
        enum: [0, 1],
        default: 0
    }
}
    , {
        collection: "Users",
        timestamps: true,
        strict: true,
        strictQuery: false
    }
)

export const userModel = mongoose.model("Users", userSchema) 