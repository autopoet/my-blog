# 前端实习进阶笔记 | Technical Blog

一个基于 Vue 3 和 Valaxy 构建的高性能个人技术博客，专注于记录前端面试八股、代码输出题及算法心得。

[![Powered by Valaxy](https://img.shields.io/badge/Powered%20by-Valaxy-6200ee?style=flat-square&logo=visualstudiocode)](https://valaxy.site)
[![Framework](https://img.shields.io/badge/Framework-Vue%203-42b883?style=flat-square&logo=vuedotjs)](https://vuejs.org/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![CMS](https://img.shields.io/badge/CMS-Decap%20CMS-ff7e00?style=flat-square&logo=netlifycms)](https://decapcms.org/)

## 站点信息

- **预览地址**: [https://my-blog-puce-one.vercel.app](https://my-blog-puce-one.vercel.app)
- **管理后台**: [/admin/](https://my-blog-puce-one.vercel.app/admin/) (基于 Decap CMS)

---

## 项目特性

- **高效轻量**: 采用 Vite 驱动的 SSG (静态站点生成) 技术，首屏几乎瞬时加载。
- **专为面试设计**: 深度定制的分类导航，涵盖面试八股、代码实现与算法挑战。
- **现代化样式**: 基于 UnoCSS 的原子化 CSS 实践，结合图标按需加载。
- **全流程写作体验**:
  - **沉浸式开发**: 支持本地 Markdown + VS Code 编写。
  - **可视化管理**: 集成 Headless CMS 方案，支持通过网页后台直接发布内容、上传图片。
- **全自动部署**: 集成 CI/CD 工作流，实现从代码提交到 Vercel 自动化部署。

## 技术栈

- **核心框架**: [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **SSG 引擎**: [Valaxy](https://valaxy.site/)
- **主题**: [Theme Yun](https://github.com/YunYouJun/valaxy-theme-yun)
- **样式**: UnoCSS (Atomic CSS)
- **管理后台**: Decap CMS
- **认证服务**: Vercel Serverless Functions

## 项目结构

```bash
├── api/                # 后端逻辑：处理 CMS 与 GitHub 的 OAuth 授权
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

## 快速开始

### 本地环境
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

### 线上部署
1. 推送到 GitHub 仓库。
2. 在 Vercel 中连接该仓库，并配置环境变量：
   - `OAUTH_CLIENT_ID`: GitHub OAuth Client ID
   - `OAUTH_CLIENT_SECRET`: GitHub OAuth Client Secret

## 内容管理流程

### 方法 A：在线管理 (推荐)
访问 `/admin/` 路径，登录后即可通过富文本编辑器进行编辑与发布。

### 方法 B：本地创作
在 `pages/posts/` 下新建 `.md` 文件，使用项目提供的模板，完成后执行 Git 提交即可。

---

**Author**: [Autopoet](https://github.com/autopoet)  
**License**: MIT
