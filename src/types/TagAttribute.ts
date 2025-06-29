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
  /** Indica se o valor deve ser tratado como substring (contido no valor do atributo) */
  contains?: boolean;
};

export default TagAttribute;
