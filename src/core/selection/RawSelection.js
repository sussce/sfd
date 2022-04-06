// @flow
'use strict';

export type RawSelection = {
  anchorNode: ?Node,
  anchorOffset: number,
  focusNode: ?Node,
  focusOffset: number,
  rangeCount: number,
  isCollapsed: boolean,
  type: string,

  addRange: (range: Range) => void,
  extend?: (node: Node, offset?: number) => void,
  getRangeAt: (index: number) => Range,
  removeAllRanges: () => void
}
