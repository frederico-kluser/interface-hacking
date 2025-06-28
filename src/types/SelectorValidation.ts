/**
 * @fileoverview Tipo para validação de seletores
 * @module types/SelectorValidation
 */

/**
 * Tipo para validação de seletores
 */
interface SelectorValidation {
  /** Indica se o seletor é válido */
  isValid: boolean;
  /** Mensagens de erro, se houver */
  errors?: string[];
  /** Avisos não críticos */
  warnings?: string[];
}

export default SelectorValidation;
