---
title: GitHub 基础教程
date: 2025-11-05
categories:
  - 学学技术
tags:
  - GitHub
  - Git
  - 协作
  - CI/CD
---
<ArticleViews slug="github-basics" />


> 当你掌握了本地 Git 操作后，GitHub 才是真正开启程序员“社交”与“高效生产”的大门。本文将深入解析如何利用 GitHub 进行高效协作。

## 1. 密钥配置：SSH 的“无感”登录

为了安全且方便地推送代码，配置 SSH 是第一步。

-   **生成密钥**：`ssh-keygen -t ed25519 -C "your_email@example.com"`
-   **添加到 GitHub**：在 Settings -> SSH and GPG keys 中粘贴 `.pub` 文件内容。
-   **校验连接**：`ssh -T git@github.com`

---

## 2. 核心协作模型：Fork 与 Pull Request (PR)

这是参与开源项目或大型团队开发的最标准流程。

1.  **Fork**：将他人的仓库复制一份到你的名下。
2.  **Clone**：下载你名下的仓库到本地。
3.  **Feature Branch**：创建新分支进行开发。
4.  **Push**：推送到自己的远程仓库。
5.  **Pull Request**：向原仓库发起合并请求，等待 Code Review。

---

## 3. GitHub Actions：你的 24 小时贴身管家

**GitHub Actions** 允许你在代码推送到仓库时自动执行一系列任务（测试、打包、部署）。

-   **Workflow 文件**：存放在 `.github/workflows/main.yml`。
-   **关键概念**：
    -   **On**：触发时机（如 `push` 或 `pull_request`）。
    -   **Jobs**：具体要做的任务流。
    -   **Steps**：任务中的每一个动作（如安装依赖、跑测试）。

---

## 4. 更多有趣的功能

-   **GitHub Pages**：免费托管静态网页。
-   **README 艺术**：使用 `shields.io` 的徽章让你的项目看起来更专业。
-   **Issues**：不仅是报 Bug，更是任务看板和讨论区。

> [!TIP]
> 善用项目的 **Star** 功能来关注好的库，但更重要的是利用 **Watch** 功能来追踪代码的更新细节。

<ArticleComments slug="github-basics" />
