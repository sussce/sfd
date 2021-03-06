// @flow
'use strict';

const {Record} = require('immutable')

type SelectionStateConfig = {
  anchorKey: ?string,
  anchorOffset: ?number,
  focusKey: ?string,
  focusOffset: ?number,
  collapsed: boolean,
  focused: boolean,
  backward: boolean
}

const defaultConfig: SelectionStateConfig = {
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  collapsed: true,
  focused: false,
  backward: false
}

const SelectionStateRecord = (Record(defaultConfig):any)

class SelectionState extends SelectionStateRecord {
  static createEmpty(key: string): SelectionState {
    return new SelectionState({
      anchorKey: key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0
    })
  }

  getStartKey(): string {
    return this.getBackward()
      ? this.getFocusKey()
      : this.getAnchorKey()
  }

  getStartOffset(): number {
    return this.getBackward()
      ? this.getFocusOffset()
      : this.getAnchorOffset()
  }

  getEndKey(): string {
    return this.getBackward()
      ? this.getAnchorKey()
      : this.getFocusKey()
  }

  getEndOffset(): number {
    return this.getBackward()
      ? this.getAnchorOffset()
      : this.getFocusOffset()
  }
  
  getAnchorKey(): string {
    return this.get('anchorKey')
  }

  getAnchorOffset(): number {
    return this.get('anchorOffset')
  }

  getFocusKey(): string {
    return this.get('focusKey')
  }

  getFocusOffset(): number {
    return this.get('focusOffset')
  }

  getCollapsed(): boolean {
    return this.get('collapsed')
  }
  
  getFocused(): boolean {
    return this.get('focused')
  }

  getBackward(): boolean {
    return this.get('backward')
  }
}

module.exports = SelectionState
