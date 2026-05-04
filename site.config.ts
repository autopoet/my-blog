import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://blog.autopoet.cn/',
  lang: 'zh-CN',
  title: 'Autopoet 技术笔记',
  favicon: '/logo.png',
  author: {
    name: 'autopoet',
    avatar: '/me.jpg',
  },
  description: '一个记录技术学习、工程实践与思考成长的个人博客',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/autopoet',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: 'E-Mail',
      link: 'mailto:autopoet@163.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
  ],

  search: {
    enable: false,
  },

  sponsor: {
    enable: false,
  },
})
