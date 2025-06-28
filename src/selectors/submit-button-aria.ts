/**
 * @fileoverview Seletor para botão de envio com aria-label "Submit"
 * @module selectors/submit-button-aria
 */
import TagWithAttributes from '../types/TagWithAttributes';

/**
 * Seletor para botão de envio com aria-label "Submit"
 * @description Busca botões com aria-label contendo "Submit"
 */
const submitButtonAriaSelector: TagWithAttributes[] = [
  {
    tag: 'button',
    attributes: [
      {
        attribute: 'aria-label',
        value: 'Submit',
        isRegex: true,
      },
    ],
  },
];

export default submitButtonAriaSelector;
