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

作为一个前端学习者，我希望建立一个真正属于自己的“知识堡垒”。市面上的博客工具要么过于沉重（如 WordPress），要么缺乏可视化管理能力（如传统的 Hexo/Hugo 本地模式）。

**这个博客项目** 的目标是实现 **“本地创作的极客感”** 与 **“在线管理的便捷性”** 的完美平衡。通过深度定制 Valaxy 主题并集成 Decap CMS，它不仅是我的笔记库，更是我探索前端工程化、Serverless 认证及 SSG 性能极限的试验场。

## 核心亮点

- **全栈 Auth 桥接**：基于 **Vercel Serverless Functions (Node.js)** 自主开发了 GitHub OAuth 认证层，解决了纯静态站点环境下集成 Headless CMS 的权限校验与回调难题。
- **极致渲染性能**：采用 Vite 驱动的 SSG 方案，首屏 FCP 时间极短。利用 UnoCSS 原子化 CSS 系统，确保生产环境下的样式依赖达到极致轻量级。
- **可视化内容生命周期**：深度集成 **Decap CMS** 并通过 YAML 进行数据建模，实现了从 Web 端文章起草、图片上传到 Git 自动回写及 CI/CD 自动部署的完整链路。
- **面试导向设计**：针对前端面试（八股文、算法、代码实现）定制了专门的分类与展示逻辑。

## 🛠 技术矩阵

- **核心框架**: Vue 3.x (Composition API)
- **底层引擎**: Valaxy (SSG)
- **内容管理**: Decap CMS + GitHub OAuth
- **后端支持**: Node.js Serverless Functions (Vercel)
- **样式方案**: UnoCSS & valaxy-theme-yun

## 项目结构

```bash
├── api/                # Serverless 后端逻辑 (认证中转)
├── pages/
│   ├── posts/          # 博文源码 (Markdown)
│   └── about/          # 关于页面
├── public/
│   ├── admin/          # CMS 静态入口与配置
│   └── logo.png        # 站点 Logo
├── site.config.ts      # 站点元数据
└── valaxy.config.ts    # 插件与主题核心配置
```

## 立即体验

```bash
# 获取源码
git clone https://github.com/autopoet/my-blog.git

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

---

<p align="center">
  记录成长，思考未来。
</p>
