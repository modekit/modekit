import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'ModeKit',
  description: 'Accessible, feature-rich UI components for Vue applications.',
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        {
          find: /^@modekit\/vue$/,
          replacement: fileURLToPath(new URL('../../vue/src/api.ts', import.meta.url)),
        },
      ],
    },
  },
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
            { text: 'Styling', link: '/guide/styling' },
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
        {
          text: 'Element',
          items: [
            { text: 'Button', link: '/components/button' },
            { text: 'Spinner', link: '/components/spinner' },
            { text: 'Card', link: '/components/card' },
          ],
        },
        {
          text: 'Form',
          items: [
            { text: 'Label', link: '/components/label' },
            { text: 'Checkbox', link: '/components/checkbox' },
          ],
        },
        {
          text: 'Navigation',
          items: [{ text: 'Tabs', link: '/components/tabs' }],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/modekit/modekit' }],
    search: { provider: 'local' },
  },
})
