import type { IPage, Result } from '@/api/models/Result'
import request from '@/request'
import type {
  AddScoringResultReqDTO, QueryScoringResultPageReqDTO, QueryScoringResultPageRespDTO,
  UpdateScoringResultReqDTO
} from '@/api/models/user/scoringResult/ScoringResultDTO'

export async function add(reqDTO: AddScoringResultReqDTO) {
  return request<any,Result<any>>('/scoringResult/add',{
    method: 'POST',
    data: reqDTO,
  })
}
export async function update(reqDTO: UpdateScoringResultReqDTO){
  return request<any,Result<any>>('/scoringResult/update',{
    method: 'POST',
    data: reqDTO,
  })
}
export async function queryPage(reqDTO: QueryScoringResultPageReqDTO){
  return request<any,Result<IPage<QueryScoringResultPageRespDTO>>>('/scoringResult/queryPage',{
    method: 'POST',
    data: reqDTO,
  })
}
export async function deleteById(resultId: string){
  return request<any,Result<any>>(`/scoringResult/deleteById/${resultId}`,{
    method: 'POST',
  })
}
