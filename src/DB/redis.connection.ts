import { createClient } from "redis";
import { REDISLINK } from "../.env/cofig.env";

export const redisClient=createClient({
    url:REDISLINK as string
})
export const connectRedis=async()=>{
try{
await redisClient.connect()
console.log("Redis_connected");

}
catch(error)
{
console.log("connection failed");

}
} 