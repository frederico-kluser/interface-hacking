/**
 * @fileoverview Classe de erro base para operações DOM
 * @module errors/DOMError
 */

/**
 * Erro base para operações DOM
 * @class DOMError
 * @extends Error
 */
export default class DOMError extends Error {
  /** Código único do erro */
  readonly code: string;
  /** Detalhes adicionais do erro */
  readonly details: Record<string, unknown> | undefined;

  /**
   * Cria uma nova instância de DOMError
   * @param message - Mensagem de erro
   * @param code - Código único do erro
   * @param details - Detalhes adicionais opcionais
   */
  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'DOMError';
    this.code = code;
    this.details = details;

    // Mantém stack trace correto em V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
