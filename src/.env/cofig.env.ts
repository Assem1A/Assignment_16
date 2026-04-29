import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve("./src/dev.env") });

export const PORT = process.env.PORT ;
export const HASH_ROUND = Number(process.env.HASH_ROUND)  ;
export const JWT_SECRET = process.env.JWT_SECRET ;
export const REFRESH_SECRET = process.env.REFRESH_SECRET ;
export const tokenexpires = process.env.TOKENTIME ;
export const REFRESH_SECRETtokenexpires = process.env.REFRESH_SECRET1 ;
export const DBLINK = process.env.DBLINK ;
export const REDISLINK = process.env.REDISLINK ;
export const EMAILY=process.env.EMAILY
export const PASSWORDY=process.env.PASSWORDY
export const ENC_KEY = process.env.ENC_KEY;