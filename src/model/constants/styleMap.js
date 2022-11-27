'use strict';

const styleMap = {
  H1: {fontSize: 24},
  H2: {fontSize: 20},
  H3: {fontSize: 16},
  BOLD: {fontWeight: 'bold'},
  ITALIC: {fontStyle: 'italic'},
  UNDERLINE: {textDecoration: 'underline'},
  LINETHROUGH: {textDecoration: 'line-through'},
  MONOSPACE: { fontFamily: 'monospace', wordWrap: 'break-word'},
  QUOTE: {}
}

styleMap.BOLD_ITALIC = { ...styleMap.BOLD, ...styleMap.ITALIC }

module.exports = styleMap
