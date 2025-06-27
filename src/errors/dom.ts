/**
 * @fileoverview Classes de erro customizadas para operações DOM
 * @module errors/dom
 */

/**
 * Erro base para operações DOM
 * @class DOMError
 * @extends Error
 */
export class DOMError extends Error {
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

/**
 * Erro quando elemento não é encontrado
 * @class ElementNotFoundError
 * @extends DOMError
 */
export class ElementNotFoundError extends DOMError {
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

/**
 * Erro quando múltiplos elementos são encontrados mas esperava-se apenas um
 * @class MultipleElementsFoundError
 * @extends DOMError
 */
export class MultipleElementsFoundError extends DOMError {
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

/**
 * Erro quando timeout é excedido ao esperar por elemento
 * @class ElementTimeoutError
 * @extends DOMError
 */
export class ElementTimeoutError extends DOMError {
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

/**
 * Erro quando seletor é inválido
 * @class InvalidSelectorError
 * @extends DOMError
 */
export class InvalidSelectorError extends DOMError {
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

/**
 * Erro quando regex é inválida
 * @class InvalidRegexError
 * @extends DOMError
 */
export class InvalidRegexError extends DOMError {
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
