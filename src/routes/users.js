import { Router } from "express";
import {Validator} from "node-input-validator";
import { checkUser, insertUser, logoutUser, removeUser } from "../controllers/user.js";
import Verify from "../middleware/index.js";

const router = new Router();

router.post('/register', async (req, res) => {
    const v = new Validator(req.body,{
        name: 'required|string',
        email: 'required|email'
    });
    const matched = await v.check();
    if(!matched){
        return res.status(401).send({error: v.errors});
    }
    
    const addUser = await insertUser(req.body);
    if (addUser instanceof Error) {
        return res.status(addUser.status).send({ error: addUser.message });
    }
    return res.status(200).json({ message: 'user registered successfully.' });
})

router.post('/login', async (req, res) => {
    const v = new Validator(req.body, {
        email: 'required|email'
    });
    const matched = await v.check();
    if (!matched) {
        return res.status(401).send({ error: v.errors });
    }
    const user = await checkUser(req.body);
    if (user instanceof Error) {
        return res.status(user.status).send({ error: user.message });
    }
    return res.status(200).json({
        message: 'login successfull',
        Token: user
    });
})

router.delete('/delete', async(req,res)=>{
    let decoded = await Verify(req.headers.token);
    if (decoded instanceof Error) {
        return res.status(decoded.status).send({ error: decoded.message });
    }
    const user = await removeUser(decoded);
    if (user instanceof Error) {
        return res.status(user.status).send({ error: user.message });
    }
    return res.status(200).json({
        message: 'user deleted successfully!'
    })
})

router.post('/logout', async(req,res)=>{
    let token = req.headers.token;
    let decoded = await Verify(token);
    if (decoded instanceof Error) {
        return res.status(decoded.status).send({ error: decoded.message });
    }
    const user = await logoutUser(token, decoded);
    if (user instanceof Error) {
        return res.status(user.status).send({ error: user.message });
    }
    return res.status(200).json({
        message: 'logged out successfully!'
    })
})

export default router