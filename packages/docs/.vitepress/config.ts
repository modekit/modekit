import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'ModeKit',
  description: 'Accessible, feature-rich UI components for Vue applications.',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    [
      'script',
      {},
      `(function(){try{var colors=['black','red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose'];var color=localStorage.getItem('modekit-primary-color');document.documentElement.dataset.mkPrimary=colors.includes(color)?color:'black'}catch{document.documentElement.dataset.mkPrimary='black'}})()`,
    ],
  ],
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
      { component: 'PrimaryColorSwitcher' },
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
            { text: 'Icons', link: '/guide/icons' },
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
            { text: 'Avatar', link: '/components/avatar' },
            { text: 'Avatar Group', link: '/components/avatar-group' },
            { text: 'Badge', link: '/components/badge' },
            { text: 'Button', link: '/components/button' },
            { text: 'Button Group', link: '/components/button-group' },
            { text: 'Card', link: '/components/card' },
            { text: 'Spinner', link: '/components/spinner' },
          ],
        },
        {
          text: 'Form',
          items: [
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Input', link: '/components/input' },
            { text: 'Label', link: '/components/label' },
          ],
        },
        {
          text: 'Feedback',
          items: [{ text: 'Callout', link: '/components/callout' }],
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
