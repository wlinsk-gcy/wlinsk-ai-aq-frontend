import type { QueryUserDetailRespDTO } from '@/api/models/user/user/QueryUserDetailRespDTO'
import type { IPageReq } from '@/api/models/IPageReqDTO'

export type QueryPageReqDTO = {
  pageNum?: number
  pageSize?: number
  context?: string
}
export type QueryPageRespDTO = {
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
export type QueryMyAppPageReqDTO = IPageReq & {
  appName?: string,
  appId?: string
}