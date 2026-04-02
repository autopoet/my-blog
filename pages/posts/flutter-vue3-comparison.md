---
title:  快速了解 Flutter
date: 2026-04-02
categories:
  - 学学技术
tags:
  - Flutter
  - Vue3
  - 案例实践
---
<ArticleViews slug="flutter-vue3-comparison" />

作为一个使用 **Vue3** 的前端开发者，今天利用 **AICoding**的能力，快速构建一个基于**flutter**的“动漫 Feed 流视频应用” Demo。

## 1. 目的

1. **快速成片**：不纠结于搭建环境的每一个微小报错，而是通过 AI 快速生成业务代码。
2. **原理摸底**：通过对比熟悉的 Vue3，理解 Flutter 的渲染机制和状态管理。
3. **异同分析**：弄清楚前端思维在 Flutter 中哪些能复用。

---

## 2. 核心技术原理：Flutter vs Vue3

通过这次 Demo 的开发，我从底层逻辑到上层 API 深度对比了两者：

### 2.1 UI 描述：声明式 UI 的共鸣

- **Vue3**: 使用 `template`。通过数据驱动试图，由响应式变量触发虚拟 DOM 的 Diff，最终更新 DOM。
- **Flutter**: “Everything is a Widget”。通过 Widget 树描述界面。
- **差异点**：Vue3 的模版更直观，适合“文档流”布局；Flutter 虽然嵌套深（Widget 炼狱），但配合 `ConstrainedBox` 和 `SizedBox` 能实现更精准的像素控制。

### 2.2 渲染引擎：DOM vs Skia/Impeller

- **Vue3 (Web)**: 依赖浏览器的渲染管线。性能上限受限于 HTML/CSS 解析。
- **Flutter**: 彻底绕过了原生控件，直接使用 **Skia/Impeller** 绘图引擎在屏幕上“画”出像素。
- **Demo 体会**：在 Demo 中实现的 `SliverMasonryGrid` 瀑布流，即便有 20+ 高清卡片，滑动时依然丝滑，这归功于 Flutter 的高效渲染管线和 **Sliver**（碎片）懒加载机制。

### 2.3 数据流机制：Ref/onMounted vs FutureBuilder

这是我感触最深的地方：

- **Vue3**: 我们习惯在 `onMounted` 中通过 `axios` 请求数据，然后赋值给 `ref`。
- **Flutter**: 推荐使用 **`FutureBuilder`**。它像是一个内置的 `Suspense` + `async setup()`，能根据 `snapshot.connectionState` 自动切换 Loading、Error 和数据展现状态，大大减少了手动维护 `loading` 变量的代码。

### 2.4 状态管理：Pinia vs Provider/ChangeNotifier

在实现“点赞”全局状态时：

- **Vue3**: 定义 Pinia Store，组件通过 `storeToRefs` 使用。
- **Flutter**: 使用 **`Provider`** 结合 **`ChangeNotifier`**。
- **发现**：Flutter 的 `notifyListeners()` 就像手动触发的响应式更新。虽然逻辑类似，但 Flutter 明确区分了“读”（`context.read`）和“听”（`context.watch`），在性能调优上给了开发者更多抓手。

### 2.5 响应式布局：Media Query vs LayoutBuilder

- **Vue3**: 强依赖 CSS 的 `@media`。
- **Flutter**: Demo 中采用了 **`LayoutBuilder`**。
- **优势**：`LayoutBuilder` 不仅仅是看屏幕宽度，而是看父容器分配的约束（Constraints）。这让组件可以根据自身容器大小动态调整列数（如 Demo 中的 2 列变 3 列），真正实现了组件级的响应式。

---

## 3. 效率提升：AICoding 的真实威力

在构建这个 Demo 时，我并没有死磕官方文档，而是将 **Vue3 的架构思维** 投喂给 AI，让它协助我完成跨平台的翻译：

### 3.1 布局翻译：从 CSS 到 Widget 树
起初我对 `Row` / `Column` 的嵌套感到头大，但我告诉 AI：“我需要一个类似于 `flex-direction: row; justify-content: space-between` 的布局”，AI 迅速给出了 `MainAxisAlignment.spaceBetween`。
- **感悟**：这种“思维对齐”让我在半小时内就搞定了复杂的 `AppBar` 磨砂玻璃效果（`BackdropFilter`）。

### 3.2 难点攻克：复杂的瀑布流与视频预载
如果手写原生 iOS/Android 的瀑布流，可能需要几天。但在 AI 的辅助下：
- **动态列数**：通过 `LayoutBuilder` 实时监听父容器宽度。
- **高性能网格**：引入 `flutter_staggered_grid_view` 插件。
- **视频无缝预览**：AI 帮我处理了 `VideoPlayerController` 的初始化与销毁逻辑，确保了在瀑布流滚动时内存不会爆炸。

---

## 4. 总结与建议

通过这次“跳级”体验，我发现：
1. **思维是通用的**：无论 Vue3 还是 Flutter，核心都在于**组件解耦**和**单向数据流**。
2. **AI 是催化剂**：它消弭了底层 API 语法的陌生感，让我能直接跳过“Hello World”，直奔**复杂交互方案**。
3. **转变是必然的**：从 Web 的“流式布局”转向 Flutter 的“约束布局（Constraints）”是最大的挑战，但也是通往高性能原生体验的必经之路。

**一句话建议**：如果你还不熟悉 Flutter，试着把你的 Vue 组件 logic 丢给 AI，让它帮你出一份 Flutter 的实现，你会惊讶于两者的神似。

---
最后，附上一张 Demo 的效果图（火影忍者高清 Banner）：
![Naruto Banner](file:///d:/DEVELOP/LearningCode/flutter-learning/flutter_demo1/assets/images/banner.jpg)

<ArticleComments slug="flutter-vue3-comparison" />
