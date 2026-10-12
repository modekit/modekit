import baseTokens from '../../../vue/src/styles/tokens/base.css?raw'
import contrastTokens from '../../../vue/src/styles/tokens/contrast.css?raw'
import densityTokens from '../../../vue/src/styles/tokens/density.css?raw'
import platformTokens from '../../../vue/src/styles/tokens/platform.css?raw'
import schemeTokens from '../../../vue/src/styles/tokens/scheme.css?raw'
import buttonStyles from '../../../vue/src/styles/components/button.css?raw'

const layerOrder = `
@layer modekit.tokens.base, modekit.tokens.platform, modekit.tokens.scheme,
  modekit.tokens.contrast, modekit.tokens.density, modekit.tokens.compound;
`

export const modeKitStyles = [
  layerOrder,
  baseTokens,
  platformTokens,
  schemeTokens,
  contrastTokens,
  densityTokens,
  buttonStyles,
].join('\n')
