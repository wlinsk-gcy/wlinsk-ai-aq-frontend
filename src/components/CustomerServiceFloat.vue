<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconArrowUp,
  IconDown,
  IconQuestionCircle,
  IconVoice,
  IconRecordStop
} from '@arco-design/web-vue/es/icon'
import { useUserStore } from '@/stores/userStore'
import { createSession, hotExamples } from '@/api/controller/user/SessionController'
import type { Example, QuerySessionRecordsRespDTO } from '@/api/models/user/chatSession/SessionDTO'
import { useChatSessionStore } from '@/stores/chatSessionStore'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { useChatRecordsStore } from '@/stores/chatRecordsStore'
import { MessageTypeEnum } from '@/api/models/enums/MessageTypeEnum'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'
import ChatRecordAppCard from '@/components/ChatRecordAppCard.vue'
import { useRouter } from 'vue-router'
import { stop } from '@/api/controller/user/ChatController'

const router = useRouter()
const userStore = useUserStore()
const chatSessionStore = useChatSessionStore()
const chatRecordsStore = useChatRecordsStore()

interface ChatMessage {
  id: string
  content: string
  from: MessageTypeEnum
  time: string
  appInfos?: QueryAppDetailsRespDTO[]
}

const visible = ref(false)
const input = ref('')
const messages = ref<ChatMessage[]>([])
const canCreateSession = ref(true)
const hotQuestions = ref<Example[]>([])
const sessionHistory = ref<QuerySessionRecordsRespDTO>()
const currentSessionId = ref<string>()

marked.use(
  markedHighlight({
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      }
      return hljs.highlightAuto(code).value
    }
  })
)

marked.setOptions({
  gfm: true,
  breaks: true
})
const renderMarkdown = (md: string) => {
  return marked(md)
}

const changeSession = async (sessionId?: string) => {
  if (!sessionId) {
    Message.warning('会话Id不能为空')
    return
  }
  if (sessionId === currentSessionId.value) {
    return
  }
  let records = chatRecordsStore.get(sessionId)
  if (!records || records.length === 0) {
    await chatRecordsStore.fetchRecords(sessionId)
    records = chatRecordsStore.get(sessionId)
  }
  messages.value = records.map((record) => {
    return {
      id: record.id ?? crypto.randomUUID(),
      content: record.content,
      from: record.type,
      appInfos: record.params?.appInfos ? JSON.parse(record.params?.appInfos) : null
    }
  }) as ChatMessage[]
  currentSessionId.value = sessionId
}
const sendMessageLoading = ref(false)
// 发送消息
const controller = new AbortController()
const sendMessage = async () => {
  if (sendMessageLoading.value) {
    return
  }
  sendMessageLoading.value = true
  try {
    if (!input.value.trim()) {
      Message.warning('请输入内容')
      return
    }
    if (!currentSessionId.value) {
      Message.warning('会话Id不可为空')
      return
    }
    await userStore.fetchLoginUser()
    if (userStore.userAIPoint <= 0) {
      Message.error('今日的AI积分已用完，请明天再来~')
      return
    }
    let question = input.value
    const msg: ChatMessage = {
      id: Date.now().toString(),
      content: input.value,
      from: MessageTypeEnum.USER,
      time: new Date().toLocaleTimeString()
    }
    messages.value.push(msg)
    chatRecordsStore.append(currentSessionId.value, {
      content: msg.content,
      id: msg.id,
      type: msg.from
    })
    input.value = ''
    const think: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: '给我一点时间，我正在思考您的问题',
      from: MessageTypeEnum.ASSISTANT,
      time: new Date().toLocaleTimeString()
    }
    messages.value.push(think)
    const response = await fetch(import.meta.env.VITE_REQUEST_HOST + `/chat/do`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': `${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        question: question,
        sessionId: currentSessionId.value
      }),
      signal: controller.signal // 将 AbortController 的 signal 传递给 fetch
    })
    if (!response.body) {
      console.error('No response body')
      return
    }
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      // 最后一行可能是半截 JSON，先取出来保留
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:') || trimmed === 'data:') continue
        const jsonString = trimmed.replace(/^data:\s*/, '')
        try {
          const json = JSON.parse(jsonString)
          if (json.eventType === 1001 && json.eventData && json.eventData !== 'null') {
            if (messages.value[messages.value.length - 1].id === think.id) {
              messages.value.pop()
              const reply: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: json.eventData,
                from: MessageTypeEnum.ASSISTANT,
                time: new Date().toLocaleTimeString()
              }
              messages.value.push(reply)
            } else {
              messages.value[messages.value.length - 1] = {
                ...messages.value[messages.value.length - 1],
                content: messages.value[messages.value.length - 1].content + json.eventData
              }
            }
          } else if (json.eventType === 1002) {
            let valueElement = messages.value[messages.value.length - 1]
            chatRecordsStore.append(currentSessionId.value, {
              content: valueElement.content,
              id: valueElement.id,
              type: valueElement.from,
              params: {
                appInfos: valueElement.appInfos ? JSON.stringify(valueElement.appInfos) : ''
              }
            })
            console.log('消息结束')
          } else if (json.eventType === 1003 && Array.isArray(json.eventData)) {
            messages.value[messages.value.length - 1] = {
              ...messages.value[messages.value.length - 1],
              appInfos: json.eventData //JSON.parse() // 直接设置为数组
            }
          } else if (json.eventType === 1004 && json.eventData) {
            if (messages.value[messages.value.length - 1].id === think.id) {
              messages.value.pop()
              const reply: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: json.eventData,
                from: MessageTypeEnum.ASSISTANT,
                time: new Date().toLocaleTimeString()
              }
              messages.value.push(reply)
            } else {
              messages.value[messages.value.length - 1] = {
                ...messages.value[messages.value.length - 1],
                content: messages.value[messages.value.length - 1].content + json.eventData
              }
            }
            let valueElement = messages.value[messages.value.length - 1]
            chatRecordsStore.append(currentSessionId.value, {
              content: valueElement.content,
              id: valueElement.id,
              type: valueElement.from,
              params: {
                appInfos: valueElement.appInfos ? JSON.stringify(valueElement.appInfos) : ''
              }
            })
            break
          }
        } catch (e) {
          console.error('JSON解析失败：', line)
        }
      }
    }
    //获取当前最新历史会话的id给后端，判断是否需要更新会话列表
    if (
      chatSessionStore.sessionRecords &&
      (chatSessionStore.sessionRecords.lastSessionId != chatSessionStore.currentSessionId ||
        (chatSessionStore.sessionRecords?.today && !chatSessionStore.sessionRecords.today[0].title))
    ) {
      // console.log('chatSessionStore.fetchSessionRecords()')
      await chatSessionStore.fetchSessionRecords()
      if (!currentSessionId.value) {
        // console.log('querySessionRecords设置currentSessionId')
        currentSessionId.value = chatSessionStore.currentSessionId
      }
      sessionHistory.value = chatSessionStore.sessionRecords
    }
    //更新ai点数
    await userStore.fetchLoginUser()
  } finally {
    sendMessageLoading.value = false
  }
}

