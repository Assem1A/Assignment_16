import type { Express, Request,  NextFunction, Response } from "express";
import  express from "express";
import { authRouter } from "./modules";
import { globalErrorHandler } from "./middleware";
import { connectDataBase, connectRedis } from "./DB";
import { userRouter } from "./modules/user";
import { PORT } from './.env/cofig.env';
const bootsrap=async()=>{
console.log("hla hla hla");
const app: Express =express()
app.use(express.json())
app.use("/auth",authRouter)
app.use("/user",userRouter)
connectDataBase()
connectRedis()
app.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({msg:"ahlan wa shlan"})
})
app.get('/*dummy',(req:Request,res:Response,next:NextFunction)=>{
    res.status(404).json({msg:"braaaaaa"})
})
app.use(globalErrorHandler)
app.listen(PORT,()=>{
    console.log("mahmoud abo rsou");
    console.log(PORT);
    
    
})
}
export default bootsrap