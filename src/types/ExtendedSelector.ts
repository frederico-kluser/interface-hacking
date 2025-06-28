/**
 * @fileoverview Seletor estendido com metadados
 * @module types/ExtendedSelector
 */

import type SelectorMetadata from './SelectorMetadata.js';
import type TagWithAttributes from './TagWithAttributes.js';

/**
 * Seletor estendido com metadados
 */
interface ExtendedSelector {
  /** Nome único do seletor */
  name: string;
  /** Hierarquia de tags para busca */
  hierarchy: TagWithAttributes[];
  /** Metadados do seletor */
  metadata: SelectorMetadata;
}

export default ExtendedSelector;
