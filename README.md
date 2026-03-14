# 前端学习笔记 | Technical Blog

一个基于 Vue 3 和 Valaxy 构建的高性能个人技术博客，专注于记录前端面试八股、代码输出题及算法心得。

[![Powered by Valaxy](https://img.shields.io/badge/Powered%20by-Valaxy-6200ee?style=flat-square&logo=visualstudiocode)](https://valaxy.site)
[![Framework](https://img.shields.io/badge/Framework-Vue%203-42b883?style=flat-square&logo=vuedotjs)](https://vuejs.org/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![CMS](https://img.shields.io/badge/CMS-Decap%20CMS-ff7e00?style=flat-square&logo=netlifycms)](https://decapcms.org/)

这是一个专为**前端实习面试准备**打造的技术博客系统。基于 Vue 3 和 Valaxy 构建，集成了 Headless CMS 可视化管理，旨在实现高效的笔记记录与知识体系构建。

## 站点信息

- **预览地址**: [https://my-blog-puce-one.vercel.app](https://my-blog-puce-one.vercel.app)
- **管理后台**: [/admin/](https://my-blog-puce-one.vercel.app/admin/)

---

## 核心特性

- **高效轻量**: 采用 Vite 驱动的 SSG (静态站点生成) 技术，首屏几乎瞬时加载。
- **专为面试设计**: 深度定制的分类导航，涵盖前端八股、代码实现与算法挑战。
- **现代化审美**: 使用 `valaxy-theme-yun` 主题，配合 UnoCSS 原子化 CSS，极致轻量且美观。
- **可视化内容管理**: 集成 **Decap CMS**，支持在 Web 端直接通过富文本编辑器编写/发布 Markdown 博文。
- **自动化 CI/CD**: 集成 GitHub Actions 与 Vercel，代码提交即部署。

## 技术栈

- **核心框架**: [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **SSG 引擎**: [Valaxy](https://valaxy.site/)
- **样式方案**: UnoCSS (Atomic CSS)
- **内容管理**: Decap CMS + GitHub OAuth
- **后端脚本**: Vercel Serverless Functions (Node.js)
- **部署平台**: Vercel

## 项目结构

```bash
├── api/                # 后端逻辑：处理 CMS 与 GitHub 的 OAuth 授权
├── pages/
│   ├── posts/          # 博文源码 (Markdown)
│   └── index.md        # 站点首页
├── public/
│   ├── admin/          # Decap CMS 管理后台入口及配置
│   └── images/         # 存放文章配图
├── site.config.ts      # 站点基础信息配置
├── valaxy.config.ts    # 主题与插件扩展配置
└── package.json        # 依赖与脚本
```

## 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动本地开发服务
pnpm run dev
```

### 线上部署

1. 推送到 GitHub 仓库。
2. 在 Vercel 中添加环境变量：
   - `OAUTH_CLIENT_ID`: GitHub OAuth Client ID
   - `OAUTH_CLIENT_SECRET`: GitHub OAuth Client Secret

## 内容管理流程

### 在线管理 (推荐)
访问 `/admin/` 路径，登录后即可通过可视化界面创建、修改文章，Push 后自动部署。

### 本地创作
在 `pages/posts/` 下新建 `.md` 文件，完成后执行 Git 提交即可。

---

**License**: [MIT](LICENSE)  
**Author**: [autopoet](https://github.com/autopoet)
