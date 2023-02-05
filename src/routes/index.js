import { Router } from "express";
import userRouters from "./users.js"
import blogRouters from "./blogs.js"

const router = new Router();

router.use('/api/user',userRouters);
router.use('/api/blog', blogRouters);

export default router