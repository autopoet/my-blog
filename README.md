<p align="center">
  <img src="./public/logo.png" width="128" height="128" alt="autopoet blog logo" />
</p>

<h1 align="center">前端学习笔记 | Technical Blog</h1>

<p align="center">
  <strong>基于 Vue 3 & SSG 架构的高性能技术博客与可视化后台管理系统</strong>
</p>

<p align="center">
  <a href="https://vuejs.org/">
    <img src="https://img.shields.io/badge/Vue-3.x-42b883?style=for-the-badge&logo=vue.js" alt="Vue 3" />
  </a>
  <a href="https://valaxy.site/">
    <img src="https://img.shields.io/badge/Valaxy-SSG-6200ee?style=for-the-badge&logo=visualstudiocode" alt="Valaxy" />
  </a>
  <a href="https://decapcms.org/">
    <img src="https://img.shields.io/badge/CMS-Decap-ff7e00?style=for-the-badge&logo=netlifycms" alt="CMS" />
  </a>
  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel" alt="Vercel" />
  </a>
</p>

---

## 为什么发起这个项目？

在前端技术的长跑中，知识的碎片化是最大的敌人。我需要一个能够承载深度思考、面试沉淀以及技术实验的数字化堡垒。

本项目旨在打破传统静态博客管理繁琐的壁垒。通过深度定制 Valaxy 引擎并打通 Headless CMS 链路，它实现了“代码级控制”与“可视化创作”的无缝结合。这不仅是我的知识库，更是我探索 Vue 生态、工程化调优及全栈 Auth 架构的生产力工具。

## 核心亮点

### 全栈 Auth 桥接架构
针对纯静态站点（SSG）无法安全处理 GitHub OAuth 流程的痛点，自主开发了基于 Node.js 的 Serverless Functions 认证中转服务。该方案在保障 Secret 安全的前提下，打通了浏览器端与 GitHub API 的令牌交换链路。

### 极致性能体验
利用 Vite 驱动的预渲染技术，所有博文在构建阶段即转化为静态 HTML。配合 UnoCSS 的按需扫描与原子化 CSS 特性，首屏加载时仅包含必要的样式依赖，实现毫秒级的 LCP 响应。

### 可视化内容建模
深度集成 Decap CMS，通过 YAML 配置对 Markdown Schema 进行精准建模。支持 Web 端实时预览、图片自动上传托管、文章分类动态管理，实现了从起草到发布的全自动 CI/CD 流转。

### 结构化面试题库
专为前端求职场景设计的标签与分类系统。涵盖核心八股文、手撕代码题、高频算法及工程化架构，通过 Yun 主题的沉浸式侧边栏实现知识点的快速定位。

## 技术矩阵

- 核心框架: Vue 3.x (Composition API)
- 静态生成: Valaxy (基于 Vite 的 SSG 引擎)
- 后端逻辑: Vercel Serverless Functions
- 内容管理: Decap CMS + GitHub OAuth
- 样式方案: UnoCSS + valaxy-theme-yun
- 自动化: GitHub Actions CI/CD

## 项目结构

```bash
├── api/                # 后端逻辑：Serverless Functions 处理认证流
├── components/         # 深度定制的 Vue 组件
├── pages/              # 内容源文件
│   ├── posts/          # Markdown 格式博文源码
│   └── about/          # 关于页面 (作者/站点)
├── public/
│   ├── admin/          # CMS 静态入口、样式与配置文件
│   ├── logo.png        # 站点 Logo
│   └── me.jpg          # 作者头像
├── site.config.ts      # 站点基础信息与元数据
├── valaxy.config.ts    # 插件系统、主题扩展及 UnoCSS 配置
└── vercel.json         # 生产环境路由重写规则
```

## 创作流

1. 在线模式: 访问 /admin/ 路径，通过可视化编辑器编写，Push 后自动触发 Vercel 构建。
2. 本地模式: 在 pages/posts 中通过 Markdown 创作，利用 Git 命令进行版本控制。

## 开发启动

```bash
# 克隆仓库
git clone https://github.com/autopoet/my-blog.git

# 安装依赖
pnpm install

# 预览开发环境
pnpm run dev

# 构建生产版本 (SSG)
pnpm run build
```

---

<p align="center">
  记录成长，思考未来。
</p>
