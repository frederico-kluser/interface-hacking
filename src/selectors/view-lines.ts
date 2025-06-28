/**
 * @fileoverview Seletor para view-lines dentro do editor
 * @module selectors/view-lines
 */
import TagWithAttributes from '../types/TagWithAttributes';

/**
 * Seletor para view-lines dentro do editor
 * @description Busca elementos com classe 'view-lines' dentro do Monaco
 */
const viewLinesSelector: TagWithAttributes[] = [
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

export default viewLinesSelector;
