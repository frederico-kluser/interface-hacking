/**
 * @fileoverview Seletor para botão com ícone de envio
 * @module selectors/send-icon-button
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para botão com ícone de envio
 * @description Busca botões com classe codicon-send dentro de interactive-input-part
 */
const sendIconButtonSelector: TagWithAttributes[] = [
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
        attribute: 'class',
        value: 'codicon-send',
        isRegex: true,
      },
    ],
  },
];

export default sendIconButtonSelector;
