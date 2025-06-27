/**
 * @fileoverview Seletores para elementos de formulário
 * @module selectors/form-elements
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para todos os textareas
 * @description Busca todos os elementos textarea na página
 */
export const allTextareasSelector: TagWithAttributes[] = [
  {
    tag: 'textarea',
    attributes: [],
  },
];

/**
 * Seletor para textareas não readonly
 * @description Busca textareas que não possuem atributo readonly
 * NOTA: Como findElementByHierarchy não suporta isAbsent, filtramos no código
 */
export const editableTextareaSelector: TagWithAttributes[] = [
  {
    tag: 'textarea',
    attributes: [],
  },
];
