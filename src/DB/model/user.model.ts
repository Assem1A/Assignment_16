export const users = []

import mongoose, { Schema } from "mongoose"
import { models } from "mongoose"
import { GenderEnum, ProviderEnum } from "../../common/enums"
import { IUser } from "../../common/interfaces"


const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    profilePicutre: { type: String },
    profileCoverPictures: { type: [String] },
    gender: { type: Number, enum: GenderEnum, default: GenderEnum.male },
    role: { type: Number, required: false },
    provider: { type: Number, enum: ProviderEnum, default: 0 },
    email: { type: String, required: true, unique: true },
    password: { type: String,required:function(this){
        return this.provider===0
    } },
    DOB: { type: Date },
    CCT: { type: Date },
    confirmEmail: { type: Date },

}
    , {
        collection: "Users",
        timestamps: true,
        strict: true,
        strictQuery: false,
        virtuals:true
        
    }
)
userSchema.virtual("username").set(function(value:String){
    const [firstName,lastName]=(value.split(" ")||[])as String[]
    this.firstName=firstName as String
    this.lastName=lastName as String

}).get(function(){
    return `${this.firstName} ${this.lastName}`
})
export const userModel = models.User||mongoose.model<IUser>("Users", userSchema)  
