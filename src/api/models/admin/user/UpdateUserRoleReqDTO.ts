import type { UserRoleEnum } from '@/api/models/enums/UserRoleEnum'

export type UpdateUserRoleReqDTO = {
  userId?: string,
  userRole?: UserRoleEnum,
}