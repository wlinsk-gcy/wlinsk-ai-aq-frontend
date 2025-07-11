import type { IPage, Result } from '@/api/models/Result'
import tjRequest from '@/tjRequest'
import type { SessionVO } from '@/api/models/tj/SessionDTO'


export async function stop(sessionId: string){
  return tjRequest<any, Result<void>>(`/chat/stop/${sessionId}`, {
    method: 'POST'
  })
}
