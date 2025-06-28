/**
 * @fileoverview Seletor para botão de envio com aria-label "Send"
 * @module selectors/send-button-aria
 */
import TagWithAttributes from '../types/TagWithAttributes';

/**
 * Seletor para botão de envio com aria-label "Send"
 * @description Busca botões com aria-label contendo "Send"
 */
const sendButtonAriaSelector: TagWithAttributes[] = [
  {
    tag: 'button',
    attributes: [
      {
        attribute: 'aria-label',
        value: 'Send',
        isRegex: true,
      },
    ],
  },
];

export default sendButtonAriaSelector;
