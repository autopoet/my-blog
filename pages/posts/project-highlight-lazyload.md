---
title: my-blog：手写图片懒加载指令
date: 2026-03-03
categories:
  - 聊聊项目
tags:
  - my-blog
  - 面试
  - 性能优化
---

<ArticleViews slug="project-highlight-lazyload" />

## 一、 为什么要做图片懒加载？

### 1. 核心动机：解决首屏资源抢占

- **痛点场景**：如果一篇文章包含 20 张高清大图，用户初次进入页面时，浏览器会瞬间并发 20 个图片请求。这些高带宽的网络请求会严重挤占关键 CSS 和 JS 的下载通道，导致首屏白屏时间显著延长。
- **思考路径**：作为博主，我发现很多读者习惯快速浏览，甚至只看篇首就滑走。如果在页面初始化时就全量加载，不仅是对流量的极大浪费，更会拖慢用户的整体首屏体验。

### 2. 技术选型：IntersectionObserver vs 传统 Scroll

- **传统做法**：通过监听 `window.scroll` 事件，在主线程同步调用 `getBoundingClientRect().top` 或 `offsetTop` 来手动计算元素位置。
- **底层隐患**：`scroll` 事件触发频率极高。由于计算位置的属性是同步 API，读取它们会强制浏览器为了数据准确性而立刻重排（Reflow），这种**强迫同步布局（Forced Synchronous Layout）**是导致长列表滚动掉帧的主要元凶。
- **我的选择**：拥抱现代浏览器内置的 `IntersectionObserver`。它采用**异步监听机制**，将交叉检测的时机交由浏览器底层渲染引擎调度。它只在元素“进出”视口时发送通知，不占用 JS 主线程资源，性能开销几乎可以忽略不计。

### 3. 本方案的优势与不足

- **优势**：
  - **按需加载**：实现真正意义上的“即看即得”，有效缩减了首屏 60% 以上的无效请求。
  - **极致流畅**：从渲染流水线底层规避了不必要的重构，即使在低端移动设备上也能保持丝滑的滚动体验。
- **不足与改进方向**：
  - **预感性加载缺失**：仅在“看到”时才加载，会导致用户滑得过快时看到瞬时白屏。**改进**：可通过配置 `rootMargin`（例如设为 `200px`）实现图片的提前静默预加载。
  - **观察器实例开销**：当前指令为每个图片元素都 `new` 了一个实例。**改进**：在面对极长列表时，可考虑采用**单例模式**（全局共用一个 Observer 实例），进一步压缩内存占用。

---

## 二、 核心代码逐行解析

### 1. 核心指令源码 (`components/directives/lazy.ts`)

```typescript
import type { Directive } from 'vue'

// 定义指令：绑定目标为 HTMLImageElement，传入值为 string (图片URL)
export const lazyDirective: Directive<HTMLImageElement, string> = {

  // 【生命周期】mounted：DOM 元素被插入页面时触发
  mounted(el, binding) {
    // 1. 预设占位图 (防白屏、防碎图图标、减小重排)
    // 使用 1x1 极小透明 Base64 GIF 占坑，不触发额外网络请求
    el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

    // 2. 实例化交叉观察器 (单体监听模式)
    // 传入异步回调函数，将执行时机的控制权交接给浏览器底层
    const observer = new IntersectionObserver((entries) => {

      // entries 为浏览器收集的状态变化目标数组
      entries.forEach(entry => {

        // 【核心拦截】只有当元素真正进入可视区域时才执行加载
        if (entry.isIntersecting) {

          // 替换真实 src，触发浏览器内核的 HTTP 图片请求
          el.src = binding.value;

          // 【防御性编程】处理图片加载失败的边界情况
          el.onerror = () => {
            el.src = 'https://via.placeholder.com/150'; // 兜底图
          };

          // 【性能优化】加载完成后立刻解除对该 DOM 的监听
          observer.unobserve(el);
        }
      });
    });

    // 3. 启动监听：将当前 img 元素加入观察队列
    observer.observe(el);

    // 4. 跨生命周期状态挂载 (核心工程技巧)
    // 将 observer 实例强制挂载到真实 DOM 节点 el 上。
    // 使用 (el as any) 绕过 TS 的 HTMLImageElement 类型校验。
    // 目的：为 unmounted 阶段的内存清理提供实例引用。
    (el as any)._observer = observer;
  },

  // 【生命周期】unmounted：组件/元素被销毁时触发
  unmounted(el) {
    // 提取挂载的实例
    const observer = (el as any)._observer;
    if (observer) {
      // 【防内存泄漏】彻底关停并销毁观察器
      observer.disconnect();
    }
  }
};
```

