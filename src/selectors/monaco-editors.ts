/**
 * @fileoverview Seletor para todos os editores Monaco
 * @module selectors/monaco-editors
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para todos os editores Monaco
 * @description Busca todos os elementos com classe 'monaco-editor'
 */
const monacoEditorsSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'monaco-editor',
        isRegex: true,
      },
    ],
  },
];

export default monacoEditorsSelector;
