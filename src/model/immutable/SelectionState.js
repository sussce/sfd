// @flow
'use strict';

const {Record} = require('immutable')

type SelectionStateConfig = {
  anchorKey: ?string,
  anchorOffset: ?number,
  focusKey: ?string,
  focusOffset: ?number,
  focused: boolean
  // backward
}

const defaultConfig: SelectionStateConfig = {
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  focused: false
}

const SelectionStateRecord = (Record(defaultConfig):any)

class SelectionState extends SelectionStateRecord {
  static createEmpty(key: string): SelectionState {
    return new SelectionState({
      anchorKey: key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0,
      focused: false
    })
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

  focused(): boolean {
    return this.get('focused')
  }
  
  collapsed(): boolean {
    return this.getAnchorKey() == this.getFocusKey() &&
      this.getAnchorOffset() == this.getFocusOffset()
  }

  // backward(): boolean {}
}

module.exports = SelectionState
