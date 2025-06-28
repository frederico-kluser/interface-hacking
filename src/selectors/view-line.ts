/**
 * @fileoverview Seletor para uma única linha de visualização
 * @module selectors/view-line
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para uma única linha de visualização
 * @description Busca elementos com classe 'view-line' dentro das view-lines
 */
const viewLineSelector: TagWithAttributes[] = [
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

export default viewLineSelector;
