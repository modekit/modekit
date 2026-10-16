import { MkButton, MkDialog } from '@modekit/vue'
import '@modekit/vue/styles.css'
import { createApp, h } from 'vue'

const app = createApp({
  render: () =>
    h('main', { id: 'packed-client' }, [
      h('h1', 'Packed client build'),
      h(MkButton, { id: 'packed-action' }, () => 'Continue'),
      h(
        MkDialog,
        {
          title: 'Packed client dialog',
          description: 'Rendered from the packed browser bundle.',
        },
        {
          default: () => h(MkButton, { id: 'packed-dialog-trigger' }, () => 'Open dialog'),
          content: () => 'Packed client dialog content',
        },
      ),
    ]),
})

app.mount('#app')
