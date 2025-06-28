/**
 * @fileoverview Tipo para atributos de tags
 * @module types/TagAttribute
 */

/**
 * Tipo para representar um atributo de tag com valor e opção de regex
 */
type TagAttribute = {
  /** Nome do atributo */
  attribute: string;
  /** Valor do atributo */
  value: string;
  /** Indica se o valor deve ser tratado como regex */
  isRegex?: boolean;
};

export default TagAttribute;
