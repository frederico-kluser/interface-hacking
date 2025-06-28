/**
 * @fileoverview Seletor para a parte de entrada interativa
 * @module selectors/interactive-input-part
 */

import TagWithAttributes from '../types/TagWithAttributes';

/**
 * Seletor para a parte de entrada interativa
 * @description Busca elementos com classe 'interactive-input-part'
 */
const interactiveInputPartSelector: TagWithAttributes[] = [
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

export default interactiveInputPartSelector;
