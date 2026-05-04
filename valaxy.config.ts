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
      title: 'Autopoet 技术笔记',
      cloud: {
        enable: false,
      },
    },

    pages: [],

    footer: {
      since: 2026,
    },
  },

  unocss: { safelist },
})
