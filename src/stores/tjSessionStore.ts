import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { QuerySessionRecordsRespDTO, SessionVO } from '@/api/models/tj/SessionDTO'
import { createSession, queryRecords } from '@/api/controller/tj/session/SessionController'
import { useTjChatRecordsStore } from '@/stores/tjChatRecordsStore'



export const useTjSessionStore = defineStore(
  'tjSession',
  () => {
    const sessionRecords = ref<QuerySessionRecordsRespDTO>()
    const currentSessionId = ref<string>()

    async function fetchSessionRecords() {
      const records = await queryRecords()
      sessionRecords.value = records.data ?? ([] as QuerySessionRecordsRespDTO)
      if(records.data && (!records.data.today || records.data.today.length === 0)){
        const session = await createSession()
        currentSessionId.value = session.data?.sessionId
      }else if (records.data && records.data.today && records.data.today.length > 0) {
        currentSessionId.value = records.data.today[0].sessionId
        if (currentSessionId.value) {
          await useTjChatRecordsStore().fetchCurrentSessionRecords(currentSessionId.value)
        }
      }
    }

    return { sessionRecords, currentSessionId, fetchSessionRecords }
  },
  {
    //开启持久化
    persist: true
  }
)
