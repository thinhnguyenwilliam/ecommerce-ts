// ecommerce-ts/src/routes/comment/comment.route.ts

import { Router } from "express"
import CommentController from "../../controllers/comment.controller"

const router = Router()

// create comment
router.post("/", CommentController.createComment)
router.get("/", CommentController.getComments)

export default router