// @flow
'use strict';
import type {InlineStyle} from 'InlineStyle'
const ContentBlock = require('ContentBlock')
const CharMeta = require('CharMeta')

function applyStyleToContentBlock(
  block: ContentBlock,
  style: InlineStyle,
  start: number,
  end: number
): ContentBlock {
  let charMetas = block.getCharMetas()
  while(start < end) {
    const charMeta = charMetas.get(start)
    charMetas = charMetas.set(
      start,
      CharMeta.applyStyle(charMetas.get(start), style)
    )
    start++
  }
  return block.set('charMetas', charMetas)
}

module.exports = applyStyleToContentBlock
