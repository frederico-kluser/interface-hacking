import type TagWithAttributes from '../types/TagWithAttributes.js';

/**
 * Seletor para elementos monaco-list-row
 * Esses são os itens individuais do dropdown do Monaco
 */
const monacoListRowSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'monaco-list-row',
      },
    ],
  },
];

export default monacoListRowSelector;
