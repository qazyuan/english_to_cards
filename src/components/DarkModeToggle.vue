<template>
  <button
    type="button"
    @click="toggleDark"
    :class="[
      'relative w-14 h-8 rounded-full flex items-center transition-colors duration-500',
      isDark ? 'bg-gray-800' : 'bg-gray-200'
    ]"
    aria-label="切换暗黑模式"
  >
    <span
      :class="[
        'absolute left-1 transition-all duration-500 flex items-center justify-center',
        'w-6 h-6 rounded-full shadow-md',
        isDark
          ? 'translate-x-6 bg-gradient-to-br from-gray-700 to-black'
          : 'translate-x-0 bg-gradient-to-br from-yellow-300 to-yellow-500'
      ]"
    >
      <svg v-if="!isDark" class="w-4 h-4 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle v-bind="{ cx: 12, cy: 12, r: 5, 'stroke-width': 2 }" />
        <path
          v-bind="{ 'stroke-linecap': 'round', 'stroke-width': 2 }"
          d="M12 1v2m0 16v2m11-9h-2M3 12H1m16.95-6.95l-1.41 1.41M4.46 19.54l-1.41 1.41m16.95 0l-1.41-1.41M4.46 4.46L3.05 3.05"
        />
      </svg>
      <svg v-else class="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-bind="{ 'stroke-width': 2 }" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
import { useDarkMode } from '../composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()
</script>
