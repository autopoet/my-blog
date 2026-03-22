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



<ArticleComments slug="github-basics" />
