import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MessageVO } from '@/api/models/user/chatSession/SessionDTO'
import { queryBySessionId } from '@/api/controller/user/SessionController'

export const useChatRecordsStore = defineStore(
  'chatRecords',
  () => {
    const messageRecords = ref<Record<string, MessageVO[]>>({})

    async function fetchRecords(sessionId: string) {
      const records = await queryBySessionId(sessionId)
      if (records) {
        appendAll(sessionId, records.data ?? [])
      }
    }
    async function fetchCurrentSessionRecords(sessionId: string) {
      const records = await queryBySessionId(sessionId)
      // console.log('调用fetchCurrentSessionRecords',records)
      if (records) {
        if (!messageRecords.value[sessionId]) {
          messageRecords.value[sessionId] = []
        }
        messageRecords.value[sessionId] = records.data ?? []
      }
    }

    function append(sessionId: string, msg: MessageVO) {
      if (!messageRecords.value[sessionId]) {
        messageRecords.value[sessionId] = []
      }
      messageRecords.value[sessionId].push(msg)
    }

    function appendAll(sessionId: string, msg: MessageVO[]) {
      if (!messageRecords.value[sessionId]) {
        messageRecords.value[sessionId] = []
      }
      messageRecords.value[sessionId].push(...msg)
    }

    function get(sessionId: string): MessageVO[] {
      return messageRecords.value[sessionId] || []
    }

    function remove(sessionId: string) {
      delete messageRecords.value[sessionId]
    }

    function clear() {
      messageRecords.value = {}
    }

    return {
      messageRecords,
      fetchRecords,
      fetchCurrentSessionRecords,
      append,
      appendAll,
      get,
      remove,
      clear
    }
  },
  {
    //开启持久化
    persist: true
  }
)
