<script setup>
import { ref, onMounted } from 'vue'

// 接收外部传入的文章标识
const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const views = ref(null)
const isLoading = ref(true)

// Vue 八股：为什么在这里发请求？
// 因为 onMounted 代表组件已经被挂载到了真实的 DOM 上。如果是在服务端渲染(SSR/SSG)，我们不希望在服务端发起浏览量请求，
// 只有当真正到了用户的浏览器端，真实渲染出来了，才算一次有效的“浏览”。
onMounted(async () => {
  try {
    // 发起同源的网络请求（不会有 CORS 跨域问题，因为 api 在同一个域名下）
    const response = await fetch(`/api/views?slug=${props.slug}`)
    const data = await response.json()
    views.value = data.views
  } catch (err) {
    console.error('获取浏览量失败', err)
    views.value = 0
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <span class="article-views">
    <!-- 图标使用了 UnoCSS / Valaxy 默认内置的图标库 -->
    <i class="i-ri-eye-line mr-1" />
    <span v-if="isLoading">加载中...</span>
    <span v-else>{{ views }}</span>
    浏览
  </span>
</template>

<style scoped>
.article-views {
  display: inline-flex;
  align-items: center;
  font-size: 0.9em;
  color: #888;
  margin-left: 8px;
  padding: 4px 8px;
  background-color: var(--va-c-bg-soft, #f4f4f4);
  border-radius: 4px;
}
</style>
