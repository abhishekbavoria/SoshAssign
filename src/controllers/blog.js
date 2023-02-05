import { ObjectId } from "mongodb";
import { posts, users } from "../config/dbConfig.js";
import CreateError from "../config/errorCode.js";

export async function createPost(obj, decoded){
    const findPost = await posts.findOne({title: obj.title});
    if(findPost){
        return CreateError('Blog of same title already exists.',401);
    }
    const post = await posts.insertOne({
        title: obj.title,
        description:obj.description,
        createdBy: new ObjectId(decoded._id),
        createdOn: new Date()
    })
    const result = await posts.findOne({_id: post.insertedId})
    return result
}

export async function getPosts(){
    let findPosts = await posts.find({}).toArray();
    return findPosts;
}

export async function getPostsByUser(decoded){
    const findPosts = await posts.find({createdBy: new ObjectId(decoded._id)}).toArray();
    return findPosts;
}

export async function updatePost(obj,params,decoded){
    const findPost = await posts.findOne({_id: new ObjectId(params._id)});
    if(!findPost){
        return CreateError('Blog does not exist!',401);
    }
    if(new ObjectId(findPost.createdBy) == decoded._id){
        obj.updatedOn = new Date();
        await posts.updateOne({_id:new ObjectId(params._id)}, {$set: obj})
        return true
    }
    return CreateError('You are not authorized user!',403);
}

export async function deletePost(params,decoded){
    const findPost = await posts.findOne({ _id: new ObjectId(params._id) });
    if (!findPost) {
        return CreateError('Blog does not exist!', 401);
    }
    if (new ObjectId(findPost.createdBy) == decoded._id) {
        await posts.deleteOne({ _id: new ObjectId(params._id) })
        return true
    }
    return CreateError('You are not authorized user!', 403);
}