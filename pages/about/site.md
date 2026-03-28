---
title: 关于站点
---

## 站点构建：从笔记到结构化沉淀

这个博客不仅是我发布文章的平台，也是我实践前端开发技术的场所。

### 为什么选择现在的方案？

传统的静态站点（SSG）加载速度快，但有些功能受限。在这个站点中，我通过以下方案进行了一些尝试：

- **边缘计算 (Vercel Functions)**：将静态站点的优势与 Vercel 边缘函数结合，尝试实现一些动态逻辑。
- **Redis 数据存储 (Upstash)**：利用 Upstash 管理网站的基础交互数据，确保在并发场景下也能保持数据的准确性。
- **自定义 Vue 指令 (`v-lazy`)**：通过调用浏览器的底层 API 实现图片懒加载，优化页面的首屏性能和滚动体验。

### 技术栈

- **核心框架**: [Vue 3](https://vuejs.org/) (Composition API)
- **静态生成器**: [Valaxy](https://valaxy.site/) (基于 Vite 的 SSG 框架)
- **主题**: [valaxy-theme-yun](https://github.com/YunYouJun/valaxy-theme-yun)
- **脚本支持**: Node.js Vercel Functions + TypeScript
- **数据库**: Upstash Redis

---

> “将复杂的过程留给代码，将简洁的体验留给用户。”

这个博客是我学习前端开发的缩影。从最基础的语法学习，到现在能够针对开源组件进行定制化修改，我依然在不断积累和进步。

感谢 [YunYouJun](https://github.com/YunYouJun) 开启了 Valaxy 的篇章，我也会在这里继续保持更新。
