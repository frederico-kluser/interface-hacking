/**
 * @fileoverview Erro quando seletor é inválido
 * @module errors/InvalidSelectorError
 */

import DOMError from './DOMError.js';

/**
 * Erro quando seletor é inválido
 * @class InvalidSelectorError
 * @extends DOMError
 */
export default class InvalidSelectorError extends DOMError {
  /**
   * Cria erro de seletor inválido
   * @param reason - Razão pela qual o seletor é inválido
   * @param selector - Seletor que causou o erro
   */
  constructor(reason: string, selector?: unknown) {
    const message = `Invalid selector: ${reason}`;
    super(message, 'INVALID_SELECTOR', { reason, selector });
    this.name = 'InvalidSelectorError';
  }
}
