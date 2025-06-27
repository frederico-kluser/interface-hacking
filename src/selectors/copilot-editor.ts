/**
 * @fileoverview Seletores específicos para o editor do GitHub Copilot
 * @module selectors/copilot-editor
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para a parte de entrada interativa
 * @description Busca elementos com classe 'interactive-input-part'
 */
export const interactiveInputPartSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'interactive-input-part',
        isRegex: true,
      },
    ],
  },
];

/**
 * Seletor para o editor de entrada interativa
 * @description Busca elementos com classe 'interactive-input-editor'
 */
export const interactiveInputEditorSelector: TagWithAttributes[] = [
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

/**
 * Seletor para view-line dentro da parte interativa
 * @description Busca view-line específica do input interativo
 */
export const interactiveViewLineSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'interactive-input-part',
        isRegex: true,
      },
    ],
  },
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
