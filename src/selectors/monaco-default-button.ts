/**
 * @fileoverview Seletor para botão Monaco padrão
 * @module selectors/monaco-default-button
 */
import TagWithAttributes from '../types/TagWithAttributes';

/**
 * Seletor para botão Monaco padrão
 * @description Busca botões com classes monaco-button e default
 */
const monacoDefaultButtonSelector: TagWithAttributes[] = [
  {
    tag: 'button',
    attributes: [
      {
        attribute: 'class',
        value: 'monaco-button.*default',
        isRegex: true,
      },
    ],
  },
];

export default monacoDefaultButtonSelector;
