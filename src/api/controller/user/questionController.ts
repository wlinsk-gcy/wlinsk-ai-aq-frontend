import type { IPage, Result } from '@/api/models/Result'
import request from '@/request'
import type {
  AddQuestionReqDTO, AiGenerateQuestionReqDTO, AiGenerateQuestionRespDTO,
  QueryQuestionPageReqDTO,
  QueryQuestionPageRespDTO, QuestionContentDTO, UpdateQuestionReqDTO
} from '@/api/models/user/question/QuestionDTO'

export async function addQuestion(reqDTO: AddQuestionReqDTO) {
  return request<any,Result<any>>('/question/add',{
    method: 'POST',
    data: reqDTO,
  })
}
export async function updateQuestion(reqDTO: UpdateQuestionReqDTO){
  return request<any,Result<any>>('/question/update',{
    method: 'POST',
    data: reqDTO,
  })
}
export async function queryPage(reqDTO: QueryQuestionPageReqDTO) {
  return request<any,Result<IPage<QueryQuestionPageRespDTO>>>('/question/queryPage',{
    method: 'POST',
    data: reqDTO,
  })
}
export async function aiGenerate(reqDTO: AiGenerateQuestionReqDTO){
  return request<any,Result<AiGenerateQuestionRespDTO>>('/question/aiGenerate',{
    method: 'POST',
    data: reqDTO,
  })
}