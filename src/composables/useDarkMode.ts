import { ref, watchEffect } from 'vue'

const isDark = ref(
  window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? true
    : !!document.documentElement.classList.contains('dark')
)

export function useDarkMode() {
  const toggleDark = () => {
    isDark.value = !isDark.value
  }

  watchEffect(() => {
    const root = document.documentElement
    if (isDark.value) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  })

  return {
    isDark,
    toggleDark,
  }
}
