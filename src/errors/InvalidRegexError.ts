/**
 * @fileoverview Erro quando regex é inválida
 * @module errors/InvalidRegexError
 */

import DOMError from './DOMError.js';

/**
 * Erro quando regex é inválida
 * @class InvalidRegexError
 * @extends DOMError
 */
export default class InvalidRegexError extends DOMError {
  /**
   * Cria erro de regex inválida
   * @param pattern - Padrão regex que causou o erro
   * @param error - Erro original do RegExp
   */
  constructor(pattern: string, error: Error) {
    const message = `Invalid regex pattern: ${pattern} - ${error.message}`;
    super(message, 'INVALID_REGEX', { pattern, originalError: error.message });
    this.name = 'InvalidRegexError';
  }
}
