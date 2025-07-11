<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router'
import type { AddAppReqDTO } from '@/api/models/user/app/AddAppDTO'
import { ref, watchEffect, h } from 'vue'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'
import PictureUploader from '@/components/PictureUpload.vue'
import { AppTypeEnum, AppTypeEnumMap } from '@/api/models/enums/AppTypeEnum'
import { ScoringStrategyEnum, ScoringStrategyEnumMap } from '@/api/models/enums/ScoringStrategyEnum'
import { addApp, queryById, updateApp } from '@/api/controller/user/appController'
import { useUserStore } from '@/stores/userStore'
import { Message, Modal, Spin } from '@arco-design/web-vue'
import { MessageTypeEnum } from '@/api/models/enums/tj/MessageTypeEnum'

interface Props {
  appId?: string
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return ''
  }
})
const userStore = useUserStore()
//是否正在提交表单
const submitting = ref(false)
const router = useRouter()
const form = ref<AddAppReqDTO>({})
const oldApp = ref<QueryAppDetailsRespDTO>()
const loadData = async () => {
  if (props.appId === '' || props.appId.startsWith('__arco_menu')) {
    return
  }
  try {
    const result = await queryById(props.appId)
    oldApp.value = result.data
    form.value = {
      ...result.data
    }
  } catch (e: any) {
    Message.error('获取数据失败，' + e)
  }
}
const handleSubmit = async ({ values, errors }: any) => {
  if (errors) {
    return
  }
  try {
    submitting.value = true
    let notifyMessage = ''
    let targetUrl = ''
    if (props.appId === '') {
      //创建应用
      await addApp(form.value)
      notifyMessage = '首页'
      targetUrl = '/'
    } else {
      //修改应用
      await updateApp(form.value)
      notifyMessage = '应用详情页'
      targetUrl = `/app/details/${props.appId}`
    }
    Message.success('操作成功，为您跳转到' + notifyMessage)
    await router.push(targetUrl)
  } catch (e: any) {
    Message.error('操作失败，' + e)
  } finally {
    submitting.value = false
  }
}

enum generateType {
  write = 1,
  polish = 2
}

const ModalContent = () =>
  h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',     // 水平+垂直居中
        padding: '20px',
        minHeight: '120px',           // 给定高度便于垂直居中
        textAlign: 'center'
      }
    },
    [
      h(Spin, { dot: true, style: { width: '100%', height: '40px' } }),
      h('span', { style: 'margin-bottom: 10px;' }, 'AI生成中，请耐心等候哦~')
    ]
  )

const controller = new AbortController()
const aiGenerate = async (type: generateType) => {
  let question = ''
  // 表单校验
  if (type === generateType.write) {
    if (!form.value.appName) {
      Message.warning('请输入应用名称')
      return
    }
    question = form.value.appName
  } else {
    if (!form.value.appDesc) {
      Message.warning('请输入应用描述')
      return
    }
    question = form.value.appDesc
  }

  // 查询用户积分
  await userStore.fetchLoginUser()
  if (userStore.userAIPoint <= 0) {
    Message.error('今日的AI积分已用完，请明天再来~')
    return
  }
  // 打开 AI 生成提示弹窗
  const modalInstance = Modal.info({
    closable: false,
    maskClosable: false,
    footer: false,
    content: () => h(ModalContent)
  })
  try {
    // 模拟请求
    // await new Promise((resolve) => setTimeout(resolve, 3000))
    const response = await fetch(import.meta.env.VITE_TJ_PROJECT_HOST + `/chat/polish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        userId: `${userStore.loginUser.userId}`
      },
      body: JSON.stringify({
        question: question,
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
    const isFirstReceive = ref(true)
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
            if (isFirstReceive.value) {
              isFirstReceive.value = false;
              form.value.appDesc = ''
            }else {
              form.value.appDesc += json.eventData
            }
          } else if (json.eventType === 1002) {
            console.log('消息结束')
          }else if (json.eventType === 1004 && json.eventData) {
            Message.error('AI生成失败，请稍后重试')
            return
          }
        } catch (e) {
          console.error('JSON解析失败：', line)
        }
      }
    }

  } catch (err) {
    Message.error('生成失败，请稍后重试')
  } finally {
    // 无论成功或失败都关闭弹窗
    modalInstance.close()
    await userStore.fetchLoginUser()
  }
}

onBeforeRouteLeave(() => {
  //重修改应用的页面，直接点击导航栏切换到创建应用时，会出现数据仍然存在的情况，所有用户离开时清空数据
  form.value = {}
})
/**
 * 监听成员变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData()
})
</script>

<template>
  <div id="addAppPage">
    <p class="h2">{{ appId === '' ? '创建应用' : '修改应用' }}</p>
    <a-form
      :model="form"
      :style="{ width: '480px' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item
        field="appName"
        label="应用名称"
        :rules="[{ required: true, message: '请输入应用名称' }]"
      >
        <a-input v-model="form.appName" placeholder="请输入应用名称" />
      </a-form-item>
      <a-form-item
        field="appDesc"
        label="应用描述"
        :rules="[{ required: true, message: '请输入应用描述' }]"
      >
        <div style="width: 100%">
          <a-textarea
            v-model="form.appDesc"
            placeholder="请输入应用描述，在AI生成题目时，会将描述作为提示词哦！"
            :max-length="200"
            allow-clear
            show-word-limit
          />
          <div style="display: flex; justify-content: flex-end; margin-top: 8px; gap: 8px">
            <a-popover position="bottom">
              <a-button size="mini" type="text" @click="aiGenerate(generateType.write)">
                AI帮写
              </a-button>
              <template #content>
                <p>AI自动根据您的应用名称生成应用描述~</p>
              </template>
            </a-popover>
            <a-popover position="bottom">
              <a-button size="mini" type="text" @click="aiGenerate(generateType.polish)">
                AI润色
              </a-button>
              <template #content>
                <p>AI根据您当前的描述自动为您进行润色~</p>
              </template>
            </a-popover>
          </div>
        </div>
      </a-form-item>
      <a-form-item
        field="appIcon"
        label="应用图标"
        :rules="[{ required: true, message: '请上传图片' }]"
      >
        <PictureUploader :value="form.appIcon" :onChange="(value) => (form.appIcon = value)" />
      </a-form-item>
      <a-form-item
        field="appType"
        label="应用类型"
        :rules="[{ required: true, message: '请选择应用类型' }]"
      >
        <a-select v-model="form.appType" :style="{ width: '320px' }" placeholder="请选择应用类型">
          <!--<a-option
            v-for="(value, key) of AppTypeEnumMap"
            :key="key"
            :value="Number(key)"
            :label="value"
          />-->
          <a-option
            :key="AppTypeEnum.SCORE"
            :value="AppTypeEnum.SCORE"
            :label="AppTypeEnumMap[0]"
          ></a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        field="scoringStrategy"
        label="评分策略"
        :rules="[{ required: true, message: '请选择评分策略' }]"
      >
        <a-select
          v-model="form.scoringStrategy"
          :style="{ width: '320px' }"
          placeholder="请选择评分策略"
        >
          <!--<a-option
            v-for="(value, key) of ScoringStrategyEnumMap"
            :key="key"
            :value="Number(key)"
            :label="value"
          />-->
          <a-option
            :key="ScoringStrategyEnum.CUSTOMIZED"
            :value="ScoringStrategyEnum.CUSTOMIZED"
            :label="ScoringStrategyEnumMap[0]"
          ></a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button :loading="submitting" type="primary" html-type="submit" style="width: 120px">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="scss">
#addAppPage {
  .h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
    margin-bottom: 32px;
  }
}
</style>
