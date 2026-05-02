import {  z}from 'zod';
export const updatePasswordSchema={
  body:  z.strictObject({
  
    oldPassword:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/),
    password:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/),
    confirmPassword:z.string()
  }).refine((data)=>{
    return data.password===data.confirmPassword
  },{error:"mismatach"})
}
export const logoutSchema={
  body:  z.strictObject({
  
    flag:z.number()
  })
}