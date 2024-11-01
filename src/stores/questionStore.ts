import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useQuestionStore = defineStore('question', () => {
  const aiGenerateQuestionId = ref("")
  function setAiGenerateQuestionId(id: string) {
    aiGenerateQuestionId.value = id
  }
  return {
    aiGenerateQuestionId,
    setAiGenerateQuestionId
  }
})