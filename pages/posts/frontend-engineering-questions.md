---
title: 前端工程化&构建工具基础知识
date: 2026-03-18
categories:
  - 啃啃原理
tags:
  - 前端工程化
  - 构建工具
---
<ArticleViews slug="frontend-engineering-questions" />

> 前端工程化是通过工具和流程解决大型项目的开发效率、代码质量和部署稳定性问题。

## 一、 模块化规范：工程化的底层基石

### 1. ESM 与 CommonJS 的深度对比
这是面试必答题。

| 特性 | CommonJS (CJS) | ES Modules (ESM) |
| :--- | :--- | :--- |
| **导出语法** | `module.exports = {}` | `export const ...` |
| **引入语法** | `require()` | `import ... from ...` |
| **加载机制** | **运行时加载**（同步且阻塞） | **编译时输出**（静态分析，异步获取） |
| **值的处理** | **值的拷贝**（导出后原模块变化不影响已导入的值） | **值的引用**（导入处反映导出模块的实时变化） |
| **Tree-shaking** | **不支持**（动态特性导致无法准确剔除） | **原生支持** |

