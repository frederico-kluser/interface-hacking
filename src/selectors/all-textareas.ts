/**
 * @fileoverview Seletor para todos os textareas
 * @module selectors/all-textareas
 */
import type { TagWithAttributes } from '../types/index.js';

/**
 * Seletor para todos os textareas
 * @description Busca todos os elementos textarea na página
 */
const allTextareasSelector: TagWithAttributes[] = [
  {
    tag: 'textarea',
    attributes: [],
  },
];

export default allTextareasSelector;