### 2. 全局注册机制 (`main.ts / setup`)

```typescript
import { defineAppSetup } from 'valaxy'
import { lazyDirective } from '../components/directives/lazy'

export default defineAppSetup((ctx) => {
  const { app } = ctx

  // 【全局注册】将 lazyDirective 注册为全局指令 'lazy'
  // 模板编译原理：Vue 编译器遇到带 v- 前缀的属性 (v-lazy) 时，
  // 会自动映射到此处注册的 'lazy' 指令逻辑。
  app.directive('lazy', lazyDirective)
})
```

### 3. 模板使用规范与解析

```html
<img v-lazy="'https://picsum.photos/1000/600?random=1'" />
```

- `v-lazy`: 触发自定义指令。

- 双引号套单引号 (`"'...'"` ): Vue 模板内执行的是 JS 表达式。外层双引号代表表达式区域，内层单引号严格声明这是一个字符串字面量常量。如果不加单引号，Vue 会将其当作响应式变量去当前作用域（Data/Setup）中查找，导致 undefined 报错。

- 参数映射: 解析后，外层的 `<img ...>` 真实 DOM 节点会被注入到钩子函数的 `el` 参数中；字符串 `'https://...'` 会被封装进 `binding.value` 中。

---

## 三、 模拟面试问答

### 场景一：为什么要自定义指令，而不是直接写在组件里？
**你的对答：**
“因为**通用性**和**抽象程度**。懒加载是一个与具体业务无关、纯粹操作底层 DOM 的功能。把它封装成指令 `v-lazy`，我可以让任何地方、任何组件里的 `<img>` 标签通过简单加个属性就获得性能优化，代码复用率极高，也符合 Vue 开发的最佳实践（将复杂 DOM 操作解耦）。”

### 场景二：深挖性能——回流（Reflow）与重绘（Repaint）
**面试官提问：** “你刚才提到传统做法会引起‘回流’，你能解释一下什么是回流，为什么你的 IntersectionObserver 没有这个问题？”

**你的对答：**
“**回流**是指当元素的尺寸、位置发生变化时，浏览器需要重新计算整个网页的布局。而像 `offsetTop`、`getComputedStyle` 这些 API 即使你没改数据，只要你去‘读取’，浏览器为了保证给你最准的数据，也会强制触发一次回流（Forced Synchronous Layout）。
而我的方案中，`IntersectionObserver` 属于**异步执行**，它是浏览器底层在每一帧渲染的最后阶段主动告诉我们元素是否可见，它不会阻塞渲染主线程，也不会因为高频执行而导致掉帧，所以性能是碾压级别的。”

### 场景三：如果图片非常多，怎么优化“保安”的数量？
**面试官提问（进阶）：** “如果你页面有一千张图，你每一张图都 `new` 一个观察器实例吗？这会不会很占内存？”

**你的对答（展现思考）：**
“目前代码里确实是每个元素一个实例，对于博客文章来说足够了。但如果真的遇到超长列表，我会采用**‘观察器单例模式’**。即在全局创建一个共享的监听器实例，维护一个 Map。这样无论页面有多少张图，都共用同一个‘保安大队负责人’，根据进出的元素去派发任务，这样内存占用会极低。”

### 场景四：用户滑动太快，图片还没加载完就划走了怎么办？
**你的对答：**
“这其实也是懒加载的一个天然优势。因为我们是先有了一个观察，如果用户划走太快，我们可以在 `unobserve` 之后甚至在加载过程中中止加载（如请求还没发出去）。在大厂业务里，我们还会给图片设置一个 `threshold`（预加载阈值），比如快滚到剩下 200px 时就开始加载，给网络传输留出 buffer，让用户感官上觉得‘图一直都在’，而不是等看到了才加载。”

---

## 5. 八股关键词联想映射

| 考点关键词 | 你的回答关键词 |
| :--- | :--- |
| **浏览器渲染流水线** | 回流、重绘、合成层、帧渲染周期 |
| **性能优化指标** | LCP (Largest Contentful Paint)、资源抢占 |
| **JS 设计模式** | 注册中心、单例模式、观察者模式 |
| **Vue 指令生命周期** | mounted vs updated, 内存泄漏防范 |
| **DOM 操作** | 异步 API vs 同步 API 阻塞性能 |


<ArticleComments slug="project-highlight-lazyload" />
