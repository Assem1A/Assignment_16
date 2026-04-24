import { redisClient } from "./redis.connection";
export const set=async({key,val,ttl}:{key:string,val:number|string,ttl:number})=>{
    // console.log({key});
 
return ttl? await redisClient.set(key,val,{EX:ttl}):await redisClient.set(key,val)

}
export const update=async({key,val,ttl}:{key:string,val:number,ttl:number})=>{

    if(!await redisClient.exists(key) )return 0
return await set({key,val,ttl})

}
export const inc=async(key:string)=>{

    if(!await redisClient.exists(key) )return 0
return redisClient.incr(key)

}
export const get1=async(key:string)=>{
    let data=await redisClient.get(key)
    try{
        return JSON.parse(data as string)
    }
    catch{
        return data
    }
}
export const TTL=async(key:string)=>{
    console.log({key});
    let data=await redisClient.ttl(key)
  
        return(data)
 
}
export const exists=async({key}:{key:string})=>{
    console.log({key});
    let data=await redisClient.exists(key)
  
        return(data)
 
}
export const expire=async({key,ttl}:{key:string,ttl:number})=>{
    console.log({key});
    let data=await redisClient.expire(key,ttl)
  
        return(data)
 
}
export const mGet=async(keys=[])=>{
    console.log({keys});
    let data=await redisClient.mGet(keys)
  
        return(data)
 
}
export const keys=async(prefix:string)=>{
    let data=await redisClient.keys(`${prefix}*`)
  
        return(data)
 
}
export const delete1=async(key:string|string[])=>{
    let data=await redisClient.del(key)
  
        return(data)
 
}