import { findMonacoDropdowns } from './triggerMonacoDropdown.js';
import { wait } from './wait.js';

/**
 * Selectors para busca de dropdowns
 */
const DROPDOWN_CLASSES = [
  '.monaco-dropdown',
  '.dropdown',
  '[class*="dropdown"]',
  '[class*="picker"]',
  '[class*="modelPicker"]',
  '[class*="model-picker"]',
  '[aria-haspopup="true"]',
  '[role="button"][aria-haspopup]',
] as const;

/**
 * Selectors diretos para busca de dropdowns
 */
const DROPDOWN_SELECTORS = [
  '.monaco-dropdown .dropdown-label .action-label',
  '[aria-haspopup="true"][role="button"]',
  '.chat-model-label',
  '[class*="modelPicker"] .action-label',
  '.monaco-toolbar [aria-haspopup="true"]',
] as const;

/**
 * Interface para elementos encontrados na busca direta
 */
export interface DirectDropdownElement {
  container: HTMLElement;
  button: HTMLElement;
  ariaLabel: string;
  textContent: string;
  classes: string;
}

/**
 * Logs informações detalhadas de um elemento
 * @param {HTMLElement} element - Elemento para analisar
 * @param {string} selector - Seletor usado para encontrar o elemento
 * @returns {void}
 */
const logElementInfo = (element: HTMLElement, selector: string): void => {
  // eslint-disable-next-line no-console
  console.log(`📋 Encontrado: ${selector}`, element);
  // eslint-disable-next-line no-console
  console.log(`   Classes: ${element.className}`);
  // eslint-disable-next-line no-console
  console.log(`   Texto: ${element.textContent?.trim()}`);
  // eslint-disable-next-line no-console
  console.log(`   Aria-label: ${element.getAttribute('aria-label')}`);
  // eslint-disable-next-line no-console
  console.log(`   Pai: ${element.parentElement?.className}`);
};

/**
 * Logs informações de menu para debug
 * @param {Element} menu - Elemento do menu
 * @param {number} index - Índice do menu
 * @returns {void}
 */
const logMenuInfo = (menu: Element, index: number): void => {
  const htmlMenu = menu as HTMLElement;
  const isVisible =
    htmlMenu.style.display !== 'none' &&
    !htmlMenu.hasAttribute('hidden') &&
    htmlMenu.offsetParent !== null;
  // eslint-disable-next-line no-console
  console.log(`    Menu ${index + 1}: ${htmlMenu.className} - Visível: ${isVisible}`);
};

/**
 * Debug: Encontra qualquer dropdown na página para análise
 * @returns {HTMLElement[]} Array com elementos que podem ser dropdowns
 */
export const debugFindPossibleDropdowns = (): HTMLElement[] => {
  // eslint-disable-next-line no-console
  console.log('🔍 DEBUG: Procurando possíveis dropdowns na página...');

  const possibleDropdowns: HTMLElement[] = [];

  DROPDOWN_CLASSES.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        if (el instanceof HTMLElement && !possibleDropdowns.includes(el)) {
          possibleDropdowns.push(el);
          logElementInfo(el, selector);
        }
      });
    } catch {
      // Ignora seletores inválidos
    }
  });

  // eslint-disable-next-line no-console
  console.log(`🔍 Total de possíveis dropdowns encontrados: ${possibleDropdowns.length}`);
  return possibleDropdowns;
};

/**
 * Encontra dropdowns usando busca direta por seletores CSS
 * @returns {DirectDropdownElement[]} Array com dropdowns encontrados
 */
export const findDropdownsDirectly = (): DirectDropdownElement[] => {
  // eslint-disable-next-line no-console
  console.log('🔍 Busca direta por dropdowns...');

  const foundDropdowns: DirectDropdownElement[] = [];

  DROPDOWN_SELECTORS.forEach((selector) => {
    try {
      const buttons = document.querySelectorAll(selector);
      // eslint-disable-next-line no-console
      console.log(`🔍 Seletor "${selector}": ${buttons.length} elementos`);

      buttons.forEach((button) => {
        if (button instanceof HTMLElement) {
          const ariaLabel = button.getAttribute('aria-label') || '';
          const textContent = button.textContent?.trim() || '';

          // eslint-disable-next-line no-console
          console.log(`   📋 Botão: "${textContent}" (${ariaLabel})`);

          // Tenta identificar o container do dropdown
          const container =
            button.closest('.monaco-dropdown') ||
            button.closest('[class*="dropdown"]') ||
            button.closest('li') ||
            button.parentElement;

          if (container instanceof HTMLElement) {
            foundDropdowns.push({
              container,
              button,
              ariaLabel,
              textContent,
              classes: button.className,
            });
          }
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`❌ Erro no seletor ${selector}:`, error);
    }
  });

  return foundDropdowns;
};

/**
 * Debug específico para testar os dropdowns encontrados
 * @returns {Promise<void>}
 */
export const testDropdownTrigger = async (): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log('🧪 TESTE: Executando debug específico de trigger...');

  try {
    const dropdowns = findMonacoDropdowns();

    // eslint-disable-next-line no-console
    console.log(`📊 Total de dropdowns encontrados: ${dropdowns.length}`);

    for (let i = 0; i < dropdowns.length; i += 1) {
      const dropdown = dropdowns[i];
      if (!dropdown) {
        // eslint-disable-next-line no-console
        console.log(`\n⚠️ Dropdown ${i + 1} é undefined, pulando...`);
        continue;
      }

      // eslint-disable-next-line no-console
      console.log(`\n🔍 Testando dropdown ${i + 1}:`);
      // eslint-disable-next-line no-console
      console.log(`  Tipo: ${dropdown.type}`);
      // eslint-disable-next-line no-console
      console.log(`  Label: "${dropdown.label}"`);
      // eslint-disable-next-line no-console
      console.log(`  Button aria-label: "${dropdown.button.getAttribute('aria-label')}"`);
      // eslint-disable-next-line no-console
      console.log(`  Button tag: ${dropdown.button.tagName}`);
      // eslint-disable-next-line no-console
      console.log(`  Button classes: ${dropdown.button.className}`);
      // eslint-disable-next-line no-console
      console.log(`  Container classes: ${dropdown.container.className}`);
      // eslint-disable-next-line no-console
      console.log(`  Aria-expanded atual: ${dropdown.button.getAttribute('aria-expanded')}`);

      // Teste de click direto
      // eslint-disable-next-line no-console
      console.log(`  🔬 Testando click direto...`);
      dropdown.button.click();

      await wait(500); // Tempo maior para debug

      const newState = dropdown.button.getAttribute('aria-expanded');
      // eslint-disable-next-line no-console
      console.log(`  📊 Estado após click: ${newState}`);

      // Verifica se há menu visível
      const menus = document.querySelectorAll(
        '.monaco-dropdown-menu, .dropdown-menu, [class*="dropdown-menu"]',
      );
      // eslint-disable-next-line no-console
      console.log(`  📋 Menus encontrados no DOM: ${menus.length}`);

      menus.forEach(logMenuInfo);
    }

    // eslint-disable-next-line no-console
    console.log('🧪 Teste completo!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro no teste:', error);
  }
};
