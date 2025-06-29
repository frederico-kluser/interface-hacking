import type { DropdownElement, DropdownType } from './triggerMonacoDropdown.js';

/**
 * Verifica se um dropdown está aberto
 * @param {DropdownElement} dropdown - Elemento do dropdown
 * @returns {boolean} True se o dropdown está aberto
 */
export const isDropdownOpen = (dropdown: DropdownElement): boolean => {
  return dropdown.button.getAttribute('aria-expanded') === 'true';
};

/**
 * Verifica se um dropdown está fechado
 * @param {DropdownElement} dropdown - Elemento do dropdown
 * @returns {boolean} True se o dropdown está fechado
 */
export const isDropdownClosed = (dropdown: DropdownElement): boolean => {
  const expanded = dropdown.button.getAttribute('aria-expanded');
  return expanded === 'false' || expanded === null;
};

/**
 * Encontra o dropdown target baseado no tipo especificado
 * @param {DropdownElement[]} dropdowns - Array de dropdowns disponíveis
 * @param {DropdownType} type - Tipo do dropdown desejado
 * @returns {DropdownElement | undefined} Dropdown encontrado ou undefined
 */
export const findTargetDropdown = (
  dropdowns: DropdownElement[],
  type: DropdownType,
): DropdownElement | undefined => {
  if (type === 'any') {
    return dropdowns[0]; // Pega o primeiro disponível
  }
  return dropdowns.find((d) => d.type === type);
};

/**
 * Encontra qualquer dropdown que esteja aberto
 * @param {DropdownElement[]} dropdowns - Array de dropdowns disponíveis
 * @returns {DropdownElement | undefined} Dropdown aberto encontrado ou undefined
 */
export const findOpenDropdown = (dropdowns: DropdownElement[]): DropdownElement | undefined => {
  return dropdowns.find((d) => isDropdownOpen(d));
};

/**
 * Logs de erro quando dropdown não é encontrado
 * @param {DropdownType} type - Tipo do dropdown procurado
 * @param {DropdownElement[]} availableDropdowns - Dropdowns disponíveis
 * @returns {void}
 */
export const logDropdownNotFound = (
  type: DropdownType,
  availableDropdowns: DropdownElement[],
): void => {
  // eslint-disable-next-line no-console
  console.error(`❌ Dropdown do tipo "${type}" não encontrado`);
  // eslint-disable-next-line no-console
  console.log(
    'Dropdowns disponíveis:',
    availableDropdowns.map((d) => `${d.type} (${d.label})`),
  );
};
