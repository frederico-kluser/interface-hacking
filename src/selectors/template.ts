/**
 * @fileoverview Seletor template para botões com gamepad
 * @module selectors/template
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor template para botões com gamepad
 * @description Busca elementos span com classe gamepad-2nd-icon-wrapper
 */
const templateButtons: TagWithAttributes[] = [
  {
    tag: 'span',
    attributes: [
      {
        attribute: 'class',
        value: 'gamepad-2nd-icon-wrapper',
        isRegex: true,
      },
    ],
  },
];

export default templateButtons;
