# 个人技术博客 & 前端进阶笔记 (Tech Blog)

[![Powered by Valaxy](https://img.shields.io/badge/Powered%20by-Valaxy-6200ee?style=flat-square&logo=visualstudiocode)](https://valaxy.site)
[![Framework](https://img.shields.io/badge/Framework-Vue%203-42b883?style=flat-square&logo=vuedotjs)](https://vuejs.org/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![CMS](https://img.shields.io/badge/CMS-Decap%20CMS-ff7e00?style=flat-square&logo=netlifycms)](https://decapcms.org/)

这是一个专为**前端实习面试准备**打造的技术博客系统。基于 Vue 3 和 Valaxy 构建，集成了 Headless CMS 可视化管理，旨在实现高效的笔记记录与知识体系构建。

## 🌟 核心特性

- **🚀 极致性能**：基于 Vite 和 SSG (静态站点生成) 技术，首屏秒开，SEO 友好。
- **📝 信息架构重构**：专门针对面试场景设计，内置“面试八股”、“代码输出”、“算法挑战”三大核心分类。
- **🎨 现代化审美**：使用 `valaxy-theme-yun` 主题，配合 UnoCSS 原子化 CSS，极致轻量且美观。
- **✍️ 可视化内容管理**：集成 **Decap CMS**，支持在 Web 端直接通过富文本编辑器编写/发布 Markdown 博文，无需本地编译。
- **☁️ 自动化 CI/CD**：集成 GitHub Actions 与 Vercel，代码提交即部署，实现全球 CDN 加速。

## 🛠️ 技术栈

- **核心框架**: Vue 3 + TypeScript
- **SSG 引擎**: [Valaxy](https://valaxy.site/) (Vite-based)
- **样式方案**: UnoCSS (Atomic CSS) & SCSS
- **内容管理**: Decap CMS + GitHub OAuth
- **后端脚本**: Vercel Serverless Functions (Node.js)
- **部署平台**: Vercel

## 📁 项目结构

```text
my-blog/
├── api/                # Vercel Serverless Functions (处理 OAuth 登录)
├── pages/
│   ├── posts/          # 博文源码 (Markdown)
│   └── index.md        # 站点首页
├── public/
│   ├── admin/          # Decap CMS 管理后台入口及配置
│   └── images/         # 存放文章配图
├── site.config.ts      # 站点基础信息配置 (标题、作者、描述等)
├── valaxy.config.ts    # 主题与插件扩展配置
└── package.json        # 依赖与脚本
```

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动本地开发服务
pnpm run dev
```

访问 `http://localhost:4859` 即可预览站点。

### 线上部署

1. 推送到 GitHub 仓库。
2. 在 Vercel 中连接该仓库。
3. 配置环境变量：
   - `OAUTH_CLIENT_ID`: GitHub OAuth Client ID
   - `OAUTH_CLIENT_SECRET`: GitHub OAuth Client Secret

## 🖋️ 内容管理流程

### 方法 A：在线管理 (推荐)
访问 `https://your-domain.com/admin/`，通过可视化界面进行创作、修改、上传图片，点击 Publish 即可自动推送到 GitHub 并触发部署。

### 方法 B：本地创作
在 `pages/posts/` 下新建 `.md` 文件，使用项目提供的博文模板，完成后执行 Git 提交即可。

## 💼 简历展示建议

该项目非常适合写在简历中，体现你的**工程化思维**：
- **项目描述**：重构并上线了一个基于 SSG 架构的技术博客系统。
- **技术亮点**：
  - “基于 Vue 3 + TypeScript 实现了高性能静态站点生成。”
  - “集成了 Headless CMS，通过 Serverless Functions 处理 OAuth 授权，打通了 Web 端的内容生产闭环。”
  - “利用 UnoCSS 进行了样式原子化拆分，显著降低了生产环境的 CSS 总体积。”

---

**License**: [MIT](LICENSE)  
**Author**: [Autopoet](https://github.com/autopoet)
