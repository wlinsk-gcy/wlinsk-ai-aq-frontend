import { AppTypeEnum } from '@/api/models/enums/AppTypeEnum'
import { ScoringStrategyEnum } from '@/api/models/enums/ScoringStrategyEnum'
import type { QueryUserDetailRespDTO } from '@/api/models/user/user/QueryUserDetailRespDTO'
import type { IPageReq } from '@/api/models/IPageReqDTO'

export type AddUserAnswerReqDTO = {
  appId?: string,
  choices?: string[]
}
export type QueryUserAnswerRecordDetailsRespDTO = {
  recordId?: string,
  appId?: string,
  appType?: AppTypeEnum,
  scoringStrategy?: ScoringStrategyEnum,
  choices?: string[],
  resultId?: string,
  resultName?: string,
  resultDesc?: string,
  resultPicture?: string,
  resultScore?: number,
  userId?: string,
  createTime?: Date,
  userInfo?: QueryUserDetailRespDTO
}
export type QueryUserAnswerPageReqDTO = IPageReq & {
  appId?: string,
  recordId?: string,
  resultName?: string,
}