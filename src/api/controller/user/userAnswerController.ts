import type { IPage,Result } from '@/api/models/Result'
import request from '@/request'
import type {
  AddUserAnswerReqDTO, QueryUserAnswerPageReqDTO,
  QueryUserAnswerRecordDetailsRespDTO
} from '@/api/models/user/userAnswer/UserAnswerDTO'

export async function add(reqDTO: AddUserAnswerReqDTO){
  return request<any,Result<string>>('/userAnswer/add',{
    method:'POST',
    data:reqDTO,
  })
}
export async function queryById(recordId: string){
  return request<any,Result<QueryUserAnswerRecordDetailsRespDTO>>(`/userAnswer/queryById/${recordId}`,{
    method:'POST',
  })
}
export async function queryPage(reqDTO: QueryUserAnswerPageReqDTO) {
  return request<any,Result<IPage<QueryUserAnswerRecordDetailsRespDTO>>>('/userAnswer/queryPage',{
    method:'POST',
    data:reqDTO,
  })
}
export async function deleteById(recordId: string){
  return request<any,Result<any>>(`/userAnswer/deleteById/${recordId}`,{
    method:'POST',
  })
}