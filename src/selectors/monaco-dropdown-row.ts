import type TagWithAttributes from '../types/TagWithAttributes.js';

/**
 * Seletor específico para elementos monaco-list-row dentro de dropdowns do Monaco/Copilot
 * Foca especificamente nos itens de menu de dropdowns (action widgets)
 * Baseado na estrutura: context-view > action-widget > actionList > monaco-list[role="menu"] > monaco-list-rows > monaco-list-row[role="menuitemcheckbox"]
 */
const monacoDropdownRowSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [{ attribute: 'class', value: 'monaco-list-row' }],
  },
];

export default monacoDropdownRowSelector;
