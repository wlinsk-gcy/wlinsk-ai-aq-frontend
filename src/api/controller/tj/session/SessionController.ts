import type { IPage, Result } from '@/api/models/Result'
import tjRequest from '@/tjRequest'
import type { Example, MessageVO, QuerySessionRecordsRespDTO, SessionVO } from '@/api/models/tj/SessionDTO'


export async function createSession(){
  return tjRequest<any, Result<SessionVO>>(`/session/create`, {
    method: 'POST'
  })
}

export async function hotExamples(num: number) {
  return tjRequest<any, Result<Example[]>>(`/session/hot/${num}`, {
    method: 'POST'
  })
}

export async function queryRecords() {
  return tjRequest<any, Result<QuerySessionRecordsRespDTO>>(`/session/queryRecords`, {
    method: 'POST'
  })
}

export async function queryBySessionId(sessionId: string){
  return tjRequest<any, Result<MessageVO[]>>(`/session/${sessionId}`, {
    method: 'POST'
  })
}