const stopMessage = async () => {
  if (!currentSessionId.value) {
    // console.log('currentSessionId为空')
    return
  }
  await stop(currentSessionId.value)
}

const handleOpen = () => {
  if (!userStore.loginUser.userId) {
    Message.warning('登录后可体验智能客服~')
    return
  }
  visible.value = true
}
const handleClose = () => {
  visible.value = false
}

const createNewSession = async () => {
  messages.value = []
  const session = await createSession()
  chatSessionStore.currentSessionId = session.data?.sessionId
  currentSessionId.value = session.data?.sessionId
  if (session.data?.examples) {
    hotQuestions.value = session.data?.examples
  }
}

const querySessionRecords = async () => {
  // 加载历史
  if (!chatSessionStore.sessionRecords) {
    // console.log('CustomerServiceFloat.vue调用chatSessionStore.fetchSessionRecords()')
    await chatSessionStore.fetchSessionRecords()
    if (!currentSessionId.value) {
      // console.log('querySessionRecords设置currentSessionId')
      currentSessionId.value = chatSessionStore.currentSessionId
    }
  }
  sessionHistory.value = chatSessionStore.sessionRecords
}

function fillInput(q: Example) {
  input.value = q.describe ?? ''
}

const changeHotQuestions = async () => {
  // 随机换一组
  let hots = await hotExamples(3)
  hotQuestions.value = hots.data ?? []
}

