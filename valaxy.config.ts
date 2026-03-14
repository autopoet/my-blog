import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
  'i-ri-book-open-line',
  'i-ri-code-s-slash-line',
  'i-ri-cpu-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '前端面试 & 算法笔记',
    },

    pages: [
      {
        name: '面试八股',
        url: '/categories/面试八股/',
        icon: 'i-ri-book-open-line',
        color: 'dodgerblue',
      },
      {
        name: '代码输出',
        url: '/categories/代码输出/',
        icon: 'i-ri-code-s-slash-line',
        color: 'hotpink',
      },
      {
        name: '算法题',
        url: '/categories/算法/',
        icon: 'i-ri-cpu-line',
        color: 'orange',
      },
    ],

    footer: {
      since: 2026,
    },
  },

  unocss: { safelist },
})
