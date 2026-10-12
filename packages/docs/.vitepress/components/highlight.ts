type ShikiCoreModule = typeof import('shiki/core')
type Highlighter = Awaited<ReturnType<ShikiCoreModule['createHighlighterCore']>>

export interface HighlightToken {
  content: string
  style: Record<string, string>
}

export type HighlightedCode = HighlightToken[][]

let highlighterPromise: Promise<Highlighter> | undefined

async function createVueTemplateHighlighter(): Promise<Highlighter> {
  const [core, engine, html, githubLight, githubDark] = await Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
    import('shiki/langs/html.mjs'),
    import('shiki/themes/github-light.mjs'),
    import('shiki/themes/github-dark.mjs'),
  ])

  return core.createHighlighterCore({
    themes: [githubLight.default, githubDark.default],
    langs: [html.default],
    engine: engine.createJavaScriptRegexEngine(),
  })
}

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createVueTemplateHighlighter()

  return highlighterPromise
}

export async function highlightVueTemplate(source: string): Promise<HighlightedCode> {
  const highlighter = await getHighlighter()
  const { tokens } = highlighter.codeToTokens(source, {
    lang: 'html',
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: false,
  })

  return tokens.map((line) =>
    line.map((token) => ({
      content: token.content,
      style: typeof token.htmlStyle === 'object' ? token.htmlStyle : {},
    })),
  )
}
