// ecommerce-ts/src/services/comment.service.ts
import Comment from "../models/comment.model"
import { Types } from "mongoose"

interface CreateCommentParams {
    productId: string
    userId: number
    content: string
    parentId?: string
}

class CommentService {
    static async getCommentsByParentId({
        productId,
        parentId,
        limit = 10,
        offset = 0
    }: {
        productId: string
        parentId: string | null
        limit?: number
        offset?: number
    }) {

        const productObjectId = new Types.ObjectId(productId)

        // root comments
        if (!parentId) {
            return await Comment.find({
                comment_productId: productObjectId,
                comment_parentId: null,
                isDeleted: false
            })
                .sort({ comment_left: 1 })
                .skip(offset)
                .limit(limit)
        }

        const parentComment = await Comment.findById(parentId)

        if (!parentComment) {
            throw new Error("Parent comment not found")
        }

        const comments = await Comment.find({
            comment_productId: productObjectId,
            comment_left: { $gt: parentComment.comment_left },
            comment_right: { $lt: parentComment.comment_right },
            isDeleted: false
        })
            .sort({ comment_left: 1 })
            .skip(offset)
            .limit(limit)

        return comments
    }

    static async createComment({
        productId,
        userId,
        content,
        parentId
    }: CreateCommentParams) {

        const productObjectId = new Types.ObjectId(productId)

        let rightValue = 0

        if (parentId) {
            const parentComment = await Comment.findById(parentId)

            if (!parentComment) {
                throw new Error("Parent comment not found")
            }

            rightValue = parentComment.comment_right

            // update nested set
            await Comment.updateMany(
                {
                    comment_productId: productObjectId,
                    comment_right: { $gte: rightValue }
                },
                { $inc: { comment_right: 2 } }
            )

            await Comment.updateMany(
                {
                    comment_productId: productObjectId,
                    comment_left: { $gt: rightValue }
                },
                { $inc: { comment_left: 2 } }
            )
        } else {
            // root comment
            const maxRight = await Comment.findOne(
                { comment_productId: productObjectId },
                "comment_right",
                { sort: { comment_right: -1 } }
            )

            rightValue = maxRight ? maxRight.comment_right + 1 : 1
        }

        const newComment = await Comment.create({
            comment_productId: productObjectId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentId ? new Types.ObjectId(parentId) : null,
            comment_left: rightValue,
            comment_right: rightValue + 1
        })

        return newComment
    }

}

export default CommentService