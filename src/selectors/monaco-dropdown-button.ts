/**
 * @fileoverview Seletor para o botão de ação dos dropdowns do Monaco
 * @module selectors/monaco-dropdown-button
 */
import type TagWithAttributes from '../types/TagWithAttributes.js';

/**
 * Seletor para o botão clickável dos dropdowns do Monaco
 * @description Busca o elemento <a> dentro do dropdown que pode ser clicado para abrir
 */
const monacoDropdownButtonSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: 'dropdown-label',
      },
    ],
  },
  {
    tag: 'a',
    attributes: [
      {
        attribute: 'class',
        value: 'action-label',
      },
      {
        attribute: 'role',
        value: 'button',
      },
      {
        attribute: 'aria-haspopup',
        value: 'true',
      },
    ],
  },
];

export default monacoDropdownButtonSelector;
