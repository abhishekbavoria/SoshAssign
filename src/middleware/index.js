import jwt from "jsonwebtoken";
import { blockedAccess } from "../config/dbConfig.js";
import CreateError from "../config/errorCode.js";

export default async function Verify(token){
    const blocked = await blockedAccess.findOne({Token: token})
    var decoded = await jwt.verify(token, 'shhhhh', async function(err,decoded){
        if(err || blocked){
            return CreateError('session expired', 401);
        }
        return decoded;
    });
    return decoded;
}