const queryCurrentSessionRecords = async () => {
  // console.log('queryCurrentSessionRecords')
  if (!currentSessionId.value && !chatSessionStore.currentSessionId) {
    // console.log('currentSessionId为空')
    return
  }
  if (!currentSessionId.value) {
    currentSessionId.value = chatSessionStore.currentSessionId
  }
  if (!currentSessionId.value) {
    return
  }
  const messageVOs = chatRecordsStore.get(currentSessionId.value)
  const existingIds = new Set(messages.value.map((msg) => msg.id))
  if (messageVOs && messageVOs.length > 0) {
    messages.value = messageVOs
      .filter((record) => !existingIds.has(record.id ?? crypto.randomUUID()))
      .map((record) => {
        return {
          id: record.id ?? crypto.randomUUID(),
          content: record.content,
          from: record.type,
          appInfos: record.params?.appInfos ? JSON.parse(record.params?.appInfos) : null
        }
      }) as ChatMessage[]
  }
}
const initLoadHistory = ref(false)
watchEffect(async () => {
  // console.log('触发watchEffect')
  if(userStore.userId && !initLoadHistory.value) {
    // console.log('历史记录初始化，userid：{}，initLoadHistory：{}', userStore.userId, initLoadHistory.value)
    await changeHotQuestions()
    await querySessionRecords()
    await queryCurrentSessionRecords()
    initLoadHistory.value = true
  }
})
</script>

<template>
  <a-popover>
    <div style="position: fixed; right: 64px; bottom: 128px; z-index: 9999" v-show="!visible">
      <img
        src="/客服办公.svg"
        alt="智能客服"
        style="
          width: 128px;
          height: 128px;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 8px #ccc;
          background: #fff;
        "
        @click="handleOpen"
      />
    </div>
    <template #content>
      <p>我是智能客服，有疑惑可以找我哟~</p>
    </template>
  </a-popover>
  <!-- 聊天窗口抽屉 -->
  <a-drawer
    :visible="visible"
    :width="600"
    placement="right"
    :footer="false"
    unmountOnClose
    @cancel="handleClose"
    :header-style="{ padding: '0 16px', borderBottom: '1px solid #f0f0f0' }"
    :body-style="{ padding: 0, background: '#f7f8fa' }"
  >
    <template #header>
      <!-- 顶部栏 -->
      <a-button-group>
        <icon-down @click="handleClose" />
        <a-button type="text" :disabled="!canCreateSession" @click="createNewSession">
          创建会话
        </a-button>
        <a-dropdown>
          <a-button
            type="text"
            :disabled="
              !sessionHistory?.today &&
              !sessionHistory?.recentWeek &&
              !sessionHistory?.recentMonth &&
              !sessionHistory?.recentYear
            "
            >历史记录
          </a-button>
          <template #content>
            <a-dgroup title="当天" v-if="sessionHistory?.today
            && sessionHistory?.today.length > 0
            && sessionHistory.today[0].title">
              <a-doption
                v-for="item in sessionHistory.today"
                :key="item.sessionId"
                @click="changeSession(item.sessionId)"
              >
                {{
                  item.title && item.title.length > 16
                    ? item.title.substring(0, 16) + '...'
                    : item.title
                }}
              </a-doption>
            </a-dgroup>
            <a-dgroup
              title="近一周"
              v-if="sessionHistory?.recentWeek && sessionHistory?.recentWeek.length > 0"
            >
              <a-doption
                v-for="item in sessionHistory.recentWeek"
                :key="item.sessionId"
                @click="changeSession(item.sessionId)"
                >{{
                  item.title && item.title.length > 16
                    ? item.title.substring(0, 16) + '...'
                    : item.title
                }}
              </a-doption>
            </a-dgroup>
            <a-dgroup
              title="近一月"
              v-if="sessionHistory?.recentMonth && sessionHistory?.recentMonth.length > 0"
            >
              <a-doption
                v-for="item in sessionHistory.recentMonth"
                :key="item.sessionId"
                @click="changeSession(item.sessionId)"
                >{{
                  item.title && item.title.length > 16
                    ? item.title.substring(0, 16) + '...'
                    : item.title
                }}
              </a-doption>
            </a-dgroup>
            <a-dgroup
              title="近一年"
              v-if="sessionHistory?.recentYear && sessionHistory?.recentYear.length > 0"
            >
              <a-doption
                v-for="item in sessionHistory.recentYear"
                :key="item.sessionId"
                @click="changeSession(item.sessionId)"
                >{{
                  item.title && item.title.length > 16
                    ? item.title.substring(0, 16) + '...'
                    : item.title
                }}
              </a-doption>
            </a-dgroup>
          </template>
        </a-dropdown>
      </a-button-group>
    </template>
    <!-- 欢迎区 -->
    <div class="cs-welcome" v-if="messages.length === 0">
      <img
        src="/客服办公.svg"
        style="
          width: 128px;
          height: 128px;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 8px #ccc;
          background: #fff;
        "
      />
      <div class="cs-title">Hello，我是Ansure AI助理</div>
      <div class="cs-desc">我不仅能推荐题库、答疑解惑，还能为您激发创意、畅聊心事。</div>
      <div class="cs-demo-title">试试这样问我：</div>
      <div class="cs-hot-questions">
        <a-row :gutter="20" :style="{ marginBottom: '20px' }">
          <a-col :span="8" v-for="(example, idx) in hotQuestions" :key="idx">
            <a-card
              :style="{ width: '160px', height: '160px' }"
              @click="fillInput(example)"
              hoverable
              :bordered="false"
            >
              <template #title>
                <icon-question-circle />
                {{ example.title }}
              </template>
              {{ example.describe }}
            </a-card>
          </a-col>
        </a-row>
      </div>
      <a-button type="text" @click="changeHotQuestions">换一换</a-button>
    </div>
    <!-- 聊天区 -->
    <div class="cs-chat-list" v-else>
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['cs-msg', msg.from === MessageTypeEnum.USER ? 'user' : '']"
      >
        <a-avatar :size="32">
          <img
            :src="
              msg.from === MessageTypeEnum.USER ? userStore.loginUser.userAvatar : '/客服办公.svg'
            "
            alt="avatar"
          />
        </a-avatar>
        <!-- ✅ 保持统一容器，内部再区分内容 -->
        <div class="cs-msg-body">
          <div class="cs-msg-content" v-html="renderMarkdown(msg.content)" />
          <div class="cs-msg-content-card" v-if="msg.appInfos">
            <ChatRecordAppCard
              v-for="app in msg.appInfos"
              :key="app.appId"
              :card="app"
              @click="router.push(`/app/details/${app.appId}`)"
              style="cursor: pointer"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 输入区 -->
    <div class="cs-input-bar">
      <a-textarea
        v-model="input"
        allow-clear
        :auto-size="{ minRows: 1, maxRows: 10 }"
        placeholder="请将您的问题告诉我，Shift+Enter换行"
        @keydown.enter.exact.prevent="sendMessage"
        @keydown.shift.enter.stop
      />
      <a-popover>
        <a-button v-if="sendMessageLoading" @click="stopMessage">
          <icon-record-stop />
        </a-button>
        <template #content>
          <p>停止生成</p>
        </template>
      </a-popover>
      <!--<a-popover>-->
      <!--  <a-button>-->
      <!--    <icon-voice />-->
      <!--  </a-button>-->
      <!--  <template #content>-->
      <!--    <p>语音转文字模式</p>-->
      <!--  </template>-->
      <!--</a-popover>-->
      <a-button :loading="sendMessageLoading" @click="sendMessage">
        <icon-arrow-up />
      </a-button>
    </div>
  </a-drawer>
