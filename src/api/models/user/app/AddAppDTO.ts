import { AppTypeEnum } from '@/api/models/enums/AppTypeEnum'
import { ScoringStrategyEnum } from '@/api/models/enums/ScoringStrategyEnum'

export type AddAppReqDTO = {
  appName?: string,
  appDesc?: string,
  appIcon?: string,
  appType?: AppTypeEnum,
  scoringStrategy?: ScoringStrategyEnum,
}