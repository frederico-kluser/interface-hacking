/**
 * @fileoverview Seletor para textareas não readonly
 * @module selectors/editable-textarea
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para textareas não readonly
 * @description Busca textareas que não possuem atributo readonly
 * NOTA: Como findElementByHierarchy não suporta isAbsent, filtramos no código
 */
const editableTextareaSelector: TagWithAttributes[] = [
  {
    tag: 'textarea',
    attributes: [],
  },
];

export default editableTextareaSelector;