</template>

<style scoped>
.cs-header {
  display: flex;
  align-items: center;
  padding: 12px 0;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  justify-content: space-between;
}

.cs-welcome {
  min-height: 500px;
  height: 70%;
  text-align: center;
  padding: 32px 16px 16px 16px;
  background: #f7f8fa;
}

.cs-title {
  font-size: 18px;
  font-weight: bold;
  margin: 12px 0 4px 0;
}

.cs-desc {
  color: #888;
  margin-bottom: 12px;
}

.cs-demo-title {
  color: #666;
  margin: 8px 0 4px 0;
}

.cs-hot-questions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.cs-chat-list {
  min-height: 500px;
  height: 70%;
  overflow-y: auto;
  padding: 16px;
  background: #f7f8fa;
}

.cs-msg {
  display: flex;
  align-items: flex-end;
  margin-bottom: 12px;
}

.cs-msg.user {
  flex-direction: row-reverse;
}

.cs-msg-body {
  /*margin: 0 8px;*/
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.cs-msg-content {
  background: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 0 8px;
  word-break: break-all;
  box-shadow: 0 1px 4px #eee;
}

/*markdown格式渲染代码块和表格元素*/
::v-deep(.cs-msg-content pre) {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
  padding: 12px;
  background: #f6f8fa;
  border-radius: 6px;
  font-size: 14px;
}

::v-deep(.cs-msg-content pre code) {
  white-space: pre-wrap;
  word-break: break-word;
}

::v-deep(.cs-msg-content table) {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 14px;
}

::v-deep(.cs-msg-content th),
::v-deep(.cs-msg-content td) {
  border: 1px solid #dcdcdc;
  padding: 8px 12px;
  text-align: left;
  word-break: break-word;
  background-color: #fff;
}

::v-deep(.cs-msg-content th) {
  background-color: #f6f8fa;
  font-weight: bold;
}

/*markdown格式渲染代码块和表格元素*/

.cs-msg-content-card {
  border-radius: 8px;
  margin: 0 8px;
  word-break: break-all;
}

.cs-input-bar {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 16px 12px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}
</style>
