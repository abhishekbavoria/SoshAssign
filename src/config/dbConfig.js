// database configuration .
import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'blogApplication';

const db = client.db(dbName);
export const users = db.collection('users');
export const posts = db.collection('posts')
export const blockedAccess = db.collection('blockedAccess');

export async function main() {
    await client.connect();
    console.log('connected successfully to server');
}
