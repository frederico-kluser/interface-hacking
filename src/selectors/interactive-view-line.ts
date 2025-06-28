/**
 * @fileoverview Seletor para view-line dentro da parte interativa
 * @module selectors/interactive-view-line
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para view-line dentro da parte interativa
 * @description Busca view-line específica do input interativo
 */
const interactiveViewLineSelector: TagWithAttributes[] = [
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

export default interactiveViewLineSelector;
