'use strict';

const Editor = require('Editor');
const EditorState = require('EditorState');
const ContentState = require('ContentState');
const SelectionState = require('SelectionState');
const Decorator = require('Decorator');
const Entity = require('Entity');
const EntityUtil = require('EntityUtil');
const richUtil = require('richUtil');
const styleMap = require('styleMap')

const sfd = {
  Editor,
  EditorState,
  ContentState,
  SelectionState,
  Decorator,
  Entity,
  EntityUtil,
  richUtil,
  styleMap
};

module.exports = sfd;
