/**
 * @fileoverview Seletores para elementos do Monaco Editor
 * @module selectors/monaco-editor
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para todos os editores Monaco
 * @description Busca todos os elementos com classe 'monaco-editor'
 */
export const monacoEditorsSelector: TagWithAttributes[] = [
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

/**
 * Seletor para view-lines dentro do editor
 * @description Busca elementos com classe 'view-lines' dentro do Monaco
 */
export const viewLinesSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'view-lines',
        isRegex: true,
      },
    ],
  },
];

/**
 * Seletor para uma única linha de visualização
 * @description Busca elementos com classe 'view-line' dentro das view-lines
 */
export const viewLineSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'view-line',
        isRegex: true,
      },
    ],
  },
];
