export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  BAN = 'ban'
}

export const UserRoleEnumMap: { [key: string]: string } = {
  admin: '管理员',
  user: '普通用户',
  ban: '封禁用户'
}
