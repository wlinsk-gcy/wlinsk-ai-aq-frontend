import { ReviewStatusEnum } from '@/api/models/enums/ReviewStatusEnum'

export type ReviewAppReqDTO = {
  appId?: string,
  reviewStatus?: ReviewStatusEnum,
  reviewMessage?: string,
}