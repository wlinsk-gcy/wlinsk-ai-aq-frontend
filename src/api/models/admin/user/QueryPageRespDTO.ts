import type { UserRoleEnum } from '@/api/models/enums/UserRoleEnum'

export type QueryPageRespDTO = {
  userId?: string,
  userAccount?: string,
  userName?: string,
  userAvatar?: string,
  userProfile?: string,
  userRole?: UserRoleEnum,
  createTime?: Date,
  updateTime?: Date
}