import { createClient } from "redis";

export const redisClient=createClient({
    url:"rediss://default:gQAAAAAAAQAnAAIncDI2ZTEyMjc0NmY0N2U0MDg4ODJhMzNlN2Y4OTY5NzJlYnAyNjU1NzU@fresh-mule-65575.upstash.io:6379"
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