import type { QueryUserDetailRespDTO } from '@/api/models/user/user/QueryUserDetailRespDTO'
import { AppTypeEnum } from '@/api/models/enums/AppTypeEnum'

export type QueryAppDetailsRespDTO = {
  appId?: string
  appName?: string
  appDesc?: string
  appIcon?: string
  appType?: number
  scoringStrategy?: number
  reviewStatus?: number
  reviewMessage?: string
  reviewerId?: string
  reviewTime?: Date
  userId?: string
  createTime?: Date
  updateTime?: Date
  userInfo?: QueryUserDetailRespDTO
}