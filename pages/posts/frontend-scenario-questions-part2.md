---
title: 手撕代码-前端面试场景题（二）
date: 2026-02-08
categories:
  - 写写代码
tags:
  - 前端面试
  - 场景模拟
---
<ArticleViews slug="frontend-scenario-questions-part2" />


> 本篇文章主要整理前端常见的面试场景题。本部分模拟真实业务需求，考察开发者在特定约束条件下的技术方案选型与组件设计。这不再是单一知识点的考察，而是对 Vue/React 框架特性、CSS 布局及工程化手段的综合运用。面试官通过“你怎么实现”或“怎么优化”的提问，观察你是否具备系统设计思维。你给出的方案（如：虚拟滚动、防抖节流、Hook 封装）直接决定了你是否具备独立承担复杂业务模块的能力。

## 题目列表

### 1. 简易用 Hook 封装请求 (useRequest)
```javascript
function useRequest(apiFn) {
  const data = ref(null);
  const loading = ref(false);
  const run = async (...args) => {
    loading.value = true;
    data.value = await apiFn(...args);
    loading.value = false;
  };
  return { data, loading, run };
}
```

### 2. 监听窗口大小 Hook (useWindowSize)
```javascript
function useWindowSize() {
  const size = reactive({ width: window.innerWidth, height: window.innerHeight });
  const onResize = () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
  };
  window.addEventListener('resize', onResize);
  onUnmounted(() => window.removeEventListener('resize', onResize));
  return size;
}
```

### 3. 解析 URL 参数 (URLSearchParams)
```javascript
function getQueryParams(url) {
  const params = {};
  const search = url.split('?')[1];
  if (!search) return params;
  search.split('&').forEach(pair => {
    const [key, val] = pair.split('=');
    params[key] = decodeURIComponent(val);
  });
  return params;
}
```

<ArticleComments slug="frontend-scenario-questions-part2" />
