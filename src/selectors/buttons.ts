/**
 * @fileoverview Seletores para botões de ação
 * @module selectors/buttons
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para botão de envio com aria-label "Send"
 * @description Busca botões com aria-label contendo "Send"
 */
export const sendButtonAriaSelector: TagWithAttributes[] = [
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

/**
 * Seletor para botão de envio com aria-label "Submit"
 * @description Busca botões com aria-label contendo "Submit"
 */
export const submitButtonAriaSelector: TagWithAttributes[] = [
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

/**
 * Seletor para botão com ícone de envio
 * @description Busca botões com classe codicon-send dentro de interactive-input-part
 */
export const sendIconButtonSelector: TagWithAttributes[] = [
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

/**
 * Seletor para botão submit dentro de interactive-input-part
 * @description Busca botões com type="submit" dentro da parte interativa
 */
export const submitButtonSelector: TagWithAttributes[] = [
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

/**
 * Seletor para botão Monaco padrão
 * @description Busca botões com classes monaco-button e default
 */
export const monacoDefaultButtonSelector: TagWithAttributes[] = [
  {
    tag: 'button',
    attributes: [
      {
        attribute: 'class',
        value: 'monaco-button.*default',
        isRegex: true,
      },
    ],
  },
];
