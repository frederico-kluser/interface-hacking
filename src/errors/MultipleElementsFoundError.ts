/**
 * @fileoverview Erro quando múltiplos elementos são encontrados mas esperava-se apenas um
 * @module errors/MultipleElementsFoundError
 */

import DOMError from './DOMError.js';

/**
 * Erro quando múltiplos elementos são encontrados mas esperava-se apenas um
 * @class MultipleElementsFoundError
 * @extends DOMError
 */
export default class MultipleElementsFoundError extends DOMError {
  /**
   * Cria erro para múltiplos elementos encontrados
   * @param selector - Seletor serializado que foi usado
   * @param count - Número de elementos encontrados
   * @param context - Contexto onde a busca foi realizada
   */
  constructor(selector: string, count: number, context: string = 'document') {
    const message = `Expected single element but found ${count} elements with selector: ${selector} in context: ${context}`;
    super(message, 'MULTIPLE_ELEMENTS_FOUND', { selector, count, context });
    this.name = 'MultipleElementsFoundError';
  }
}
