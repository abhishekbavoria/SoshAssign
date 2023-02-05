import { blockedAccess, users } from "../config/dbConfig.js";
import CreateError from "../config/errorCode.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function insertUser(obj) {
    const user = await users.findOne({ email: obj.email });
    if (user) {
        return CreateError("email already registered.", 401);
    }
    let token='';
    await users.insertOne({
        name: obj.name,
        email: obj.email,
        token
    })
    return true;
}

export async function checkUser(obj) {
    const user = await users.findOne({ email: obj.email });
    if (user) {
        const tokenData = jwt.sign({ _id: user._id, email: user.email, name: user.name }, 'shhhhh', { expiresIn: '1h' })
        await users.updateOne({ _id: user._id }, { $set: { token: tokenData }})
        return tokenData
    }
    return CreateError("user does not exist", 401);
}

export async function removeUser(decoded){
    const user = await users.findOne({_id: new ObjectId(decoded._id)})
    if(user){
        await users.deleteOne({_id: user._id});
        return true
    }
    return CreateError('User does not exist', 401);
}

export async function logoutUser(token, decoded){
    const blockUser = await blockedAccess.findOne({Token:token})
    if(blockUser){
        return CreateError('user already logged out', 401);
    }
    await blockedAccess.insertOne({
        Token: token,
        expiry: Date.now()- new Date(decoded.exp),
        issuedAt: Date.now() - new Date(decoded.iat)
    });
    return true
}