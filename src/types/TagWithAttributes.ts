/**
 * @fileoverview Interface para tag com atributos
 * @module types/TagWithAttributes
 */

import type TagAttribute from './TagAttribute.js';

/**
 * Interface para representar uma tag com seus atributos
 */
interface TagWithAttributes {
  /** Nome da tag HTML */
  tag: string;
  /** Lista de atributos da tag */
  attributes: TagAttribute[];
}

export default TagWithAttributes;
