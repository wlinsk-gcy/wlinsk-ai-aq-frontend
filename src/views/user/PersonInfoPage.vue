<script setup lang="ts">
import { ref } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { IconEdit } from '@arco-design/web-vue/es/icon'
import type { QueryUserDetailRespDTO } from '@/api/models/user/user/QueryUserDetailRespDTO'
import { logout, queryDetails, updatePassword } from '@/api/controller/user/userController'
import PictureUploader from '@/components/PictureUpload.vue'
import { useRouter } from 'vue-router'
import { s } from 'unimport/dist/shared/unimport.b308f22b'

let router = useRouter()
const userInfo = ref<QueryUserDetailRespDTO>({})
const passwordVisible = ref(false)
const editNameVisible = ref(false)
const editProfileVisible = ref(false)

// 表单数据
const nameForm = ref({
  userName: ''
})

const profileForm = ref({
  userProfile: ''
})

const passwordForm = ref({
  originalPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const result = await queryDetails()
    userInfo.value = result.data as QueryUserDetailRespDTO
    nameForm.value.userName = userInfo.value.userName ?? ''
    profileForm.value.userProfile = userInfo.value.userProfile ?? ''
  } catch (e: any) {
    Message.error('获取用户信息失败')
  }
}

// 处理头像更新
const handleAvatarUpdate = async (value: string) => {
  try {
    // TODO: 调用更新头像接口
    userInfo.value.userAvatar = value
    Message.success('头像更新成功')
    await loadUserInfo()
  } catch (e: any) {
    Message.error('头像更新失败')
  }
}

// 更新用户名
const handleUpdateName = async () => {
  Modal.confirm({
    title: '确认修改',
    content: '确定要修改用户名吗？',
    onOk: async () => {
      try {
        // TODO: 调用更新接口
        Message.success('更新成功')
        editNameVisible.value = false
        await loadUserInfo()
      } catch (e: any) {
        Message.error('更新失败')
      }
    }
  })
}

// 更新简介
const handleUpdateProfile = async () => {
  Modal.confirm({
    title: '确认修改',
    content: '确定要修改个人简介吗？',
    onOk: async () => {
      try {
        // TODO: 调用更新接口
        Message.success('更新成功')
        editProfileVisible.value = false
        await loadUserInfo()
      } catch (e: any) {
        Message.error('更新失败')
      }
    }
  })
}

// 修改密码
const handleUpdatePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmNewPassword) {
    Message.error('两次输入的密码不一致')
    return
  }
  Modal.confirm({
    title: '确认修改',
    content: '确定要修改密码吗？',
    onOk: async () => {
      try {
        // TODO: 调用修改密码接口
        await updatePassword(passwordForm.value)
        Message.success('密码修改成功')
        await logout()
        await router.push('/user/login')
      } catch (e: any) {
        Message.error(e)
      }finally {
        passwordVisible.value = false
        passwordForm.value = {
          originalPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }
      }
    }
  })
}

// 格式化时间
const formatDate = (date: string | any) => {
  return new Date(date).toLocaleString()
}

// 在 script setup 部分添加角色映射
const roleMap: {[key: string]: string} = {
  admin: '管理员',
  user: '普通用户',
  ban: '已注销'
}

// 初始加载
loadUserInfo()
</script>

<template>
  <div id="personInfoPage">
    <a-card>
      <p class="h2">个人信息</p>
      <div class="info-container">
        <!-- 头像部分 -->
        <div class="avatar-section">
          <PictureUploader
            :value="userInfo.userAvatar"
            :onChange="handleAvatarUpdate"
            class="large-avatar-uploader"
          >
            <template #default="{ preview }">
              <div class="avatar-container">
                <img :src="preview || userInfo.userAvatar" class="avatar-image" />
                <div class="avatar-mask">点击更换头像</div>
              </div>
            </template>
          </PictureUploader>
        </div>

        <!-- 信息部分 -->
        <div class="info-section">
          <a-descriptions :column="1">
            <a-descriptions-item label="用户ID">
              {{ userInfo.userId }}
            </a-descriptions-item>
            <a-descriptions-item label="账号">
              {{ userInfo.userAccount }}
            </a-descriptions-item>
            <a-descriptions-item label="密码">
              <div class="password-field">
                <span class="password-dots">••••••••</span>
                <a-button type="text" @click="passwordVisible = true">
                  <icon-edit />
                </a-button>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="用户名">
              <div class="editable-field">
                <span>{{ userInfo.userName }}</span>
                <a-button type="text" @click="editNameVisible = true">
                  <icon-edit />
                </a-button>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="个人简介">
              <div class="editable-field">
                <span>{{ userInfo.userProfile || '暂无简介' }}</span>
                <a-button type="text" @click="editProfileVisible = true">
                  <icon-edit />
                </a-button>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="用户角色">
              {{ roleMap[userInfo.userRole as string] }}
            </a-descriptions-item>
            <a-descriptions-item label="注册时间">
              {{ formatDate(userInfo.createTime ?? '') }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </a-card>

    <!-- 修改昵称弹窗 -->
    <a-modal
      v-model:visible="editNameVisible"
      title="修改昵称"
      @ok="handleUpdateName"
      @cancel="editNameVisible = false"
    >
      <a-form :model="nameForm">
        <a-form-item field="userName" label="新昵称">
          <a-input v-model="nameForm.userName" placeholder="请输入新昵称" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 修改简介弹窗 -->
    <a-modal
      v-model:visible="editProfileVisible"
      title="修改简介"
      @ok="handleUpdateProfile"
      @cancel="editProfileVisible = false"
    >
      <a-form :model="profileForm">
        <a-form-item field="userProfile" label="新简介">
          <a-textarea
            v-model="profileForm.userProfile"
            placeholder="请输入新的个人简介"
            :max-length="200"
            show-word-limit
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 修改密码弹窗 -->
    <a-modal
      v-model:visible="passwordVisible"
      title="修改密码"
      @ok="handleUpdatePassword"
      @cancel="passwordVisible = false"
    >
      <a-form :model="passwordForm">
        <a-form-item field="oldPassword" label="原密码">
          <a-input-password
            v-model="passwordForm.originalPassword"
            placeholder="请输入原密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="newPassword" label="新密码">
          <a-input-password
            v-model="passwordForm.newPassword"
            placeholder="请输入新密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="confirmPassword" label="确认密码">
          <a-input-password
            v-model="passwordForm.confirmNewPassword"
            placeholder="请再次输入新密码"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
#personInfoPage {
  .h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .info-container {
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: center;
  }

  .info-section {
    flex-grow: 1;
    width: 100%;
  }

  .editable-field,
  .password-field {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;

    span {
      flex-grow: 1;
      min-width: 0;
    }

    .arco-btn {
      padding: 0 4px;
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .password-field {
    .password-dots {
      font-family: monospace;
      letter-spacing: 2px;
      user-select: none;
      flex-grow: 1;
    }
  }
}
</style>