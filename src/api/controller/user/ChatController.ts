import type { IPage, Result } from '@/api/models/Result'
import request from '@/request'


export async function stop(sessionId: string){
  return request<any, Result<void>>(`/chat/stop/${sessionId}`, {
    method: 'POST'
  })
}
