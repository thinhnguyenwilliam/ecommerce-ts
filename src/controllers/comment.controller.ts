// ecommerce-ts/src/controllers/comment.controller.ts

import { Request, Response } from "express"
import { SuccessResponse } from "../core/success.response"
import CommentService from "../services/comment.service"

class CommentController {
    public async deleteComment(req: Request, res: Response) {

        const { commentId, productId } = req.body

        const result = await CommentService.deleteComments({
            commentId,
            productId
        })

        new SuccessResponse({
            message: "Delete comment successfully",
            metadata: result
        }).send(res)
    }

    public async getComments(req: Request, res: Response) {

        const { productId, parentId } = req.query

        const comments = await CommentService.getCommentsByParentId({
            productId: productId as string,
            parentId: parentId as string
        })

        new SuccessResponse({
            message: "Get comments successfully",
            metadata: comments
        }).send(res)
    }

    public async createComment(req: Request, res: Response): Promise<void> {

        const { productId, userId, content, parentId } = req.body

        const comment = await CommentService.createComment({
            productId,
            userId,
            content,
            parentId
        })

        new SuccessResponse({
            message: "Create comment successfully",
            metadata: comment,
        }).send(res)
    }

}

export default new CommentController()