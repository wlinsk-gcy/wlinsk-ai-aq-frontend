export type QueryPageReqDTO = {
  appId?: string,
  appName?: string,
  pageNum?: number,
  pageSize?: number
}
export type QueryPageRespDTO = {
  appId?: string,
  appName?: string,
  appDesc?: string,
  appIcon?: string,
  appType?: number,
  scoringStrategy?: number,
  reviewStatus?: number,
  reviewMessage?: string,
  reviewerId?: string,
  reviewTime?: Date,
  userId?: string,
  createTime?: Date,
  updateTime?: Date,
}