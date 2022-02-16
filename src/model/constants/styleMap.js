'use strict';

const styleMap = {
  BOLD: {fontWeight: 'bold'},
  ITALIC: {fontStyle: 'italic'},
  CODE: { fontFamily: 'monospace', wordWrap: 'break-word'},
  UNDERLINE: {textDecoration: 'underline'},
  LINETHROUGH: {textDecoration: 'line-through'},
  get BOLD_ITALIC() { return {...this.BOLD, ...this.ITALIC} }
}

module.exports = styleMap
