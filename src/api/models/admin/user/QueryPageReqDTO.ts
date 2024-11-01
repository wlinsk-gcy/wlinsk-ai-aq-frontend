import type { UserRoleEnum } from '@/api/models/enums/UserRoleEnum'

export type QueryPageReqDTO = {
  pageNum?: number,
  pageSize?: number,
  userId?: string,
  userAccount?: string,
  userName?: string,
  userRole?: UserRoleEnum,
}
