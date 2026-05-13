<template>
  <div class="w-full max-w-2xl p-8 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-300">欢迎回来</p>
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">你好，{{ userInfo.username }}</h2>
      </div>
      <DarkModeToggle />
    </div>
    <p class="mt-4 text-sm text-gray-600 dark:text-gray-300">当前角色：{{ userInfo.role }}</p>
  </div>
</template>

<script setup lang="ts">
import DarkModeToggle from './DarkModeToggle.vue'
import type { UserInfo } from '../types/user'

const userInfo: UserInfo = {
  username: '张三',
  role: '管理员',
}
</script>
