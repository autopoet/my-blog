---
title: CampusHub：基于 Web Worker 的主线程阻塞优化
date: 2026-03-14
categories:
  - 聊聊项目
tags:
  - 面试
  - CampusHub
  - 性能优化
---

<ArticleViews slug="campushub-highlight-webworker" />

## 1. 为什么要做这个优化？
在 CampusHub 项目中，我们需要在前端渲染一整年的开发者动态热力图（类似 GitHub 的绿格子）。因为涉及几百个日期的遍历、状态匹配与颜色计算，这段原生 JS 逻辑执行时间较长（成为 Long Task）。
由于 **JS 是单线程的**，这段计算代码与浏览器的 UI 渲染共用一个主线程。如果不做优化，在计算完成前，用户无论是点击按钮还是滚动页面，都会发生严重的“卡死”现象。

## 2. 关键源码解释

为了解决主线程阻塞，我们将“重体力活”剥离到了 `Web Worker` 中。

### 【主线程代码】 (`Heatmap.vue`)
主线程只负责“派发任务”和“接收结果渲染”，极其轻量。
```javascript
import { ref, onMounted } from 'vue'

const heatmapData = ref([])
const isLoading = ref(true)

onMounted(() => {
  // 1. 实例化 Worker（新开一个后台线程）
  const worker = new Worker(new URL('../workers/heatmapWorker.js', import.meta.url), { type: 'module' })

  // 2. 向 Worker 发送需要计算的原始数据（比如用户的打卡记录）
  const rawEvents = [/* ...几千条原始数据... */]
  worker.postMessage({ type: 'CALCULATE', payload: rawEvents })

  // 3. 监听 Worker 的计算结果
  worker.onmessage = (e) => {
    if (e.data.type === 'SUCCESS') {
      heatmapData.value = e.data.result // 拿到算好的格子数组，直接交给 Vue 渲染
      isLoading.value = false
      worker.terminate() // 任务完成，过河拆桥销毁线程，释放内存
    }
  }
})
```

### 【Worker 线程代码】 (`heatmapWorker.js`)
这里是专门干苦力的后台线程，怎么卡都不影响主页面的滚动。
```javascript
// 监听主线程发来的消息
self.onmessage = (e) => {
  const { type, payload } = e.data

  if (type === 'CALCULATE') {
    // 模拟非常耗时的海量循环计算（比如给365天每天匹配数据结构）
    const result = performHeavyCalculation(payload)

    // 计算完毕后，将结果发回给主线程
    self.postMessage({
      type: 'SUCCESS',
      result: result
    })
  }
}

function performHeavyCalculation(raw) {
  // 耗时的数组 reduce 和 map 转换...
  return processedData;
}
```

## 3. 核心面试 Q&A

### 面问：JS 不是单线程吗？为什么你又能开“后台线程”了？
**你的回答：**
“其实 JS 语言本身确实是单线程的，但**浏览器绝不是单线程的**。浏览器里有 JS 引擎线程、GUI 渲染线程、网络请求线程等。
我使用的 `Web Worker` 是由浏览器宿主环境提供的一个 API，它允许我向浏览器申请单独开辟一个操作系统的真实级线程。这个新的 Worker 线程完全独立于主线程（V8引擎线程），所以它内部怎么狂算死循环，都不会对主线程的 UI 渲染和事件循环（Event Loop）造成任何阻塞。”

### 面问：Web Worker 既然这么爽，为什么平时不把所有的代码都放进去写？有什么局限性？
**你的回答：**
“Worker 不是银弹，它有两大严格限制：
1. **沙箱隔离，无法碰 DOM**：Worker 的全局对象是 `self` 且不和主线程共享内存，它不能访问 `window`、`document` 对象，所以不能在里面写改 UI 的代码。
2. **通信拷贝成本 (深拷贝)**：主线程和 Worker 通过 `postMessage` 交流，底层使用的是**结构化克隆算法（深拷贝）**。如果一来一回传递的数据有几百兆极其庞大，克隆数据所消耗的时间本身就会造成主线程卡顿（得不偿失）。所以主要适用于**计算密集型**的任务，而非传递巨量 DOM 结构的任务。”

### 面问：你这句提到了 Event Loop（事件循环），能简单讲一下吗？
**你的回答：**
“简单来说，Event Loop 就是 JS 应对单线程不卡死的调度机制。主线程执行栈空了之后，就会去任务队列里拿任务。
当我们在主线程 `postMessage` 给 Worker，或者给 Worker 绑 `onmessage` 时，这些其实都是被抛到了**宏任务（MacroTask）**队列里。不管 Worker 甚至 setTimeout 在后台干了多久，最后的回调一定要排在任务队列的末尾，等待 Event Loop 下一次轮询时才会被拿到主线程来正式执行变更 Vue 的响应式状态。”

<ArticleComments slug="campushub-highlight-webworker" />
