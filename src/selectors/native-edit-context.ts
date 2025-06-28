/**
 * @fileoverview Seletor para o contexto de edição nativo do Monaco
 * @module selectors/native-edit-context
 */
import TagWithAttributes from '../types/TagWithAttributes.js';

/**
 * Seletor para o native-edit-context do Monaco Editor
 * @description Busca o elemento que realmente recebe a entrada no Monaco
 */
const nativeEditContextSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'native-edit-context',
        isRegex: true,
      },
    ],
  },
];

export default nativeEditContextSelector;
