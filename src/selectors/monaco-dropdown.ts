/**
 * @fileoverview Seletor para dropdowns da toolbar do Monaco Editor
 * @module selectors/monaco-dropdown
 */
import type TagWithAttributes from '../types/TagWithAttributes.js';

/**
 * Seletor para dropdowns do Monaco Editor na toolbar
 * @description Busca elementos dropdown na toolbar do Monaco (ex: modelPicker, agentPicker)
 */
const monacoDropdownSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'monaco-toolbar',
      },
    ],
  },
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'monaco-action-bar',
      },
    ],
  },
  {
    tag: 'ul',
    attributes: [
      {
        attribute: 'class',
        value: 'actions-container',
      },
      {
        attribute: 'role',
        value: 'toolbar',
      },
    ],
  },
  {
    tag: 'li',
    attributes: [
      {
        attribute: 'class',
        value: '.*chat-modelPicker-item.*',
        isRegex: true,
      },
      {
        attribute: 'role',
        value: 'presentation',
      },
    ],
  },
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'monaco-dropdown',
      },
    ],
  },
];

export default monacoDropdownSelector;
