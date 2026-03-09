// src/routes/index.ts
import { Router } from 'express'
import shopRouter from './access/shop.route'
import productRouter from "./product/product.route"
import uploadRouter from "./upload/upload.route"
import commentRouter from "./comment/comment.route"
import { apiKey, permission } from '../auth/checkAuth'

const router = Router()

// check api key
router.use(apiKey)

// check permission
router.use(permission('0000'))

// prefix version api
router.use('/v1/api', shopRouter)
router.use('/v1/api/product', productRouter)
router.use('/v1/api/upload', uploadRouter)
router.use('/v1/api/comments', commentRouter)

export default router