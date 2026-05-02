import { BadRequestException, conflictException, notFoundException } from "../../common";
import { funcs } from "../../common/utils/emailTemp";
import { createNumberOtp } from "../../common/utils/otp";
import { sendEmail } from "../../common/utils/sendEmail";
import { delete1, get1, inc, set, TTL, userModel } from "../../DB";
import { IConfirmEmailDTO, Iemail, IForgetPassword, ILoginDTO, ISignupDTO } from "./auth.dto"
import { compare, hash } from "bcrypt"
import { IConfirmEmailGeneric, IloginGeneric, ISignupGeneric } from "./auth.entity";
import { randomUUID } from "node:crypto";
import jwt ,{ SignOptions }from "jsonwebtoken"
import { HASH_ROUND, JWT_SECRET, REFRESH_SECRET, REFRESH_SECRETtokenexpires, tokenexpires } from "../../.env/cofig.env";
import { DBrepo } from "../../DB/model/repo";
import { GenderEnum, ProviderEnum } from "../../common/enums";
import { IUser } from "../../common/interfaces";

export class AuthService {
    private userRepo:DBrepo<IUser>
    constructor() { 
        this.userRepo=new DBrepo(userModel)
    }
    protected generateOtpAndSendEmail = async (email: string) => {
        if (await TTL(`OTP::User::blocked2::${email}`) > 0) {
            throw new Error("you are already blocked", { cause: { status: 409 } })
        }
        const cmo = Number(await get1(`otp:max:req:2${email}`))
        if (cmo >= 5) {
            await set({
                key: `OTP::User::blocked2::${email}`,
                val: 0,
                ttl: 300
            })

            throw new Error("you are blocked", { cause: { status: 409 } })
        }
        const code = `${createNumberOtp()}`;
        const hashedCode = await hash(code, HASH_ROUND )
        await set({ key: `OTP::User::2${email}`, val: `${hashedCode}`, ttl: 120 })
        cmo > 0 ? await inc(`otp:max:req:2${email}`) : await set({ key: `otp:max:req:2${email}`, val: 1, ttl: 300 })
        await sendEmail(email, "confirm-email",
            funcs(code)
        )
    }
    public login = async (data: ILoginDTO): Promise<IloginGeneric> => {
        const { email, password } = data;
        const gettings = (Number(await get1(`wrongPAssword2${email}`))) || 0
        const blockedTTL = Number(await TTL(`blockedwrongPAssword2${email}`))
        if (blockedTTL > 0) {
            throw new notFoundException(`you are blocked for${blockedTTL}`)

        }
        if (gettings >= 4) {
            await set({
                key: `blockedwrongPAssword2${email}`,
                val: 1,
                ttl: 300
            })
        }
        const user = await this.userRepo.findOneM({data:{ email, provider:ProviderEnum.system, confirmEmail: { $exists: true }},projection:{} })
        if (!user) throw new notFoundException("invalid email or password")
        const wrongPassword = !(await compare(password, user.password as string))
        if (wrongPassword) {
            gettings > 0 ? await inc(`wrongPAssword2${email}`) : await set({ key: `wrongPAssword2${email}`, val: 1, ttl: 300 })
            throw new notFoundException("invalid email or password")
        }
       const jwtid = randomUUID();

const accessOptions: SignOptions = {
  expiresIn: tokenexpires as NonNullable<SignOptions["expiresIn"]>,
  jwtid,
};

const refreshOptions: SignOptions = {
  expiresIn: REFRESH_SECRETtokenexpires as NonNullable<SignOptions["expiresIn"]>,
  jwtid,
};

const token = jwt.sign(
  { id: user._id, email },
  JWT_SECRET as string,
  accessOptions
);

const refreshToken = jwt.sign(
  { sub: user.id },
  REFRESH_SECRET as string,
  refreshOptions
);
        await delete1(`wrongPAssword2${email}`)
        return { token, refreshToken }


    }
    public signup = async (data: ISignupDTO): Promise<ISignupGeneric> => {
        const { email, password, username, gender } = data;
        const found = await this.userRepo.findOneM({data:{ email },projection:{}})
        if (found) throw new conflictException("user already exists");
        
        const hashed = await hash(password, HASH_ROUND )
const genderValue = gender === "female" ? GenderEnum.female : GenderEnum.male;

        const user = await this.userRepo.create({data:{ username, email, password: hashed, provider: ProviderEnum.system, gender: genderValue }
})
        await this.generateOtpAndSendEmail(email)
        return { 
            email: user.email ,
            username: user.username,
            gender: user.gender
        }
    }
    public confirmEmail = async (data: IConfirmEmailDTO): Promise<IConfirmEmailGeneric> => {
        const { email, otp } = data
        let user1 = await this.userRepo.findOneM({data:{ email, confirmEmail: { $exists: false }, provider:ProviderEnum.system },projection:{}})
        if (!user1) throw new notFoundException("user not found")
        const hasshedOTP = await get1(`OTP::User::2${email}`)
        if (!hasshedOTP) {
            throw new notFoundException("OTP not found")
        }
        if (!await compare(otp, hasshedOTP)) {
            throw new BadRequestException("OTP is not correct")

        }
        user1.confirmEmail = new Date()
        await user1.save()

        await userModel.updateOne(
            { email },
            { $unset: { verificationExpires: 1 } }
        )

        await delete1(`OTP::User::2${email}`)
        await delete1(`OTP::User::blocked2::${email}`)
        await delete1(`otp:max:req:2${email}`)
        return {
            email
        }
    }
    public reSendConfirmEmail = async (data: IConfirmEmailGeneric): Promise<IConfirmEmailGeneric> => {
        const { email } = data
        let user1 = await this.userRepo.findOneM({data:{ email, confirmEmail: { $exists: false }, provider: ProviderEnum.system },projection:{}})
        if (!user1) throw new notFoundException("user not found")
        if (await TTL(`OTP::User::2${email}`) > 0) {
            throw new conflictException("enta aslan m3ak otp")
        }


        this.generateOtpAndSendEmail(email as string)
        return {
            email
        }
    }
    public forgetPassword=(data: Iemail) =>{
        const {email}=data
        this.generateOtpAndSendEmail(email)
    }
      public forgetPasswordOTP=async(data: IForgetPassword)=> {
     const {email,password, otp}=data
  const hashedOtp = await get1(`OTP::User::2${email}`)

  if (!hashedOtp) {
  throw new notFoundException("OTP not found")
  }

  const match = await compare(otp, hashedOtp)

  if (!match) {
            throw new BadRequestException("OTP is not correct")
  }

  const user =await this.userRepo.findOneM({data:{ email, confirmEmail: { $exists: true }, provider: ProviderEnum.system },projection:{}})
  if (!user) {
 throw new notFoundException("user not found")  }

  const hashedPassword = await hash(password, HASH_ROUND )

  user.password = hashedPassword

  await user.save()


        await delete1(`OTP::User::2${email}`)
        await delete1(`OTP::User::blocked2::${email}`)
        await delete1(`otp:max:req:2${email}`)

    }
}
export default new AuthService()