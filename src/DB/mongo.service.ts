import mongoose from "mongoose";
export const connectDataBase=async()=>{
try{
    
    await mongoose.connect("mongodb://localhost:27017/Social_Media_App")
    console.log("database connected succefully ✌️😊😂");
    
}
catch(err){console.log(err)}

}