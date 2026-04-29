import mongoose from "mongoose";
import { DBLINK } from "../.env/cofig.env";
export const connectDataBase=async()=>{
try{
    
    await mongoose.connect(DBLINK as string)
    console.log("database connected succefully ✌️😊😂");
    
}
catch(err){console.log(err)}

}