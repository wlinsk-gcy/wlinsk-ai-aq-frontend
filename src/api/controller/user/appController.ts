import type { IPage, Result } from '@/api/models/Result'
import request from '@/request'
import type { QueryMyAppPageReqDTO, QueryPageReqDTO, QueryPageRespDTO } from '@/api/models/user/app/QueryPageDTO'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'
import type { AddAppReqDTO } from '@/api/models/user/app/AddAppDTO'
import type { UpdateAppReqDTO } from '@/api/models/user/app/UpdateAppDTO'

export async function queryPage(reqDTO: QueryPageReqDTO) {
  return request<any, Result<IPage<QueryPageRespDTO>>>('/app/queryPage', {
    method: 'POST',
    data: reqDTO
  })
}

export async function queryById(appId: string) {
  return request<any, Result<QueryAppDetailsRespDTO>>(`/app/queryById/${appId}`, {
    method: 'POST'
  })
}

export async function addApp(reqDTO: AddAppReqDTO) {
  return request<any,Result<any>>('/app/add',{
    method: 'POST',
    data: reqDTO
  })
}
export async function updateApp(reqDTO: UpdateAppReqDTO){
  return request<any,Result<any>>('/app/update',{
    method: 'POST',
    data: reqDTO
  })
}
export async function queryMyPage(reqDTO: QueryMyAppPageReqDTO) {
  return request<any, Result<IPage<QueryPageRespDTO>>>('/app/queryMyPage', {
    method: 'POST',
    data: reqDTO
  })
}