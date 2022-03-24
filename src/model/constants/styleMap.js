'use strict';

const styleMap = {
  BOLD: {fontWeight: 'bold'},
  ITALIC: {fontStyle: 'italic'},
  CODE: { fontFamily: 'monospace', wordWrap: 'break-word'},
  UNDERLINE: {textDecoration: 'underline'},
  LINETHROUGH: {textDecoration: 'line-through'},
}

styleMap.BOLD_ITALIC = { ...styleMap.BOLD, ...styleMap.ITALIC }

module.exports = styleMap
