import type { IPage, Result } from '@/api/models/Result'
import request from '@/request'
import type { QueryPageReqDTO, QueryPageRespDTO } from '@/api/models/admin/app/QueryPageDTO'
import type { ReviewAppReqDTO } from '@/api/models/admin/app/ReviewAppDTO'

export async function queryPage(reqDTO: QueryPageReqDTO) {
  return request<any, Result<IPage<QueryPageRespDTO>>>('/manager/app/queryPage', {
    method: 'POST',
    data: reqDTO,
  })
}
export async function reviewApp(reqDTO: ReviewAppReqDTO) {
  return request<any, Result<any>>('/manager/app/review', {
    method: 'POST',
    data: reqDTO,
  })
}
export async function deleteById(appId: string) {
  return request<any, Result<any>>(`/manager/app/deleteById/${appId}`, {
    method: 'POST',
  })
}