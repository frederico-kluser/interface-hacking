import findElementsByHierarchy from '../core/findElementsByHierarchy.js';
import monacoDropdownButtonSelector from '../selectors/monaco-dropdown-button.js';
import monacoDropdownSelector from '../selectors/monaco-dropdown.js';
import { tryAllCloseMethods } from './dropdown-close-methods.js';
import {
  findOpenDropdown,
  findTargetDropdown,
  isDropdownClosed,
  isDropdownOpen,
  logDropdownNotFound,
} from './dropdown-state.js';
import { tryAllTriggerMethods } from './dropdown-trigger-methods.js';
import {
  getDefaultDropdownLabel,
  identifyDropdownType,
  isCopilotDropdown,
} from './dropdown-type-utils.js';

/**
 * Tipos de dropdown disponíveis no Copilot
 */
export type DropdownType = 'agent' | 'model' | 'any';

/**
 * Interface para o resultado da busca de dropdowns
 */
export interface DropdownElement {
  /** Container do dropdown */
  container: HTMLElement;
  /** Botão clickável do dropdown */
  button: HTMLElement;
  /** Tipo identificado do dropdown */
  type: DropdownType;
  /** Label atual do dropdown */
  label: string;
}

/**
 * Interface para representar um item do dropdown
 */
export interface DropdownItem {
  /** Elemento HTML do item */
  element: HTMLElement;
  /** Título do item */
  title: string;
  /** Descrição do item */
  description: string;
  /** Aria-label do item */
  ariaLabel: string;
  /** Se o item está selecionado */
  isSelected: boolean;
  /** Índice do item no dropdown */
  dataIndex: number;
  /** Role do elemento */
  role: string;
}

/**
 * Encontra todos os dropdowns do Monaco na toolbar
 * @returns {DropdownElement[]} Array com todos os dropdowns encontrados
 */
