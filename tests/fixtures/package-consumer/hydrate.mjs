import assert from 'node:assert/strict'
import console from 'node:console'
import process from 'node:process'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  pretendToBeVisual: true,
  url: 'https://modekit.test/',
})

const { window } = dom
const browserGlobals = {
  window,
  document: window.document,
  navigator: window.navigator,
  Node: window.Node,
  NodeFilter: window.NodeFilter,
  Element: window.Element,
  HTMLElement: window.HTMLElement,
  SVGElement: window.SVGElement,
  Event: window.Event,
  CustomEvent: window.CustomEvent,
  KeyboardEvent: window.KeyboardEvent,
  MouseEvent: window.MouseEvent,
  PointerEvent: window.PointerEvent ?? window.MouseEvent,
  MutationObserver: window.MutationObserver,
  getComputedStyle: window.getComputedStyle.bind(window),
  requestAnimationFrame: window.requestAnimationFrame.bind(window),
  cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
}

for (const [name, value] of Object.entries(browserGlobals)) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value,
    writable: true,
  })
}

const [{ createSSRApp, h, nextTick }, { renderToString }, { createModeKit, MkDialog }] =
  await Promise.all([import('vue'), import('vue/server-renderer'), import('@modekit/vue')])

function createHydrationApp() {
  const app = createSSRApp({
    render: () =>
      h('main', { id: 'hydrated-root' }, [
        h('p', 'Hydrated root content'),
        h(
          MkDialog,
          {
            defaultOpen: true,
            modal: false,
            title: 'Hydrated portal',
            description: 'This dialog crosses the SSR portal boundary.',
            onOpenAutoFocus: (event) => event.preventDefault(),
          },
          {
            content: () => h('p', { id: 'hydrated-portal-content' }, 'Hydrated portal content'),
          },
        ),
      ]),
  })
  app.use(createModeKit({ theme: { primary: 'green', neutral: 'slate' } }))
  return app
}

const ssrContext = {}
const serverHtml = await renderToString(createHydrationApp(), ssrContext)
const portaledHtml = ssrContext.teleports?.body

assert.match(serverHtml, /Hydrated root content/)
assert.equal(portaledHtml, undefined)

window.document.body.innerHTML = `<div id="app">${serverHtml}</div>${portaledHtml ?? ''}`

const hydrationMessages = []
const originalError = console.error
const originalWarn = console.warn
console.error = (...args) => hydrationMessages.push(args.join(' '))
console.warn = (...args) => hydrationMessages.push(args.join(' '))

const clientApp = createHydrationApp()

try {
  clientApp.mount('#app')
  await nextTick()
  await new Promise((resolve) => window.requestAnimationFrame(resolve))

  assert.equal(
    window.document.querySelector('#hydrated-root')?.textContent?.includes('Hydrated root content'),
    true,
  )
  assert.equal(
    window.document.querySelector('#hydrated-portal-content')?.textContent,
    'Hydrated portal content',
  )
  assert.equal(
    window.document
      .querySelector('[role="dialog"]')
      ?.textContent?.includes('Hydrated portal content'),
    true,
  )
  assert.deepEqual(hydrationMessages, [])
} finally {
  clientApp.unmount()
  console.error = originalError
  console.warn = originalWarn
  dom.window.close()
}

process.stdout.write('SSR-to-client hydration with portaled content passed.\n')
