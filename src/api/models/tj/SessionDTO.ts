import type { MessageTypeEnum } from '@/api/models/enums/tj/MessageTypeEnum'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'


export type SessionVO = {
  sessionId?: string,
  title?: string,
  updateTime?: string
  describe?: string,
  examples?: Example[]
}

export type Example = {
  title?: string,
  describe?: string,
}


export type MessageVO = {
  id?: string,
  type?: MessageTypeEnum,
  content?: string,
  params?: MessageParams
}

export interface MessageParams {
  appInfos?: string // 如果你未来扩展更多字段，也可以加在这里
}

export type QuerySessionRecordsRespDTO = {
  lastSessionId?: string,
  today?: SessionVO[],
  recentWeek?: SessionVO[],
  recentMonth?: SessionVO[],
  recentYear?: SessionVO[],
}
