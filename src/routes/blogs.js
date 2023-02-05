import { Router } from "express";
import { createPost, deletePost, getPosts, getPostsByUser, updatePost } from "../controllers/blog.js";
import Verify from "../middleware/index.js";
import { Validator } from "node-input-validator";

const router = new Router();

router.post('/create', async (req, res) => {
    const v = new Validator(req.body, {
        title: 'required|string',
        description: 'required|string'
    });
    const matched = await v.check();
    if (!matched) {
        return res.status(401).send({ error: v.errors });
    }
    let decoded = await Verify(req.headers.token);
    if (decoded instanceof Error) {
        return res.status(decoded.status).send({ error: decoded.message });
    }
    const post = await createPost(req.body, decoded);
    if (post instanceof Error) {
        return res.status(post.status).send({ error: post.message });
    }
    return res.status(200).json({
        message: 'Blog posted!',
        data: post
    });
})

router.get('/', async (req, res) => {
    const posts = await getPosts();
    return res.status(200).json({
        data: posts
    })
})

router.get('/my', async (req, res) => {
    let decoded = await Verify(req.headers.token);
    if (decoded instanceof Error) {
        return res.status(decoded.status).send({ error: decoded.message });
    }
    const posts = await getPostsByUser(decoded);
    return res.status(200).json({
        data: posts
    })
})

router.put('/:_id', async (req, res) => {
    const v = new Validator(req.body, {
        title: 'string',
        description: 'string'
    });
    const matched = await v.check();
    if (!matched) {
        return res.status(401).send({ error: v.errors });
    }
    let decoded = await Verify(req.headers.token);
    if (decoded instanceof Error) {
        return res.status(decoded.status).send({ error: decoded.message });
    }
    const post = await updatePost(req.body, req.params, decoded);
    if (post instanceof Error) {
        return res.status(post.status).send({ error: post.message });
    }
    return res.status(200).json({
        message: 'Blog updated successfully!'
    })
})

router.delete('/:_id', async (req, res) => {
    let decoded = await Verify(req.headers.token);
    if (decoded instanceof Error) {
        return res.status(decoded.status).send({ error: decoded.message });
    }
    const post = await deletePost(req.params, decoded);
    if (post instanceof Error) {
        return res.status(post.status).send({ error: post.message });
    }
    return res.status(200).json({
        message: 'Blog deleted successfully!'
    })
})

export default router
