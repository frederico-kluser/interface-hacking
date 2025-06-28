/**
 * @fileoverview Seletor para o editor de entrada interativa
 * @module selectors/interactive-input-editor
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para o editor de entrada interativa
 * @description Busca elementos com classe 'interactive-input-editor'
 */
const interactiveInputEditorSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'interactive-input-editor',
        isRegex: true,
      },
    ],
  },
];

export default interactiveInputEditorSelector;
