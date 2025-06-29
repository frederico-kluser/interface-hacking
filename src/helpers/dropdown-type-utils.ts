import type { DropdownType } from './triggerMonacoDropdown.js';

/**
 * Identifica o tipo do dropdown baseado no aria-label
 * @param {string} ariaLabel - Valor do aria-label do botão
 * @returns {DropdownType} Tipo identificado do dropdown
 */
export const identifyDropdownType = (ariaLabel: string): DropdownType => {
  if (ariaLabel.includes('Set Mode') || ariaLabel.includes('Agent')) {
    return 'agent';
  }
  if (ariaLabel.includes('Pick Model') || ariaLabel.includes('Model')) {
    return 'model';
  }
  return 'any';
};

/**
 * Verifica se o aria-label indica um dropdown do Copilot
 * @param {string} ariaLabel - Valor do aria-label do botão
 * @returns {boolean} True se é um dropdown do Copilot
 */
export const isCopilotDropdown = (ariaLabel: string): boolean => {
  return ariaLabel.includes('Set Mode') || ariaLabel.includes('Pick Model');
};

/**
 * Extrai o label padrão baseado no tipo do dropdown
 * @param {DropdownType} type - Tipo do dropdown
 * @param {string} textContent - Conteúdo de texto do botão
 * @returns {string} Label padrão do dropdown
 */
export const getDefaultDropdownLabel = (type: DropdownType, textContent: string): string => {
  if (type === 'agent') {
    return textContent || 'Agent';
  }
  if (type === 'model') {
    return textContent || 'Model';
  }
  return textContent || 'Unknown';
};
