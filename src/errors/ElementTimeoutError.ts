/**
 * @fileoverview Erro quando timeout é excedido ao esperar por elemento
 * @module errors/ElementTimeoutError
 */

import DOMError from './DOMError.js';

/**
 * Erro quando timeout é excedido ao esperar por elemento
 * @class ElementTimeoutError
 * @extends DOMError
 */
export default class ElementTimeoutError extends DOMError {
  /**
   * Cria erro de timeout
   * @param selector - Seletor serializado que foi usado
   * @param timeoutMs - Tempo limite que foi excedido
   */
  constructor(selector: string, timeoutMs: number) {
    const message = `Timeout (${timeoutMs}ms) waiting for element with selector: ${selector}`;
    super(message, 'ELEMENT_TIMEOUT', { selector, timeoutMs });
    this.name = 'ElementTimeoutError';
  }
}
