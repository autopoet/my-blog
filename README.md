# 前端学习笔记 | technical-blog

[![Framework](https://img.shields.io/badge/Framework-Vue%203-42b883?style=flat-square&logo=vuedotjs)](https://vuejs.org/)
[![Powered by Valaxy](https://img.shields.io/badge/Powered%20by-Valaxy-6200ee?style=flat-square&logo=visualstudiocode)](https://valaxy.site)
[![CMS](https://img.shields.io/badge/CMS-Decap%20CMS-ff7e00?style=flat-square&logo=netlifycms)](https://decapcms.org/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

一个极简、高性能的个人技术博客，基于 **Vue 3** 与 **Valaxy** 构建，专注于前端面试知识体系（八股文）、算法及代码实现。

## 站点信息

- **网站首页**: [https://my-blog-puce-one.vercel.app](https://my-blog-puce-one.vercel.app)
- **管理后台**: [/admin/](https://my-blog-puce-one.vercel.app/admin/) (在线可视化编写)

---

## 项目特性

- **极致性能**: 采用 Vite 驱动的 SSG (静态站点生成) 方案。
- **结构化知识**: 内置“前端八股”、“代码输出”、“算法挑战”三级分类体系。
- **现代化样式**: 基于 UnoCSS 实践原子化 CSS，使用 `valaxy-theme-yun` 打造轻盈视觉体验。
- **可视化管理**: 深度集成 **Decap CMS**，实现 Web 端直接发布、上传图片及管理内容。
- **全自动流**: 集成 CI/CD，代码变更即自动触发生产环境部署。

## 技术深度 (Technical Highlights)

本项目不仅仅是简单的博客模板，在二次开发中实现了以下工程化实践：

- **Auth Bridge**: 基于 Vercel Serverless Functions 开发了 OAuth 认证中转服务，解决了静态站点在 GitHub 授权中的跨域与重定向问题。
- **CMS 建模**: 通过 YAML 配置对 Decap CMS 进行内容建模，使其完美契合前端面试题库的数据结构。
- **SEO 优化**: 针对 Vue SPA 架构进行了 SSG 静态化处理，大幅提升了页面加载速度与搜索引擎抓取效率。

## 项目结构

```bash
├── api/                # 后端逻辑：Serverless Functions 处理 GitHub OAuth
├── pages/
│   ├── posts/          # 博文源码 (Markdown)
│   └── index.md        # 站点首页
├── public/
│   ├── admin/          # Decap CMS 静态入口与配置文件
│   └── me.jpg          # 作者头像
├── site.config.ts      # 站点基础元数据配置
├── valaxy.config.ts    # 主题插件与 UnoCSS 配置
└── vercel.json         # Vercel 路由重写规则 (核心：修复 admin 路径错位)
```

## 快速上手

```bash
# 安装并运行
pnpm install
pnpm run dev
```

---

**Author**: [autopoet](https://github.com/autopoet)
**License**: MIT
