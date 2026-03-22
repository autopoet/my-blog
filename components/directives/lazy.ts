import type { Directive } from 'vue'

/**
 * 自定义图片懒加载指令: v-lazy
 * 作用：只有当图片滚动到屏幕可视区域时，才去加载真实的图片地址。
 */
export const lazyDirective: Directive<HTMLImageElement, string> = {
  // 当挂载指令的DOM元素（也就是<img>标签）被插入到页面中时执行
  mounted(el, binding) {
    // 1. 初始化的时候，先不显示真实图片，给它一个灰色的占位图
    el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

    // 2. 使用浏览器原生的 IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 元素出现在屏幕里了，加载真实图片
          el.src = binding.value;

          el.onerror = () => {
            el.src = 'https://via.placeholder.com/300x200?text=Image+Load+Failed';
          };

          // 停止观察
          observer.unobserve(el);
        }
      });
    });

    observer.observe(el);

    // 把观察者对象偷偷存起来。注意这里用了 (el as any) 绕过 TS 的检查，
    // 因为标准的 HTML 元素身上确实没带这个属性。
    (el as any)._observer = observer;
  },

  // 当指令所在的组件被销毁时触发
  unmounted(el) {
    const observer = (el as any)._observer;
    if (observer) {
      observer.disconnect();
    }
  }
};
