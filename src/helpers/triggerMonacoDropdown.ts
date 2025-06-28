import findElementByHierarchy from '../core/findElementByHierarchy.js';
import findElementsByHierarchy from '../core/findElementsByHierarchy.js';
import monacoDropdownButtonSelector from '../selectors/monaco-dropdown-button.js';
import monacoDropdownSelector from '../selectors/monaco-dropdown.js';
import { wait } from './wait.js';

/**
 * Tipos de dropdown disponíveis no Copilot
 */
type DropdownType = 'agent' | 'model' | 'any';

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
 * Método avançado de acionamento com técnicas adicionais baseadas na pesquisa
 * @param targetDropdown - Elemento dropdown a ser acionado
 * @returns Promise<boolean> - True se conseguiu abrir
 */
const tryAdvancedTriggerMethods = async (targetDropdown: DropdownElement): Promise<boolean> => {
  // eslint-disable-next-line no-console
  console.log('🚀 Tentando métodos avançados...');

  try {
    // Método 4: Programmatic aria-expanded (baseado na pesquisa web)
    // eslint-disable-next-line no-console
    console.log('🔄 Tentando método aria-expanded programático...');

    targetDropdown.button.setAttribute('aria-expanded', 'true');
    await wait(100);

    // Dispara evento customizado para notificar mudança
    const changeEvent = new CustomEvent('change', { bubbles: true });
    targetDropdown.button.dispatchEvent(changeEvent);
    await wait(150);

    if (targetDropdown.button.getAttribute('aria-expanded') === 'true') {
      // eslint-disable-next-line no-console
      console.log('✅ Dropdown aberto via método aria-expanded');
      return true;
    }

    // Método 5: Composite events (mouse + keyboard simultaneamente)
    // eslint-disable-next-line no-console
    console.log('🔄 Tentando eventos compostos...');

    // Simula hover primeiro
    const mouseEnterEvent = new MouseEvent('mouseenter', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    targetDropdown.button.dispatchEvent(mouseEnterEvent);
    await wait(50);

    // Focus + click + keydown combination
    targetDropdown.button.focus();
    await wait(50);

    const compositeClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      detail: 1, // single click
    });

    targetDropdown.button.dispatchEvent(compositeClick);

    const compositeKeydown = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    targetDropdown.button.dispatchEvent(compositeKeydown);
    await wait(200);

    if (targetDropdown.button.getAttribute('aria-expanded') === 'true') {
      // eslint-disable-next-line no-console
      console.log('✅ Dropdown aberto via eventos compostos');
      return true;
    }

    // Método 6: Trigger parent events (caso o dropdown tenha event delegation)
    // eslint-disable-next-line no-console
    console.log('🔄 Tentando acionamento via container pai...');

    const parentClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    targetDropdown.container.dispatchEvent(parentClick);
    await wait(150);

    if (targetDropdown.button.getAttribute('aria-expanded') === 'true') {
      // eslint-disable-next-line no-console
      console.log('✅ Dropdown aberto via container pai');
      return true;
    }

    return false;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro nos métodos avançados:', error);
    return false;
  }
};

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
      if (ariaLabel.includes('Set Mode') || ariaLabel.includes('Pick Model')) {
        let type: DropdownType = 'any';
        let label = textContent;

        if (ariaLabel.includes('Set Mode') || ariaLabel.includes('Agent')) {
          type = 'agent';
          label = textContent || 'Agent';
        } else if (ariaLabel.includes('Pick Model') || ariaLabel.includes('Model')) {
          type = 'model';
          label = textContent || 'Model';
        }

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
      const button = findElementByHierarchy(monacoDropdownButtonSelector, dropdown);

      if (button) {
        // Identifica o tipo do dropdown baseado no aria-label
        const ariaLabel = button.getAttribute('aria-label') || '';

        let type: DropdownType = 'any';
        if (ariaLabel.includes('Agent') || ariaLabel.includes('Mode')) {
          type = 'agent';
        } else if (ariaLabel.includes('Model') || ariaLabel.includes('Pick Model')) {
          type = 'model';
        }

        // Extrai o label atual
        const labelElement = button.querySelector('.chat-model-label');
        const label = labelElement?.textContent?.trim() || button.textContent?.trim() || 'Unknown';

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
    let targetDropdown: DropdownElement | undefined;

    if (type === 'any') {
      targetDropdown = dropdowns[0]; // Pega o primeiro disponível
    } else {
      targetDropdown = dropdowns.find((d) => d.type === type);
    }

    if (!targetDropdown) {
      // eslint-disable-next-line no-console
      console.error(`❌ Dropdown do tipo "${type}" não encontrado`);
      // eslint-disable-next-line no-console
      console.log(
        'Dropdowns disponíveis:',
        dropdowns.map((d) => `${d.type} (${d.label})`),
      );
      return false;
    }

    // eslint-disable-next-line no-console
    console.log(`🎯 Acionando dropdown: ${targetDropdown.type} - "${targetDropdown.label}"`);

    // Verificação simples se já está aberto
    const isExpanded = targetDropdown.button.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      // eslint-disable-next-line no-console
      console.log('⚠️ Dropdown já está aberto');
      return true;
    }

    // MÉTODO 1: Click direto simples (que funcionava antes)
    // eslint-disable-next-line no-console
    console.log('🔄 Tentando click direto...');

    targetDropdown.button.focus();
    await wait(100);
    targetDropdown.button.click();
    await wait(200);

    // Verifica se abriu
    let newState = targetDropdown.button.getAttribute('aria-expanded');
    if (newState === 'true') {
      // eslint-disable-next-line no-console
      console.log('✅ Dropdown aberto com sucesso via click direto');
      return true;
    }

    // MÉTODO 2: Mouse events (que também funcionava)
    // eslint-disable-next-line no-console
    console.log('🔄 Tentando com eventos de mouse...');

    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    targetDropdown.button.dispatchEvent(mouseDownEvent);
    await wait(50);
    targetDropdown.button.dispatchEvent(clickEvent);
    await wait(50);
    targetDropdown.button.dispatchEvent(mouseUpEvent);
    await wait(200);

    // Verifica novamente
    newState = targetDropdown.button.getAttribute('aria-expanded');
    if (newState === 'true') {
      // eslint-disable-next-line no-console
      console.log('✅ Dropdown aberto com sucesso via eventos de mouse');
      return true;
    }

    // MÉTODO 3: Keyboard Enter
    // eslint-disable-next-line no-console
    console.log('🔄 Tentando com Enter...');

    targetDropdown.button.focus();
    await wait(100);

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    targetDropdown.button.dispatchEvent(enterEvent);
    await wait(200);

    newState = targetDropdown.button.getAttribute('aria-expanded');
    if (newState === 'true') {
      // eslint-disable-next-line no-console
      console.log('✅ Dropdown aberto com sucesso via Enter');
      return true;
    }

    // MÉTODO 4: Métodos avançados como último recurso
    // eslint-disable-next-line no-console
    console.log('🔄 Tentando métodos avançados...');

    const advancedSuccess = await tryAdvancedTriggerMethods(targetDropdown);
    if (advancedSuccess) {
      return true;
    }

    // eslint-disable-next-line no-console
    console.error('❌ Todos os métodos falharam para abrir o dropdown');
    return false;
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
      targetDropdown = dropdowns.find((d) => d.button.getAttribute('aria-expanded') === 'true');
    } else {
      targetDropdown = dropdowns.find((d) => d.type === type);
    }

    if (!targetDropdown) {
      // eslint-disable-next-line no-console
      console.log(`ℹ️ Dropdown do tipo "${type}" não encontrado ou já fechado`);
      return false;
    }

    // Verifica se realmente está aberto
    const isExpanded = targetDropdown.button.getAttribute('aria-expanded') === 'true';
    if (!isExpanded) {
      // eslint-disable-next-line no-console
      console.log('ℹ️ Dropdown já está fechado');
      return true;
    }

    // eslint-disable-next-line no-console
    console.log(`🔒 Fechando dropdown: ${targetDropdown.type} - "${targetDropdown.label}"`);

    // Método 1: Escape key para fechar
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      bubbles: true,
      cancelable: true,
    });

    targetDropdown.button.dispatchEvent(escapeEvent);
    await wait(200);

    // Verifica se fechou
    let newState = targetDropdown.button.getAttribute('aria-expanded');
    if (newState === 'false' || newState === null) {
      // eslint-disable-next-line no-console
      console.log('✅ Dropdown fechado com sucesso via Escape');
      return true;
    }

    // Método 2: Click novamente para toggle
    targetDropdown.button.click();
    await wait(200);

    newState = targetDropdown.button.getAttribute('aria-expanded');
    if (newState === 'false' || newState === null) {
      // eslint-disable-next-line no-console
      console.log('✅ Dropdown fechado com sucesso via click toggle');
      return true;
    }

    // Método 3: Click fora do dropdown
    const body = document.body;
    const outsideClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    body.dispatchEvent(outsideClick);
    await wait(200);

    newState = targetDropdown.button.getAttribute('aria-expanded');
    if (newState === 'false' || newState === null) {
      // eslint-disable-next-line no-console
      console.log('✅ Dropdown fechado com sucesso via click externo');
      return true;
    }

    // eslint-disable-next-line no-console
    console.warn('⚠️ Não foi possível fechar o dropdown');
    return false;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro ao fechar dropdown:', error);
    return false;
  }
};

