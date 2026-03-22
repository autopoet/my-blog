---
title: Vercel 部署教程
date: 2025-11-05
categories:
  - 学学技术
tags:
  - Vercel
  - 部署
  - 开发流程
  - Serverless
---

> 在追求极致效率的今天，传统的 FTP 传输和各种复杂的服务器配置已经过时。Vercel 以其极致的“全自动部署”和“极速节点”方案，成为现代前端开发者的心头好。

## 1. 为什么选择 Vercel？

-   **原生支持**：对 Next.js, Vue, Vite, React 等框架的支持几乎“开箱即用”。
-   **自动化**：只需 `git push`，剩下的事情交给 Vercel。
-   **全球 CDN**：极致的边际网络，全球访问速度飞快。
-   **Serverless Functions**：低门槛的前后端一体化开发体验。

---

## 2. 核心部署流程

### 第一步：关联仓库

1.  登录 [Vercel 官网](https://vercel.com/)。
2.  点击 **Import Project**，选择 **Import from Git**。
3.  搜索并授权你刚才推送的 GitHub 仓库。

### 第二步：配置构建设置

大部分框架会自动识别：
-   **Framework Preset**：如果是 Vite 项目，它会自动选择 Vite。
-   **Build Command**：通常为 `npm run build`。
-   **Output Directory**：通常为 `dist`。

### 第三步：部署并查看

点击 **Deploy**，大约 10-30 秒后，你的项目就会获得一个官方提供的免费二级域名（如 `my-app.vercel.app`）。

---

## 3. 环境变数与 Secrets

对于各种敏感信息（比如数据库密码、API Key），不要写在代码里。

-   打开 Vercel 控制台中的 **Settings -> Environment Variables**。
-   添加键值对。
-   由于这些变量在服务器端，所以它们是安全的，不会泄露到前端打包后的代码中（除非你在 Vite 中显式暴露）。

---

## 4. 更多高级应用

-   **Redirects & Rewrites**：在 `vercel.json` 中配置路由重定向，解决单页应用刷新 404 等问题。
-   **Preview Deployments**：每个 PR 都会自动生成一个预览地址，确认无误后再合并上线。

> [!NOTE]
> Vercel 并不只是“托管网页”，它是一个完整的 **开发者体验平台**。利用好各个阶段的预览功能，能显著提升开发质量。
