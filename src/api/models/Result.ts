export type Result<T> = {
  rspCd?: string,
  rspInf?: string,
  data?: T,
  responseTm?: string,
  rspType?: number,
  v?: string,
}
export type IPage<T> = {
  total: number,
  size: number,
  current: number,
  pages: number,
  records: T[],
}