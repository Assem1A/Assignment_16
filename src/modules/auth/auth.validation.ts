import {  z}from 'zod';
export const loginSchema={
  body:  z.strictObject({
    email:z.email(),
    password:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/),
  }).catchall(z.string())
}

export const signupSchema={
  body:  loginSchema.body.safeExtend({
    username:z.string().min(2).max(25),
    gender:z.enum(["male","female"]),
    confirmPassword:z.string()
  }).refine((data)=>{
    return data.password===data.confirmPassword
  },{error:"mismatach"})
}
export const confirmEmailSchema={
  body:  z.strictObject({
   email:z.email(),
   otp:z.string().length(6)
  })
}

export const resendConfirmEmailSchema={
  body:  z.strictObject({
   email:z.email()
  })
}
export const forgetPasswordSchema={
  body:z.strictObject({
        email:z.email(),
        password:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/),
        confirmPassword:z.string()
    ,otp:z.string()
  }).refine((data)=>{
    return data.password===data.confirmPassword
  },{error:"mismatach"})
}