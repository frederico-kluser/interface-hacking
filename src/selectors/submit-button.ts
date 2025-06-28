/**
 * @fileoverview Seletor para botão submit dentro de interactive-input-part
 * @module selectors/submit-button
 */
import TagWithAttributes from '../types/TagWithAttributes';

/**
 * Seletor para botão submit dentro de interactive-input-part
 * @description Busca botões com type="submit" dentro da parte interativa
 */
const submitButtonSelector: TagWithAttributes[] = [
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
    tag: 'button',
    attributes: [
      {
        attribute: 'type',
        value: '^submit$',
        isRegex: true,
      },
    ],
  },
];

export default submitButtonSelector;
