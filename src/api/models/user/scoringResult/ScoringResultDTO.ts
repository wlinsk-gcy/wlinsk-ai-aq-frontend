import type { IPageReq } from '@/api/models/IPageReqDTO'
import type { QueryUserDetailRespDTO } from '@/api/models/user/user/QueryUserDetailRespDTO'

export type AddScoringResultReqDTO = {
  resultName?: string,
  resultDesc?: string,
  resultPicture?: string,
  resultProp?: string[],
  resultScoreRange?: number,
  appId?: string
}
export type UpdateScoringResultReqDTO = AddScoringResultReqDTO & {
  resultId?: string,
}
export type QueryScoringResultPageReqDTO = IPageReq & {
  appId?: string,
  resultName?: string,
  resultDesc?: string,
}
export type QueryScoringResultPageRespDTO = {
  resultId?: string,
  resultName?: string,
  resultDesc?: string,
  resultPicture?: string,
  resultProp?: string[],
  resultScoreRange?: number,
  appId?: string,
  userId?: string,
  createTime?: Date,
  updateTime?: Date,
  userInfo?: QueryUserDetailRespDTO,
}