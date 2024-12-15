<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router'
import type { AddAppReqDTO } from '@/api/models/user/app/AddAppDTO'
import { ref, watchEffect } from 'vue'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'
import PictureUploader from '@/components/PictureUpload.vue'
import { AppTypeEnum, AppTypeEnumMap } from '@/api/models/enums/AppTypeEnum'
import { ScoringStrategyEnum, ScoringStrategyEnumMap } from '@/api/models/enums/ScoringStrategyEnum'
import { addApp, queryById, updateApp } from '@/api/controller/user/appController'
import { Message } from '@arco-design/web-vue'

interface Props {
  appId?: string
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return ''
  }
})
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
const handleSubmit = async () => {
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
  }finally {
    submitting.value = false
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
      <a-form-item field="appName" label="应用名称" :rules="[{required:true,message:'请输入应用名称'}]">
        <a-input v-model="form.appName" placeholder="请输入应用名称" />
      </a-form-item>
      <a-form-item field="appDesc" label="应用描述" :rules="[{required:true,message:'请输入应用描述'}]">
        <a-input v-model="form.appDesc" placeholder="请输入应用描述" />
      </a-form-item>
      <a-form-item field="appIcon" label="应用图标" :rules="[{required:true,message:'请上传图片'}]">
        <PictureUploader :value="form.appIcon" :onChange="(value) => (form.appIcon = value)" />
      </a-form-item>
      <a-form-item field="appType" label="应用类型" :rules="[{required:true,message:'请选择应用类型'}]">
        <a-select v-model="form.appType" :style="{ width: '320px' }" placeholder="请选择应用类型">
          <!--<a-option
            v-for="(value, key) of AppTypeEnumMap"
            :key="key"
            :value="Number(key)"
            :label="value"
          />-->
          <a-option :key="AppTypeEnum.SCORE" :value="AppTypeEnum.SCORE" :label="AppTypeEnumMap[0]"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="scoringStrategy" label="评分策略" :rules="[{required:true,message:'请选择评分策略'}]">
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
          <a-option :key="ScoringStrategyEnum.CUSTOMIZED" :value="ScoringStrategyEnum.CUSTOMIZED" :label="ScoringStrategyEnumMap[0]"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button :loading="submitting" type="primary" html-type="submit" style="width: 120px"> 提交 </a-button>
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
