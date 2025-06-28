/**
 * @fileoverview Seletor para botão Monaco padrão
 * @module selectors/monaco-default-button
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para botão Monaco padrão
 * @description Busca botões com classes monaco-button e default
 */
const monacoDefaultButtonSelector: TagWithAttributes[] = [
  {
    tag: 'button',
    attributes: [
      {
        attribute: 'class',
        value: 'monaco-button.*default',
        isRegex: true,
      },
    ],
  },
];

export default monacoDefaultButtonSelector;
