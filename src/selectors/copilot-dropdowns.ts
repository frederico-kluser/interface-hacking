/**
 * Seletores específicos para dropdowns do GitHub Copilot
 * Baseado no debug da estrutura DOM atual
 */
import type TagWithAttributes from '../types/TagWithAttributes.js';

/**
 * Seletor para dropdowns do Copilot (Agent e Model)
 * Identifica elementos com aria-haspopup="true" e role="button" que contenham labels específicos
 */
const copilotDropdownsSelector: TagWithAttributes[] = [
  {
    tag: 'a',
    attributes: [
      { attribute: 'role', value: 'button' },
      { attribute: 'aria-haspopup', value: 'true' },
      { attribute: 'aria-label', value: '.*(Set Mode|Pick Model).*', isRegex: true },
    ],
  },
];

export default copilotDropdownsSelector;
