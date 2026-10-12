import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'ModeKit',
  description: 'Adaptive Vue components for Web, iOS, and Android interfaces.',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/about', activeMatch: '/guide/' },
      { text: 'Components', link: '/components/', activeMatch: '/components/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [{ text: 'About ModeKit', link: '/guide/about' }],
        },
        {
          text: 'Foundations',
          items: [
            { text: 'Adaptive modes', link: '/guide/adaptive-modes' },
            { text: 'Accessibility', link: '/guide/accessibility' },
          ],
        },
        {
          text: 'Contributing',
          items: [
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Coding guidelines', link: '/guide/coding-guidelines' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Components',
          items: [{ text: 'Overview', link: '/components/' }],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/modekit/modekit' }],
    search: { provider: 'local' },
  },
})
