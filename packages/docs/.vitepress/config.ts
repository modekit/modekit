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
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/modekit-icon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100..1000&family=Inter:opsz,wght@14..32,100..900&family=Manrope:wght@200..800&family=Plus+Jakarta+Sans:wght@200..800&family=Space+Grotesk:wght@300..700&display=swap',
      },
    ],
    [
      'script',
      {},
      `(function(){try{var primaryColors=['black','slate','gray','zinc','stone','red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose'];var neutralColors=['slate','gray','zinc','stone'];var fonts=['dm-sans','inter','manrope','plus-jakarta-sans','space-grotesk','system'];var primary=localStorage.getItem('modekit-primary-color');var neutral=localStorage.getItem('modekit-neutral-color');var font=localStorage.getItem('modekit-content-font');document.documentElement.dataset.mkPrimary=primaryColors.includes(primary)?primary:'black';document.documentElement.dataset.mkNeutral=neutralColors.includes(neutral)?neutral:'zinc';document.documentElement.dataset.mkFont=fonts.includes(font)?font:'dm-sans'}catch{document.documentElement.dataset.mkPrimary='black';document.documentElement.dataset.mkNeutral='zinc';document.documentElement.dataset.mkFont='dm-sans'}})()`,
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
      { component: 'ThemeSwitcher' },
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
          text: 'Layout',
          items: [
            { text: 'Flex', link: '/components/flex' },
            { text: 'Grid', link: '/components/grid' },
            { text: 'Spacing', link: '/components/spacing' },
          ],
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
            { text: 'Separator', link: '/components/separator' },
            { text: 'Spinner', link: '/components/spinner' },
          ],
        },
        {
          text: 'Typography',
          items: [
            { text: 'Headline', link: '/components/headline' },
            { text: 'Text', link: '/components/text' },
            { text: 'Paragraph', link: '/components/paragraph' },
            { text: 'Caption', link: '/components/caption' },
            { text: 'Ellipsis Text', link: '/components/ellipsis-text' },
            { text: 'Mark', link: '/components/mark' },
            { text: 'Link', link: '/components/link' },
          ],
        },
        {
          text: 'Form',
          items: [
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Input', link: '/components/input' },
            { text: 'Label', link: '/components/label' },
            { text: 'Radio Group', link: '/components/radio-group' },
            { text: 'Select', link: '/components/select' },
            { text: 'Switch', link: '/components/switch' },
            { text: 'Textarea', link: '/components/textarea' },
          ],
        },
        {
          text: 'Overlay',
          items: [
            { text: 'Alert Dialog', link: '/components/alert-dialog' },
            { text: 'Dialog', link: '/components/dialog' },
            { text: 'Sheet (Alpha)', link: '/components/sheet' },
            { text: 'Dropdown', link: '/components/dropdown' },
            { text: 'Hover Card', link: '/components/hover-card' },
            { text: 'Popover', link: '/components/popover' },
            { text: 'Tooltip', link: '/components/tooltip' },
          ],
        },
        {
          text: 'Feedback',
          items: [
            { text: 'Callout', link: '/components/callout' },
            { text: 'Toast', link: '/components/toast' },
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
