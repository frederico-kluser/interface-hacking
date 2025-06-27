/**
 * @fileoverview Tipos estendidos para seletores
 * @module types/selectors
 */
import type { TagWithAttributes } from './index.js';

/**
 * Metadados estendidos para seletores
 * @interface SelectorMetadata
 */
export interface SelectorMetadata {
  /** Descrição do seletor para documentação */
  description: string;
  /** Indica se o seletor pode retornar múltiplos elementos */
  multiplicity: 'single' | 'multiple';
  /** Categoria do seletor para organização */
  category?: 'editor' | 'form' | 'button' | 'layout' | 'custom';
  /** Indica se o seletor é crítico para o funcionamento */
  critical?: boolean;
}

/**
 * Seletor estendido com metadados
 * @interface ExtendedSelector
 */
export interface ExtendedSelector {
  /** Nome único do seletor */
  name: string;
  /** Hierarquia de tags para busca */
  hierarchy: TagWithAttributes[];
  /** Metadados do seletor */
  metadata: SelectorMetadata;
}

/**
 * Tipo para validação de seletores
 * @interface SelectorValidation
 */
export interface SelectorValidation {
  /** Indica se o seletor é válido */
  isValid: boolean;
  /** Mensagens de erro, se houver */
  errors?: string[];
  /** Avisos não críticos */
  warnings?: string[];
}

/**
 * Opções para busca com seletores
 * @interface SelectorSearchOptions
 */
export interface SelectorSearchOptions {
  /** Elemento raiz para busca (padrão: document) */
  root?: HTMLElement | Document;
  /** Timeout para busca em ms (padrão: 10000) */
  timeout?: number;
  /** Habilita cache de resultados */
  useCache?: boolean;
  /** Valida seletor antes da busca */
  validateFirst?: boolean;
}
