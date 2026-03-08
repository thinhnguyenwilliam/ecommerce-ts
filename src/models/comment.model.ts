// ecommerce-ts/src/models/comment.model.ts
import { model, Schema, Document } from "mongoose"

export interface IComment extends Document {
    comment_productId: Schema.Types.ObjectId
    comment_userId: number
    comment_content: string
    comment_left: number
    comment_right: number
    comment_parentId?: Schema.Types.ObjectId | null
    isDeleted: boolean
}

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'

const commentSchema = new Schema<IComment>({
    comment_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    comment_userId: {
        type: Number,
        required: true
    },
    comment_content: {
        type: String,
        required: true
    },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: {
        type: Schema.Types.ObjectId,
        ref: DOCUMENT_NAME,
        default: null
    },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

commentSchema.index({ comment_productId: 1, comment_left: 1, comment_right: 1 })
commentSchema.index({ comment_parentId: 1 })

export default model<IComment>(DOCUMENT_NAME, commentSchema)