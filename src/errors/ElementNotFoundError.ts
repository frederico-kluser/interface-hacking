/**
 * @fileoverview Erro quando elemento não é encontrado
 * @module errors/ElementNotFoundError
 */

import DOMError from './DOMError.js';

/**
 * Erro quando elemento não é encontrado
 * @class ElementNotFoundError
 * @extends DOMError
 */
export default class ElementNotFoundError extends DOMError {
  /**
   * Cria erro para elemento não encontrado
   * @param selector - Seletor serializado que foi usado
   * @param context - Contexto onde a busca foi realizada
   */
  constructor(selector: string, context: string = 'document') {
    const message = `Element not found with selector: ${selector} in context: ${context}`;
    super(message, 'ELEMENT_NOT_FOUND', { selector, context });
    this.name = 'ElementNotFoundError';
  }
}
