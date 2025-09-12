import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { QuerySessionRecordsRespDTO, SessionVO } from '@/api/models/user/chatSession/SessionDTO'
import { createSession, queryRecords } from '@/api/controller/user/SessionController'
import { useChatRecordsStore } from '@/stores/chatRecordsStore'



export const useChatSessionStore = defineStore(
  'chatSession',
  () => {
    const sessionRecords = ref<QuerySessionRecordsRespDTO>()
    const currentSessionId = ref<string>()

    async function fetchSessionRecords() {
      const records = await queryRecords()
      sessionRecords.value = records.data ?? ({} as QuerySessionRecordsRespDTO)
      if(records.data && (!records.data.today || records.data.today.length === 0)){
        const session = await createSession()
        currentSessionId.value = session.data?.sessionId
      }else if (records.data && records.data.today && records.data.today.length > 0) {
        currentSessionId.value = records.data.today[0].sessionId
        if (currentSessionId.value) {
          await useChatRecordsStore().fetchCurrentSessionRecords(currentSessionId.value)
        }
      }
    }
    function clearStore() {
      sessionRecords.value = undefined
      currentSessionId.value = undefined
    }

    return { sessionRecords, currentSessionId, fetchSessionRecords,clearStore }
  },
  {
    //开启持久化
    persist: true
  }
)
