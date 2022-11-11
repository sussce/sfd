'use strict';

const onFocus = require('onFocus')
const onBlur = require('onBlur')
const onKeyDown = require('onKeyDown')
const onBeforeInput = require('onBeforeInput')
const onInput = require('onInput')
const onSelect = require('onSelect')

const eventHandler = {
  onFocus,
  onBlur,
  onKeyDown,
  onBeforeInput,
  onInput,
  onSelect,
  onKeyUp: onSelect,
  onMouseUp: onSelect
};

module.exports = eventHandler
