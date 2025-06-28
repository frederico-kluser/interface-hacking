/**
 * @fileoverview Opções para busca com seletores
 * @module types/SelectorSearchOptions
 */

/**
 * Opções para busca com seletores
 */
interface SelectorSearchOptions {
  /** Elemento raiz para busca (padrão: document) */
  root?: HTMLElement | Document;
  /** Timeout para busca em ms (padrão: 10000) */
  timeout?: number;
  /** Habilita cache de resultados */
  useCache?: boolean;
  /** Valida seletor antes da busca */
  validateFirst?: boolean;
}

export default SelectorSearchOptions;
