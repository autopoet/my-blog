import { defineAppSetup } from 'valaxy'
import { lazyDirective } from '../components/directives/lazy'

/**
 * Valaxy 提供的扩展入口
 * 你可以在这里像平时的 main.ts 一样，给 Vue 项目注册全局的东西
 */
export default defineAppSetup((ctx) => {
  // 从上下文中解构出 app 对象（也就是 Vue 实例）
  const { app } = ctx

  // 【核心这一行】注册我们的懒加载指令
  // 以后在任何地方写 v-lazy，Vue 都能识别它是我们刚才写的那个逻辑了
  app.directive('lazy', lazyDirective)
})
