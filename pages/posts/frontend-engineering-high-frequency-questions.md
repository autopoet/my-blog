---
title: 前端工程化高频面试题
date: 2026-03-22
categories:
  - 啃啃原理
tags:
  - 工程化
  - 面试
  - 构建工具

---
<ArticleViews slug="frontend-engineering-high-frequency-questions" />


## 一、 错误捕获与白屏问题排查

### Q1：你在项目中是如何捕获 JavaScript 错误的？有哪些方式？

**答：**
- 使用 **try...catch** 捕获同步代码错误
- 利用 **window.onerror** 捕获运行时错误
- 使用 **window.addEventListener('unhandledrejection')** 捕获未处理的 Promise 异常
- 使用 **ErrorBoundary**（React 项目）捕获组件渲染错误
- **日志上报（埋点）系统** + **source map** 映射调试

### Q2：项目上线出现白屏问题，你是如何排查的？

**答：**
- 检查是否有**主 JS 加载失败**（查看 Chrome DevTools Network）
- 查看是否有**资源跨域**、**CDN 缓存**、**source map 报错**等问题
- 控制台是否有报错（如**模块加载失败**、**运行时错误**）
- **index.html** 是否渲染，或根组件是否挂载成功
- 加入 **loading skeleton** 或 **fallback** 机制防止页面完全空白
- 使用**性能监控平台**（如 Sentry 等开源库 or 公司自研的平台）追踪首屏渲染失败

---

## 二、 构建工具：Vite vs Webpack

### Q3：Vite 和 Webpack 构建流程的区别？

| 对比点 | Vite | Webpack |
| :--- | :--- | :--- |
| **启动速度** | **快**（原生 ESM + 按需加载） | **慢**（需打包全部依赖） |
| **构建速度** | **更快**（esbuild + rollup） | **慢**（全部打包 + 复杂 loader） |
| **热更新** | **局部更新快** | 模块热替换（HMR） |
| **使用的工具链** | esbuild + Rollup | 自身打包 |
| **开箱即用程度** | **高**，零配置即用 | 可配置性更强 |
| **生态插件** | Rollup 插件生态 + Vite 插件 | Webpack 插件丰富 |

### Q4：在什么场景下你更倾向于使用 Vite？

**答：**
- 开发阶段追求**启动快、热更快**的中小型项目
- **Vue3、React18 项目**，支持 modern 构建
- **多页面**或**组件库开发**

---

## 三、 模块系统与打包产物格式

### Q5：ESM 与 UMD 的区别？如何同时输出两种格式？

**答：**

| 特性 | ESM（ES Modules） | UMD（Universal Module Definition） |
| :--- | :--- | :--- |
| **导入方式** | `import / export` | 支持 **CommonJS、AMD 和全局变量** |
| **运行环境** | 现代浏览器、Node（ESM 支持） | 浏览器、Node 全兼容 |
| **Tree shaking** | **支持** | 不支持 |

**同时输出方式（以 Rollup 为例）：**

```javascript
export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.esm.js', format: 'es' },
      { file: 'dist/index.umd.js', format: 'umd', name: 'MyLib' },
    ],
    plugins: [typescript()],
  },
]
```

---

## 四、 Webpack 插件与 Loader 概念

### Q6：Plugin 和 Loader 有什么区别？

| 类型 | Loader | Plugin |
| :--- | :--- | :--- |
| **用途** | **转换模块内容**（如 JS、TS、CSS） | **拓展构建能力**（如打包优化、注入变量） |
| **执行时机** | 模块解析阶段 | 整个构建生命周期 |
| **例子** | `babel-loader`, `css-loader` | `HtmlWebpackPlugin`, `DefinePlugin` |

### Q7：你使用过哪些常用插件和 loader？

**Loader：**
- **babel-loader**：转译 JS
- **ts-loader / esbuild-loader**：处理 TypeScript
- **sass-loader / less-loader**：样式预处理
- **url-loader, file-loader**：处理图片/字体资源

**Plugin：**
- **HtmlWebpackPlugin**：生成 HTML 并注入打包资源
- **DefinePlugin**：注入全局变量
- **MiniCssExtractPlugin**：提取 CSS
- **CopyWebpackPlugin**：复制静态文件
- **BundleAnalyzerPlugin**：可视化打包体积分析

---

## 五、 包管理工具：npm vs pnpm

### Q8：npm 与 pnpm 有什么区别？pnpm 为什么构建更快？

**答：**

| 特性 | npm | pnpm |
| :--- | :--- | :--- |
| **安装机制** | 扁平安装（node_modules 膨胀） | 使用**硬链接**共享依赖，目录干净 |
| **性能** | 较慢 | **快速**，使用内容寻址的缓存机制 |
| **磁盘占用** | 多份依赖冗余 | **去重好**，磁盘空间使用少 |
| **工作区支持** | 有，但限制较多 | 原生支持 **monorepo** 项目 |

---

## 六、 Monorepo 理解

### Q9：什么是 Monorepo？你如何管理 Monorepo 项目？

**答：**

Monorepo（单一仓库）是将多个项目模块集中在一个代码仓库中管理的开发模式，常配合工具如：
- **pnpm workspace**
- **Lerna**（老工具）
- **Turborepo**（现代构建加速工具）

**优点：**
- 模块之间便于协作和共享
- 统一管理依赖和脚本
- 提高版本发布效率

**实践经验（如简历写了 Monorepo）：**
- 使用 **pnpm workspace** 管理组件库与主应用
- 设置根目录构建脚本，提升统一构建与测试效率
- 利用 **turbo.json** 设定缓存和依赖追踪，加速 CI/CD

---

## 七、 附加问题（工程化能力拓展）

### Q10：你是如何做性能优化的？

- 开启 **gzip 压缩**和代码分割 (**splitChunks**)
- 使用 **CDN**、**懒加载**、**预加载**
- **Tree-shaking**、**按需加载组件**
- **图片压缩**（如 imagemin）、使用 **WebP**
- **SSR/CSR 混合**、首屏 **skeleton**

### Q11：如何提升前端项目的可维护性？

- 代码**模块化、组件化**
- 使用**类型系统**（如 TypeScript）
- 严格代码规范（**ESLint + Prettier**）
- **Git Commit 规范**（如 conventional commits）
- **单元测试**（Jest + RTL）+ **集成测试**

<ArticleComments slug="frontend-engineering-high-frequency-questions" />
