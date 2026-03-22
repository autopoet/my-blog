<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  slug: { type: String, required: true }
})

const comments = ref([])
const author = ref('')
const content = ref('')
const isSubmitting = ref(false)
const isLoading = ref(true)

// 1. 初次加载：获取历史留言
onMounted(async () => {
  try {
    const res = await fetch(`/api/comments?slug=${props.slug}`)
    const data = await res.json()
    // 获取到的往往是从新到旧的数据（因为后端我们用了 LPUSH）
    comments.value = data.comments || []
  } catch (e) {
    console.error('加载评论失败', e)
  } finally {
    isLoading.value = false
  }
})

// 2. 提交新评论
const submitComment = async () => {
  // 防止空内容和连击重复提交
  if (!content.value.trim() || isSubmitting.value) return

  isSubmitting.value = true

  // 构建即将要保存的数据对象
  const newComment = {
    author: author.value.trim() || '匿名访客',
    content: content.value.trim(),
    // 获取当前时间戳作为展示（实际项目中大都在后端产生时间）
    date: new Date().toLocaleString('zh-CN', { hour12: false })
  }

  // --- 【面试最核心亮点：乐观更新 (Optimistic UI)】 ---
  // 不等服务器慢吞吞得返回，我们“假装”它已经成功了，直接在前端把它推入数组的最顶部
  // 这样用户会觉得点击发送按钮“瞬间”就收到了反馈，极致的流畅体验！
  comments.value.unshift(newComment)

  // 提前把输入框清空
  const tempContent = content.value
  content.value = ''

  try {
    // 真正向后端发起 POST 请求把数据存入云端 Redis
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: props.slug,
        author: newComment.author,
        content: newComment.content,
        date: newComment.date
      })
    })

    if (!res.ok) {
      throw new Error('服务器端保存失败')
    }
    // 如果走到这，说明真实成功了。由于我们预先在前端做了乐观更新，所以不需要再操作 DOM 了
  } catch (error) {
    console.error('评论提交真实失败，触发状态回滚', error)
    // --- 【异常处理回滚】 ---
    // 如果真正的网络请求失败了（断网了），必须把刚才假冒的那条数据从列表里删掉（撤回操作）
    comments.value.shift()
    // 把文字还给用户，免得重打
    content.value = tempContent
    alert('网络异常，评论发布失败请重试')
  } finally {
    // 无论成功失败，恢复按钮状态
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="article-comments" style="margin-top: 50px; border-top: 1px solid #eaecef; padding-top: 30px;">
    <h3 style="margin-bottom: 20px; font-size: 1.3em;">留言板</h3>

    <!-- 发布表单区域 -->
    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px; background: #fafafa; padding: 20px; border-radius: 8px;">
      <input
        v-model="author"
        type="text"
        placeholder="你的昵称 (选填)"
        style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; max-width: 300px; font-size: 14px; background: white;"
      />
      <textarea
        v-model="content"
        placeholder="写下你的想法... (前端防XSS注入测试：输入 <script>alert(1)</script> 看看会不会有恶意的弹窗攻击)"
        rows="4"
        style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; font-size: 14px; font-family: inherit; background: white;"
      ></textarea>

      <!-- 提交防抖与视觉反馈反馈锁定 -->
      <button
        @click="submitComment"
        :disabled="!content.trim() || isSubmitting"
        style="align-self: flex-start; padding: 10px 24px; background: #0078d7; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: all 0.2s ease;"
        :style="{ opacity: (!content.trim() || isSubmitting) ? 0.4 : 1 }"
      >
        {{ isSubmitting ? '发送中...' : '发送评论' }}
      </button>
    </div>

    <!-- 评论列表展示区域 -->
    <div v-if="isLoading" style="text-align: center; color: #888; padding: 20px;">
      加载评论中...
    </div>
    <div v-else-if="comments.length > 0" style="display: flex; flex-direction: column; gap: 16px;">
      <!-- 循环渲染每一条留言 -->
      <div v-for="(item, index) in comments" :key="index" style="padding: 16px; border: 1px solid #eee; border-radius: 8px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <div style="font-size: 0.9em; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #333;">@{{ item.author }}</strong>
          <span style="color: #999; font-size: 0.85em;">{{ item.date }}</span>
        </div>
        <!-- 重点防线：Vue 使用双花括号输出文本，会自动对其中包含的 HTML 等特殊符号进行转义！ -->
        <!-- 这是前端防御存储型 XSS 最核心也是最底层的一道防线。绝对不能用 v-html! -->
        <div style="line-height: 1.6; word-break: break-all; color: #444;">{{ item.content }}</div>
      </div>
    </div>
    <div v-else style="text-align: center; color: #888; padding: 30px; border: 1px dashed #ddd; border-radius: 8px; background: #f9f9f9;">
      暂无评论，快来抢占第一楼吧！
    </div>
  </div>
</template>
