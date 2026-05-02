import { GenderEnum, ProviderEnum } from "../enums"

export interface IUser {
    firstName: String,
    lastName: String,
    username?: string,
    phone?: String,
    profilePicutre?: String
    profileCoverPictures: String[],
    gender: GenderEnum,
    role: number,
    provider: ProviderEnum
    email: String,
    password?: String,
    DOB?: Date,
    CCT?: Date
    confirmEmail?: Date
    createdAt?: Date
    updatedAt?: Date



}