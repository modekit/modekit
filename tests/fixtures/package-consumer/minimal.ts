import { MkButton } from '@modekit/vue'
import '@modekit/vue/styles.css'
import { createApp, h } from 'vue'

createApp({
  render: () => h(MkButton, () => 'Minimal ModeKit consumer'),
}).mount('#app')