export const findMonacoDropdowns = (): DropdownElement[] => {
  // eslint-disable-next-line no-console
  console.log('🔍 Buscando dropdowns do Monaco...');

  const foundDropdowns: DropdownElement[] = [];

  // Método 1: Busca específica por dropdowns do Copilot
  try {
    const copilotButtons = Array.from(
      document.querySelectorAll('a[role="button"][aria-haspopup="true"]'),
    );

    for (const button of copilotButtons) {
      const ariaLabel = button.getAttribute('aria-label') || '';
      const textContent = button.textContent?.trim() || '';

      // Filtra apenas dropdowns do Copilot (Agent e Model)
      if (isCopilotDropdown(ariaLabel)) {
        const type = identifyDropdownType(ariaLabel);
        const label = getDefaultDropdownLabel(type, textContent);

        // Encontra o container pai (dropdown)
        const container =
          button.closest('.monaco-dropdown') ||
          button.closest('.dropdown-label')?.parentElement ||
          button.parentElement;

        if (container) {
          foundDropdowns.push({
            container: container as HTMLElement,
            button: button as HTMLElement,
            type,
            label,
          });

          // eslint-disable-next-line no-console
          console.log(
            `✅ Copilot dropdown encontrado - Tipo: ${type}, Label: "${label}", Aria: "${ariaLabel}"`,
          );
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('⚠️ Erro na busca específica por dropdowns Copilot:', error);
  }

  // Método 2: Fallback usando seletores originais se não encontrou nada
  if (foundDropdowns.length === 0) {
    // eslint-disable-next-line no-console
    console.log('🔄 Usando método fallback...');

    const dropdowns = findElementsByHierarchy(monacoDropdownSelector, document.body);

    for (const dropdown of dropdowns) {
      const buttons = findElementsByHierarchy(monacoDropdownButtonSelector, dropdown);
      const button = buttons[0] || null;

      if (button) {
        // Identifica o tipo do dropdown baseado no aria-label
        const ariaLabel = button.getAttribute('aria-label') || '';
        const type = identifyDropdownType(ariaLabel);

        // Extrai o label atual
        const labelElement = button.querySelector('.chat-model-label');
        const textContent = labelElement?.textContent?.trim() || button.textContent?.trim() || '';
        const label = getDefaultDropdownLabel(type, textContent);

        foundDropdowns.push({
          container: dropdown,
          button,
          type,
          label,
        });

        // eslint-disable-next-line no-console
        console.log(`✅ Dropdown encontrado (fallback) - Tipo: ${type}, Label: "${label}"`);
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log(`🔍 Total de dropdowns encontrados: ${foundDropdowns.length}`);
  return foundDropdowns;
};

/**
 * Aciona um dropdown específico do Monaco Editor com múltiplos métodos de fallback
 * @param {DropdownType} type - Tipo do dropdown a ser acionado ('agent', 'model', 'any')
 * @returns {Promise<boolean>} True se o dropdown foi acionado com sucesso
 */
export const triggerMonacoDropdown = async (type: DropdownType = 'any'): Promise<boolean> => {
  // eslint-disable-next-line no-console
  console.log(`🎯 Acionando dropdown do tipo: "${type}"`);

  try {
    const dropdowns = findMonacoDropdowns();

    if (dropdowns.length === 0) {
      // eslint-disable-next-line no-console
      console.error('❌ Nenhum dropdown encontrado na toolbar');
      return false;
    }

    // Encontra o dropdown do tipo especificado
    const targetDropdown = findTargetDropdown(dropdowns, type);

    if (!targetDropdown) {
      logDropdownNotFound(type, dropdowns);
      return false;
    }

    // eslint-disable-next-line no-console
    console.log(`🎯 Acionando dropdown: ${targetDropdown.type} - "${targetDropdown.label}"`);

    // Verificação simples se já está aberto
    if (isDropdownOpen(targetDropdown)) {
      // eslint-disable-next-line no-console
      console.log('⚠️ Dropdown já está aberto');
      return true;
    }

    // Tenta todos os métodos de trigger sequencialmente
    const result = await tryAllTriggerMethods(targetDropdown.button);
    return result.success;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro ao acionar dropdown:', error);
    return false;
  }
};

/**
 * Fecha um dropdown específico se estiver aberto
 * @param {DropdownType} type - Tipo do dropdown a ser fechado ('agent', 'model', 'any')
 * @returns {Promise<boolean>} True se o dropdown foi fechado com sucesso
 */
export const closeMonacoDropdown = async (type: DropdownType = 'any'): Promise<boolean> => {
  // eslint-disable-next-line no-console
  console.log(`🔒 Fechando dropdown do tipo: "${type}"`);

  try {
    const dropdowns = findMonacoDropdowns();

    if (dropdowns.length === 0) {
      // eslint-disable-next-line no-console
      console.log('ℹ️ Nenhum dropdown encontrado');
      return false;
    }

    // Encontra o dropdown do tipo especificado
    let targetDropdown: DropdownElement | undefined;

    if (type === 'any') {
      // Encontra qualquer dropdown que esteja aberto
      targetDropdown = findOpenDropdown(dropdowns);
    } else {
      targetDropdown = findTargetDropdown(dropdowns, type);
    }

    if (!targetDropdown) {
      // eslint-disable-next-line no-console
      console.log(`ℹ️ Dropdown do tipo "${type}" não encontrado ou já fechado`);
      return false;
    }

    // Verifica se realmente está aberto
    if (isDropdownClosed(targetDropdown)) {
      // eslint-disable-next-line no-console
      console.log('ℹ️ Dropdown já está fechado');
      return true;
    }

    // eslint-disable-next-line no-console
    console.log(`🔒 Fechando dropdown: ${targetDropdown.type} - "${targetDropdown.label}"`);

    // Tenta todos os métodos de fechamento sequencialmente
    const result = await tryAllCloseMethods(targetDropdown.button);
    return result.success;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro ao fechar dropdown:', error);
    return false;
  }
};

/**
 * Lista todos os dropdowns disponíveis e suas opções
 * @returns {DropdownElement[]} Array com informações dos dropdowns
 */
export const listMonacoDropdowns = (): DropdownElement[] => {
  // eslint-disable-next-line no-console
  console.log('📋 Listando dropdowns disponíveis...');

  const dropdowns = findMonacoDropdowns();

  if (dropdowns.length === 0) {
    // eslint-disable-next-line no-console
    console.log('ℹ️ Nenhum dropdown encontrado');
    return [];
  }

  // eslint-disable-next-line no-console
  console.log('📋 Dropdowns disponíveis:');
  dropdowns.forEach((dropdown, index) => {
    const status = isDropdownOpen(dropdown) ? '🔽 Aberto' : '▶️ Fechado';
    // eslint-disable-next-line no-console
    console.log(
      `  ${index + 1}. Tipo: ${dropdown.type} | Label: "${dropdown.label}" | Status: ${status}`,
    );
  });

  return dropdowns;
};

export {
  debugFindPossibleDropdowns,
  findDropdownsDirectly,
  testDropdownTrigger,
  type DirectDropdownElement,
} from './dropdown-debug-utils.js';
