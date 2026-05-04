---
title: 复杂业务场景架构与疑难实现（下）
date: 2026-02-08
categories:
  - 前端
tags:
  - 场景模拟
  - 方案设计
  - 技术沉淀
---

<ArticleViews slug="frontend-architectural-scenarios-ii" />

> 本篇文章继续探讨前端业务场景中的架构抽象，涵盖自定义 Hook 的封装策略、窗口响应式监听以及 URL 参数解析的工程化方案。

## 一、 逻辑复用：高度集成的自定义 Hook 封装

### 1. 通用异步请求 Hook (useRequest)
利用组合式 API 将加载状态（Loading）与数据同步逻辑封装，实现全站风格一致的请求管理：
```javascript
function useRequest(apiFn) {
  const data = ref(null);
  const loading = ref(false);
  const run = async (...args) => {
    loading.value = true;
    try {
      data.value = await apiFn(...args);
    } finally {
      loading.value = false;
    }
  };
  return { data, loading, run };
}
```

---

## 二、 交互响应：窗口大小监听与自动销毁

### 2. 构建响应式布局 Hook (useWindowSize)
在大型 SPA 应用中，监听视口变化常用于触发图表重绘或调整侧边栏显隐状态：
```javascript
function useWindowSize() {
  const size = reactive({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });
  const onResize = () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
  };
  // 建立事件监听
  window.addEventListener('resize', onResize);
  // 在组件生命周期结束时注销监听器，防止内存泄漏
  onUnmounted(() => window.removeEventListener('resize', onResize));
  return size;
}
```

---

## 三、 数据解析：结构化参数处理

### 3. URL 查询参数 (Query Params) 的静态解析
针对不支持原生 `URLSearchParams` 的旧环境或纯字符串处理场景：
```javascript
function getQueryParams(url) {
  const params = {};
  const search = url.split('?')[1];
  if (!search) return params;
  
  search.split('&').forEach(pair => {
    const [key, val] = pair.split('=');
    if (key) {
      params[key] = decodeURIComponent(val || '');
    }
  });
  return params;
}
```

<ArticleComments slug="frontend-architectural-scenarios-ii" />
