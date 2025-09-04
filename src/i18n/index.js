import Vue from 'vue'
import en from '../../locals/en-US.json'
import zh from '../../locals/zh-CN.json'

const map = {
  zh_cn: zh,
  en_us: en
}

// Create a reactive object to store the current language
const i18n = Vue.observable({
  lang: localStorage.getItem('language') || 'zh_cn'
})

// Function to get translation based on the current language
export function translate (path) {
  if (map[i18n.lang]) {
    return map[i18n.lang][path]
  }
  return path
}

// Function to change language and update localStorage
export function setLang (newLang) {
  if (map[newLang]) {
    i18n.lang = newLang
  }
}
// Optional: Watch for external changes to localStorage (e.g., in another tab)
window.addEventListener('storage', event => {
  if (event.key === 'language' && map[event.newValue]) {
    i18n.lang = event.newValue
  }
})
