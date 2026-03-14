# 前端实习进阶笔记 | Technical Blog

一个基于 Vue 3 和 Valaxy 构建的高性能个人技术博客，专注于记录前端面试八股、代码输出题及算法心得。

## 站点信息

- **预览地址**: [https://my-blog-puce-one.vercel.app](https://my-blog-puce-one.vercel.app)
- **管理后台**: [/admin/](https://my-blog-puce-one.vercel.app/admin/) (基于 Decap CMS)

---

## 项目特性
# 个人技术博客 & 前端进阶笔记 (Tech Blog)

[![Powered by Valaxy](https://img.shields.io/badge/Powered%20by-Valaxy-6200ee?style=flat-square&logo=visualstudiocode)](https://valaxy.site)
[![Framework](https://img.shields.io/badge/Framework-Vue%203-42b883?style=flat-square&logo=vuedotjs)](https://vuejs.org/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![CMS](https://img.shields.io/badge/CMS-Decap%20CMS-ff7e00?style=flat-square&logo=netlifycms)](https://decapcms.org/)

这是一个专为**前端实习面试准备**打造的技术博客系统。基于 Vue 3 和 Valaxy 构建，集成了 Headless CMS 可视化管理，旨在实现高效的笔记记录与知识体系构建。

##  核心特性

- **高效轻量**: 采用 Vite 驱动的 SSG (静态站点生成) 技术，首屏几乎瞬时加载。
- **专为面试设计**: 深度定制的分类导航，涵盖面试八股、代码实现与算法挑战。
- **现代化样式**: 基于 UnoCSS 的原子化 CSS 实践，结合图标按需加载，兼顾开发体验与运行效率。
- **全流程写作体验**:
  - **沉浸式开发**: 支持本地 Markdown + VS Code 编写。
  - **可视化管理**: 集成 Headless CMS 方案，支持通过网页后台直接发布内容、上传图片。
- **全自动部署**: 集成 CI/CD 工作流，实现从代码提交到 Vercel 自动化部署。
- ** 极致性能**：基于 Vite 和 SSG (静态站点生成) 技术，首屏秒开，SEO 友好。
- ** 信息架构重构**：专门针对面试场景设计，内置“面试八股”、“代码输出”、“算法挑战”三大核心分类。
- ** 现代化审美**：使用 `valaxy-theme-yun` 主题，配合 UnoCSS 原子化 CSS，极致轻量且美观。
- ** 可视化内容管理**：集成 **Decap CMS**，支持在 Web 端直接通过富文本编辑器编写/发布 Markdown 博文，无需本地编译。
- ** 自动化 CI/CD**：集成 GitHub Actions 与 Vercel，代码提交即部署，实现全球 CDN 加速。

## 技术架构
##  技术栈

- **核心**: [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **SSG 引擎**: [Valaxy](https://valaxy.site/)
- **主题**: [Theme Yun](https://github.com/YunYouJun/valaxy-theme-yun)
- **样式**: UnoCSS (Atomic CSS)
- **管理后台**: Decap CMS
- **认证服务**: Vercel Serverless Functions (Node.js)

## 目录说明
##  项目结构

```bash
├── api/                # 后端逻辑：处理 CMS 與 GitHub 的 OAuth 授权
├── pages/
│   ├── posts/          # 技术文章存放处 (Markdown 格式)
│   └── index.md        # 站点首页内容
├── public/
│   ├── admin/          # CMS 管理后台页面与配置
│   └── images/         # 全局静态图片资源
├── site.config.ts      # 站点全局静态配置
├── valaxy.config.ts    # 主题、插件与 UnoCSS 详细配置
└── package.json        # 依赖与脚本定义
```

## 快速上手
##  快速开始

### 本地环境
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

### 创作流程
1. **本地创作**: 在 `pages/posts/` 目录下新增 Markdown 文件，使用 `categories` 标签进行自动分类。
2. **在线管理**: 访问 `/admin/` 路径，登录 GitHub 后可直接通过富文本编辑器进行编辑与发布。
访问 `http://localhost:4859` 即可预览站点。

### 线上部署

1. 推送到 GitHub 仓库。
2. 在 Vercel 中连接该仓库。
3. 配置环境变量：
   - `OAUTH_CLIENT_ID`: GitHub OAuth Client ID
   - `OAUTH_CLIENT_SECRET`: GitHub OAuth Client Secret

##  内容管理流程

### 方法 A：在线管理 (推荐)
访问 `https://your-domain.com/admin/`，通过可视化界面进行创作、修改、上传图片，点击 Publish 即可自动推送到 GitHub 并触发部署。

### 方法 B：本地创作
在 `pages/posts/` 下新建 `.md` 文件，使用项目提供的博文模板，完成后执行 Git 提交即可。

## 开发规范

- **Commit 规范**: 采用 Angular 规范 (feat, fix, docs, refactor, etc.)。
- **命名规范**: 建议博文文件名采用 `kebab-case` 格式（如 `js-prototype-chain.md`）。

---

##  简历展示建议

该项目非常适合写在简历中，体现你的**工程化思维**：
- **项目描述**：重构并上线了一个基于 SSG 架构的技术博客系统。
- **技术亮点**：
  - “基于 Vue 3 + TypeScript 实现了高性能静态站点生成。”
  - “集成了 Headless CMS，通过 Serverless Functions 处理 OAuth 授权，打通了 Web 端的内容生产闭环。”
  - “利用 UnoCSS 进行了样式原子化拆分，显著降低了生产环境的 CSS 总体积。”

---

**License**: [MIT](LICENSE)
**Author**: [Autopoet](https://github.com/autopoet)
**License**: MIT
