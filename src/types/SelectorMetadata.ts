/**
 * @fileoverview Metadados estendidos para seletores
 * @module types/SelectorMetadata
 */

/**
 * Metadados estendidos para seletores
 */
interface SelectorMetadata {
  /** Descrição do seletor para documentação */
  description: string;
  /** Indica se o seletor pode retornar múltiplos elementos */
  multiplicity: 'single' | 'multiple';
  /** Categoria do seletor para organização */
  category?: 'editor' | 'form' | 'button' | 'layout' | 'custom';
  /** Indica se o seletor é crítico para o funcionamento */
  critical?: boolean;
}

export default SelectorMetadata;
