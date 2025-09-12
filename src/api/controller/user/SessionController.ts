import type { IPage, Result } from '@/api/models/Result'
import request from '@/request'
import type { Example, MessageVO, QuerySessionRecordsRespDTO, SessionVO } from '@/api/models/user/chatSession/SessionDTO'


export async function createSession(){
  return request<any, Result<SessionVO>>(`/session/create`, {
    method: 'POST'
  })
}

export async function hotExamples(num: number) {
  return request<any, Result<Example[]>>(`/session/hot/${num}`, {
    method: 'POST'
  })
}

export async function queryRecords() {
  return request<any, Result<QuerySessionRecordsRespDTO>>(`/session/queryRecords`, {
    method: 'POST'
  })
}

export async function queryBySessionId(sessionId: string){
  return request<any, Result<MessageVO[]>>(`/session/${sessionId}`, {
    method: 'POST'
  })
}
