---
title: Vite 基础教程
date: 2025-11-12
categories:
  - 学学技术
tags:
  - Vite
  - 前端工具
  - 构建工具
---

> 为什么 Vite 这么快？因为它利用了浏览器原生的 ES 模块 (ESM)。

## 1. 为什么选择 Vite？

| 特性 | Webpack (传统) | Vite (现代) |
| :--- | :--- | :--- |
| **冷启动** | 慢 (需要先打包才能运行) | **快** (按需编译) |
| **HMR (热更新)** | 随着文件增多而变慢 | **恒定** (由于缓存机制) |
| **配置复杂度** | 较高 (loader/plugin 繁琐) | **开箱即用** (配置极简) |

---

## 2. 基础配置指南

### **初始化项目**
```bash
npx create-vite@latest <project-name>
```

### **核心配置文件 `vite.config.ts`**
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

---

## 3. 构建与部署

### **生产环境构建**
```bash
npm run build
```
Vite 使用 **Rollup** 进行生产环境打包，确保输出代码极其精简。

> [!TIP]
> **多页面应用 (MPA)**：Vite 完美支持多入口配置，只需在 `build.rollupOptions.input` 中指定多个 HTML 文件即可。

---

## 4. 总结
Vite 不仅是一个构建工具，它代表了前端开发的未来。如果你还在使用传统的打包工具，强烈建议尝试 Vite。