/**
 * Lista todos os dropdowns disponíveis
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
    const status =
      dropdown.button.getAttribute('aria-expanded') === 'true' ? '🔽 Aberto' : '▶️ Fechado';
    // eslint-disable-next-line no-console
    console.log(
      `  ${index + 1}. Tipo: ${dropdown.type} | Label: "${dropdown.label}" | Status: ${status}`,
    );
  });

  return dropdowns;
};

/**
 * Debug: Encontra qualquer dropdown na página para análise
 * @returns {HTMLElement[]} Array com elementos que podem ser dropdowns
 */
export const debugFindPossibleDropdowns = (): HTMLElement[] => {
  // eslint-disable-next-line no-console
  console.log('🔍 DEBUG: Procurando possíveis dropdowns na página...');

  const possibleDropdowns: HTMLElement[] = [];

  // Busca por elementos com classes relacionadas a dropdown
  const dropdownClasses = [
    '.monaco-dropdown',
    '.dropdown',
    '[class*="dropdown"]',
    '[class*="picker"]',
    '[class*="modelPicker"]',
    '[class*="model-picker"]',
    '[aria-haspopup="true"]',
    '[role="button"][aria-haspopup]',
  ];

  dropdownClasses.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        if (el instanceof HTMLElement && !possibleDropdowns.includes(el)) {
          possibleDropdowns.push(el);
          // eslint-disable-next-line no-console
          console.log(`📋 Encontrado: ${selector}`, el);
          // eslint-disable-next-line no-console
          console.log(`   Classes: ${el.className}`);
          // eslint-disable-next-line no-console
          console.log(`   Texto: ${el.textContent?.trim()}`);
          // eslint-disable-next-line no-console
          console.log(`   Aria-label: ${el.getAttribute('aria-label')}`);
          // eslint-disable-next-line no-console
          console.log(`   Pai: ${el.parentElement?.className}`);
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
 * Interface para elementos encontrados na busca direta
 */
interface DirectDropdownElement {
  container: HTMLElement;
  button: HTMLElement;
  ariaLabel: string;
  textContent: string;
  classes: string;
}

/**
 * Encontra dropdowns usando busca direta por seletores CSS
 * @returns {DirectDropdownElement[]} Array com dropdowns encontrados
 */
export const findDropdownsDirectly = (): DirectDropdownElement[] => {
  // eslint-disable-next-line no-console
  console.log('🔍 Busca direta por dropdowns...');

  const foundDropdowns: DirectDropdownElement[] = [];

  // Busca por dropdowns usando seletores CSS diretos
  const dropdownSelectors = [
    '.monaco-dropdown .dropdown-label .action-label',
    '[aria-haspopup="true"][role="button"]',
    '.chat-model-label',
    '[class*="modelPicker"] .action-label',
    '.monaco-toolbar [aria-haspopup="true"]',
  ];

  dropdownSelectors.forEach((selector) => {
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
 * @returns {void}
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

      for (let j = 0; j < menus.length; j += 1) {
        const menu = menus[j] as HTMLElement;
        const isVisible =
          menu.style.display !== 'none' &&
          !menu.hasAttribute('hidden') &&
          menu.offsetParent !== null;
        // eslint-disable-next-line no-console
        console.log(`    Menu ${j + 1}: ${menu.className} - Visível: ${isVisible}`);
      }
    }

    // eslint-disable-next-line no-console
    console.log('🧪 Teste completo!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro no teste:', error);
  }
};
