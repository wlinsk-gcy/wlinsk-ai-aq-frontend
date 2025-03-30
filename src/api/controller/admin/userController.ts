import type { IPage, Result } from '@/api/models/Result'
import request from '@/request'
import type { QueryPageReqDTO } from '@/api/models/admin/user/QueryPageReqDTO'
import type { QueryPageRespDTO } from '@/api/models/admin/user/QueryPageRespDTO'
import type { UpdateUserRoleReqDTO } from '@/api/models/admin/user/UpdateUserRoleReqDTO'

export async function queryPage(reqDTO: QueryPageReqDTO){
  return request<any,Result<IPage<QueryPageRespDTO>>>('/manager/user/queryPage',{
    method: 'POST',
    data: reqDTO,
  })
}
export async function deleteById(userId: string){
  return request<any,Result<any>>(`/manager/user/deleteById/${userId}`,{
    method: 'POST',
  })
}
export async function updateUserRole(reqDTO: UpdateUserRoleReqDTO){
  return request<any,Result<any>>('/manager/user/updateRole',{
    method: 'POST',
    data: reqDTO,
  })
}