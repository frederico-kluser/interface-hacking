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
 * Captura o HTML das opções quando um dropdown é aberto
 * @param {DropdownType} type - Tipo do dropdown a ser analisado
 * @returns {Promise<boolean>} True se conseguiu capturar as opções
 */
export const captureDropdownOptions = async (type: DropdownType = 'any'): Promise<boolean> => {
  // eslint-disable-next-line no-console
  console.log(`🔍 CAPTURANDO opções do dropdown "${type}"...`);

  try {
    const dropdowns = findMonacoDropdowns();

    if (dropdowns.length === 0) {
      // eslint-disable-next-line no-console
      console.error('❌ Nenhum dropdown encontrado');
      return false;
    }

    let targetDropdown: DropdownElement | undefined;

    if (type === 'any') {
      targetDropdown = dropdowns[0];
    } else {
      targetDropdown = dropdowns.find((d) => d.type === type);
    }

    if (!targetDropdown) {
      // eslint-disable-next-line no-console
      console.error(`❌ Dropdown do tipo "${type}" não encontrado`);
      return false;
    }

    // eslint-disable-next-line no-console
    console.log(`🎯 Capturando opções: ${targetDropdown.type} - "${targetDropdown.label}"`);

    // Captura o estado inicial do DOM (antes de abrir)
    const beforeMenus = Array.from(
      document.querySelectorAll(
        '[class*="menu"], [class*="dropdown"], [class*="option"], [class*="item"]',
      ),
    );

    // eslint-disable-next-line no-console
    console.log(`📊 Estado inicial: ${beforeMenus.length} elementos de menu/opção no DOM`);

    // Abre o dropdown com método mais rápido
    targetDropdown.button.focus();
    targetDropdown.button.click();

    // CAPTURA IMEDIATA (sem wait - máxima velocidade)
    // Espera apenas 50ms para o DOM ser atualizado
    await wait(50);

    // Captura TODOS os menus/dropdowns/opções que apareceram
    const allMenuSelectors = [
      '.monaco-dropdown-menu',
      '.dropdown-menu',
      '[class*="dropdown-menu"]',
      '[class*="menu"]',
      '[class*="option"]',
      '[class*="item"]',
      '[class*="picker"]',
      '[role="menu"]',
      '[role="listbox"]',
      '[role="option"]',
      '.monaco-menu',
      '.context-menu',
      '.monaco-list',
      '.monaco-tree',
    ];

    const afterMenus: HTMLElement[] = [];
    const newMenus: HTMLElement[] = [];

    allMenuSelectors.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (el instanceof HTMLElement) {
            afterMenus.push(el);

            // Verifica se é um elemento novo (não estava na captura inicial)
            if (!beforeMenus.includes(el)) {
              newMenus.push(el);
            }
          }
        });
      } catch {
        // Ignora seletores inválidos
      }
    });

    // eslint-disable-next-line no-console
    console.log(
      `📊 Após abrir: ${afterMenus.length} elementos de menu total, ${newMenus.length} novos`,
    );

    // Loga TODOS os menus visíveis (novos e existentes)
    const visibleMenus = afterMenus.filter((menu) => {
      const isVisible =
        menu.style.display !== 'none' &&
        !menu.hasAttribute('hidden') &&
        menu.offsetParent !== null &&
        menu.getBoundingClientRect().width > 0 &&
        menu.getBoundingClientRect().height > 0;
      return isVisible;
    });

    // eslint-disable-next-line no-console
    console.log(`🔍 Menus VISÍVEIS encontrados: ${visibleMenus.length}`);

    // LOGA TODO O HTML CAPTURADO para análise
    if (visibleMenus.length > 0) {
      // eslint-disable-next-line no-console
      console.log('🎯 ========== HTML DOS MENUS VISÍVEIS ==========');

      visibleMenus.forEach((menu, index) => {
        // eslint-disable-next-line no-console
        console.log(`\n📋 MENU ${index + 1}:`);
        // eslint-disable-next-line no-console
        console.log(`Classes: ${menu.className}`);
        // eslint-disable-next-line no-console
        console.log(`ID: ${menu.id}`);
        // eslint-disable-next-line no-console
        console.log(`Posição: top=${menu.style.top}, left=${menu.style.left}`);
        // eslint-disable-next-line no-console
        console.log(
          `Tamanho: ${menu.getBoundingClientRect().width}x${menu.getBoundingClientRect().height}`,
        );
        // eslint-disable-next-line no-console
        console.log('HTML COMPLETO:');
        // eslint-disable-next-line no-console
        console.log(menu.outerHTML);

        // Busca opções dentro do menu
        const options = menu.querySelectorAll(
          '[role="option"], .option, [class*="option"], [class*="item"], li, .monaco-list-row',
        );
        // eslint-disable-next-line no-console
        console.log(`\n🎯 OPÇÕES DENTRO DESTE MENU (${options.length}):`);

        options.forEach((option, optIndex) => {
          if (option instanceof HTMLElement) {
            // eslint-disable-next-line no-console
            console.log(
              `  ${optIndex + 1}. "${option.textContent?.trim()}" | Classes: ${option.className} | HTML: ${option.outerHTML}`,
            );
          }
        });
      });

      // eslint-disable-next-line no-console
      console.log('\n🎯 ========== FIM DOS MENUS ==========');
    } else {
      // Se não encontrou menus visíveis, loga TODOS os novos elementos
      // eslint-disable-next-line no-console
      console.log('⚠️ Nenhum menu visível encontrado. Logando TODOS os elementos novos:');

      newMenus.forEach((menu, index) => {
        // eslint-disable-next-line no-console
        console.log(`\n📋 ELEMENTO NOVO ${index + 1}:`);
        // eslint-disable-next-line no-console
        console.log(`Classes: ${menu.className}`);
        // eslint-disable-next-line no-console
        console.log(`Visível: ${menu.offsetParent !== null}`);
        // eslint-disable-next-line no-console
        console.log(`HTML: ${menu.outerHTML}`);
      });
    }

    // Também captura mudanças no dropdown button
    const buttonState = targetDropdown.button.getAttribute('aria-expanded');
    // eslint-disable-next-line no-console
    console.log(`\n🔘 Estado do botão após abertura: aria-expanded="${buttonState}"`);
    // eslint-disable-next-line no-console
    console.log(`🔘 HTML do botão: ${targetDropdown.button.outerHTML}`);

    // Espera um pouco mais para ver se algo muda
    await wait(100);

    const finalButtonState = targetDropdown.button.getAttribute('aria-expanded');
    // eslint-disable-next-line no-console
    console.log(`🔘 Estado final do botão: aria-expanded="${finalButtonState}"`);

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro ao capturar opções:', error);
    return false;
  }
};

/**
 * Captura RÁPIDA e específica dos dropdowns do Copilot com múltiplas tentativas
 * @param {DropdownType} type - Tipo do dropdown a ser analisado
 * @returns {Promise<boolean>} True se conseguiu capturar as opções
 */
export const captureDropdownOptionsFast = async (type: DropdownType = 'any'): Promise<boolean> => {
  // eslint-disable-next-line no-console
  console.log(`🚀 CAPTURA RÁPIDA - dropdown "${type}"...`);

  try {
    const dropdowns = findMonacoDropdowns();

    if (dropdowns.length === 0) {
      // eslint-disable-next-line no-console
      console.error('❌ Nenhum dropdown encontrado');
      return false;
    }

    let targetDropdown: DropdownElement | undefined;

    if (type === 'any') {
      targetDropdown = dropdowns[0];
    } else {
      targetDropdown = dropdowns.find((d) => d.type === type);
    }

    if (!targetDropdown) {
      // eslint-disable-next-line no-console
      console.error(`❌ Dropdown do tipo "${type}" não encontrado`);
      return false;
    }

    // eslint-disable-next-line no-console
    console.log(`🎯 Captura rápida: ${targetDropdown.type} - "${targetDropdown.label}"`);

    // Seletores específicos para dropdowns do Copilot/Agent/Model
    const copilotMenuSelectors = [
      '.monaco-menu',
      '.dropdown-menu',
      '.codicon-menu',
      '[role="menu"]',
      '[role="listbox"]',
      '.chat-dropdown-menu',
      '.agent-picker',
      '.model-picker',
      '[aria-label*="Agent"]',
      '[aria-label*="Model"]',
      '[aria-label*="Pick"]',
      '.monaco-dropdown-menu',
      '.context-menu',
    ];

    // Função para capturar estado atual
    const captureMenuState = (label: string): HTMLElement[] => {
      const menus: HTMLElement[] = [];

      copilotMenuSelectors.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const isVisible =
                el.style.display !== 'none' &&
                !el.hasAttribute('hidden') &&
                el.offsetParent !== null &&
                el.getBoundingClientRect().width > 0 &&
                el.getBoundingClientRect().height > 0;

              if (isVisible) {
                menus.push(el);
              }
            }
          });
        } catch {
          // Ignora seletores inválidos
        }
      });

      // eslint-disable-next-line no-console
      console.log(`📊 ${label}: ${menus.length} menus visíveis`);

      return menus;
    };

    // CAPTURA 1: Estado inicial
    const menusBefore = captureMenuState('ANTES');

    // Preparação: foco e posicionamento
    targetDropdown.button.focus();
    targetDropdown.button.scrollIntoView({ behavior: 'instant', block: 'center' });

    // CLIQUE RÁPIDO E MÚLTIPLAS CAPTURAS
    // eslint-disable-next-line no-console
    console.log('⚡ Executando clique e capturas sequenciais...');

    // Click
    targetDropdown.button.click();

    // CAPTURA 2: Imediatamente após click (0ms)
    const menus0ms = captureMenuState('0ms após click');

    // CAPTURA 3: 25ms após click
    setTimeout(() => {
      const menus25ms = captureMenuState('25ms após click');
      logMenuDetails(menus25ms, '25ms');
    }, 25);

    // CAPTURA 4: 50ms após click
    setTimeout(() => {
      const menus50ms = captureMenuState('50ms após click');
      logMenuDetails(menus50ms, '50ms');
    }, 50);

    // CAPTURA 5: 100ms após click
    setTimeout(() => {
      const menus100ms = captureMenuState('100ms após click');
      logMenuDetails(menus100ms, '100ms');
    }, 100);

    // CAPTURA 6: 200ms após click
    setTimeout(() => {
      const menus200ms = captureMenuState('200ms após click');
      logMenuDetails(menus200ms, '200ms');

      // Estado final do botão
      const finalState = targetDropdown.button.getAttribute('aria-expanded');
      // eslint-disable-next-line no-console
      console.log(`🔘 Estado final (200ms): aria-expanded="${finalState}"`);
    }, 200);

    // Log inicial
    logMenuDetails(menus0ms, '0ms');
    logMenuDetails(menusBefore, 'INICIAL');

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro na captura rápida:', error);
    return false;
  }
};

/**
 * Helper function para logar detalhes dos menus encontrados
 */
const logMenuDetails = (menus: HTMLElement[], timing: string): void => {
  if (menus.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`📋 ${timing}: Nenhum menu visível`);
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`\n🎯 ===== MENUS ENCONTRADOS (${timing}) =====`);

  menus.forEach((menu, index) => {
    // eslint-disable-next-line no-console
    console.log(`\n📋 MENU ${index + 1} (${timing}):`);
    // eslint-disable-next-line no-console
    console.log(`Classes: ${menu.className}`);
    // eslint-disable-next-line no-console
    console.log(`ID: ${menu.id}`);
    // eslint-disable-next-line no-console
    console.log(`TagName: ${menu.tagName}`);
    // eslint-disable-next-line no-console
    console.log(`aria-label: ${menu.getAttribute('aria-label')}`);
    // eslint-disable-next-line no-console
    console.log(`role: ${menu.getAttribute('role')}`);

    const rect = menu.getBoundingClientRect();
    // eslint-disable-next-line no-console
    console.log(`Posição: ${rect.top}px, ${rect.left}px | Tamanho: ${rect.width}x${rect.height}`);

    // Busca por opções/items dentro do menu
    const options = menu.querySelectorAll(
      '[role="option"], [role="menuitem"], .option, .menu-item, [class*="option"], [class*="item"], [class*="agent"], [class*="model"]',
    );

    // eslint-disable-next-line no-console
    console.log(`🎯 OPÇÕES/ITEMS (${options.length}):`);

    if (options.length > 0) {
      options.forEach((option, optIndex) => {
        if (option instanceof HTMLElement) {
          // eslint-disable-next-line no-console
          console.log(
            `  ${optIndex + 1}. "${option.textContent?.trim()}" | Classes: ${option.className}`,
          );
        }
      });
    } else {
      // Se não encontrou opções, lista todos os elementos filhos
      const children = Array.from(menu.children);
      // eslint-disable-next-line no-console
      console.log(`🔍 ELEMENTOS FILHOS (${children.length}):`);

      children.slice(0, 5).forEach((child, childIndex) => {
        if (child instanceof HTMLElement) {
          // eslint-disable-next-line no-console
          console.log(
            `  ${childIndex + 1}. "${child.textContent?.trim()}" | Tag: ${child.tagName} | Classes: ${child.className}`,
          );
        }
      });
    }

    // HTML compacto (primeiros 200 chars)
    const compactHtml = `${menu.outerHTML.substring(0, 200)}...`;
    // eslint-disable-next-line no-console
    console.log(`HTML (primeiros 200 chars): ${compactHtml}`);
  });

  // eslint-disable-next-line no-console
  console.log(`🎯 ===== FIM MENUS (${timing}) =====\n`);
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

/**
 * Diagnóstico específico para entender por que o dropdown não abre
 * @param {DropdownType} type - Tipo do dropdown a ser diagnosticado
 * @returns {Promise<void>} Logs detalhados para debugging
 */
export const debugDropdownClick = async (type: DropdownType = 'any'): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log(`🔬 DIAGNÓSTICO - Por que o dropdown "${type}" não abre?`);

  try {
    const dropdowns = findMonacoDropdowns();

    if (dropdowns.length === 0) {
      // eslint-disable-next-line no-console
      console.error('❌ Nenhum dropdown encontrado');
      return;
    }

    let targetDropdown: DropdownElement | undefined;

    if (type === 'any') {
      targetDropdown = dropdowns[0];
    } else {
      targetDropdown = dropdowns.find((d) => d.type === type);
    }

    if (!targetDropdown) {
      // eslint-disable-next-line no-console
      console.error(`❌ Dropdown do tipo "${type}" não encontrado`);
      return;
    }

    // eslint-disable-next-line no-console
    console.log(`🎯 Diagnosticando: ${targetDropdown.type} - "${targetDropdown.label}"`);

    const button = targetDropdown.button;

    // 1. ANÁLISE DO ELEMENTO
    // eslint-disable-next-line no-console
    console.log('\n📊 ANÁLISE DO ELEMENTO:');
    // eslint-disable-next-line no-console
    console.log(`  Tag: ${button.tagName}`);
    // eslint-disable-next-line no-console
    console.log(`  Classes: ${button.className}`);
    // eslint-disable-next-line no-console
    console.log(`  ID: ${button.id}`);
    // eslint-disable-next-line no-console
    console.log(`  Role: ${button.getAttribute('role')}`);
    // eslint-disable-next-line no-console
    console.log(`  Tabindex: ${button.getAttribute('tabindex')}`);
    // eslint-disable-next-line no-console
    console.log(`  Disabled: ${button.hasAttribute('disabled')}`);
    // eslint-disable-next-line no-console
    console.log(`  Hidden: ${button.hasAttribute('hidden')}`);

    // 2. ANÁLISE DE VISIBILIDADE
    // eslint-disable-next-line no-console
    console.log('\n👁️ ANÁLISE DE VISIBILIDADE:');
    const rect = button.getBoundingClientRect();
    // eslint-disable-next-line no-console
    console.log(`  Posição: x=${rect.x}, y=${rect.y}`);
    // eslint-disable-next-line no-console
    console.log(`  Tamanho: ${rect.width}x${rect.height}`);
    // eslint-disable-next-line no-console
    console.log(`  Visível (offsetParent): ${button.offsetParent !== null}`);
    // eslint-disable-next-line no-console
    console.log(`  Display: ${window.getComputedStyle(button).display}`);
    // eslint-disable-next-line no-console
    console.log(`  Visibility: ${window.getComputedStyle(button).visibility}`);
    // eslint-disable-next-line no-console
    console.log(`  Z-index: ${window.getComputedStyle(button).zIndex}`);

    // 3. ANÁLISE DE EVENTOS
    // eslint-disable-next-line no-console
    console.log('\n⚡ ANÁLISE DE EVENTOS:');

    // Adiciona listener para detectar eventos
    const eventTypes = ['click', 'mousedown', 'mouseup', 'focus', 'keydown'];
    const listeners: { type: string; handler: EventListener }[] = [];

    eventTypes.forEach((eventType) => {
      const handler = (event: Event): void => {
        // eslint-disable-next-line no-console
        console.log(`  🎯 Evento capturado: ${eventType}`, event);
      };
      button.addEventListener(eventType, handler);
      listeners.push({ type: eventType, handler });
    });

    // 4. TESTE DE CLIQUE COM MONITORAMENTO
    // eslint-disable-next-line no-console
    console.log('\n🔬 TESTE DE CLIQUE COM MONITORAMENTO:');

    // Estado inicial
    const initialState = button.getAttribute('aria-expanded');
    // eslint-disable-next-line no-console
    console.log(`  Estado inicial: aria-expanded="${initialState}"`);

    // Focus primeiro
    // eslint-disable-next-line no-console
    console.log('  🎯 Aplicando focus...');
    button.focus();
    await wait(100);

    // eslint-disable-next-line no-console
    console.log(
      `  Focus aplicado: document.activeElement === button: ${document.activeElement === button}`,
    );

    // Click
    // eslint-disable-next-line no-console
    console.log('  🖱️ Executando click...');
    button.click();
    await wait(200);

    const afterClickState = button.getAttribute('aria-expanded');
    // eslint-disable-next-line no-console
    console.log(`  Estado após click: aria-expanded="${afterClickState}"`);

    // 5. TESTE COM COORDENADAS EXATAS
    // eslint-disable-next-line no-console
    console.log('\n📍 TESTE COM COORDENADAS EXATAS:');

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // eslint-disable-next-line no-console
    console.log(`  Centro do botão: (${centerX}, ${centerY})`);

    // Elemento no ponto exato
    const elementAtPoint = document.elementFromPoint(centerX, centerY);
    // eslint-disable-next-line no-console
    console.log(`  Elemento no centro: ${elementAtPoint?.tagName}.${elementAtPoint?.className}`);
    // eslint-disable-next-line no-console
    console.log(`  É o mesmo elemento: ${elementAtPoint === button}`);

    // Click com coordenadas
    const coordClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: centerX,
      clientY: centerY,
    });

    // eslint-disable-next-line no-console
    console.log('  🖱️ Click com coordenadas...');
    button.dispatchEvent(coordClick);
    await wait(200);

    const afterCoordClickState = button.getAttribute('aria-expanded');
    // eslint-disable-next-line no-console
    console.log(`  Estado após click coordenado: aria-expanded="${afterCoordClickState}"`);

    // 6. ANÁLISE DO CONTAINER PAI
    // eslint-disable-next-line no-console
    console.log('\n👨‍👩‍👧‍👦 ANÁLISE DO CONTAINER PAI:');
    const container = targetDropdown.container;
    // eslint-disable-next-line no-console
    console.log(`  Container tag: ${container.tagName}`);
    // eslint-disable-next-line no-console
    console.log(`  Container classes: ${container.className}`);

    // Teste de click no container
    // eslint-disable-next-line no-console
    console.log('  🖱️ Testando click no container...');
    container.click();
    await wait(200);

    const afterContainerClickState = button.getAttribute('aria-expanded');
    // eslint-disable-next-line no-console
    console.log(`  Estado após click no container: aria-expanded="${afterContainerClickState}"`);

    // 7. BUSCA POR ELEMENTOS BLOQUEADORES
    // eslint-disable-next-line no-console
    console.log('\n🚫 BUSCA POR ELEMENTOS BLOQUEADORES:');

    // Elementos que podem estar sobrepondo
    const overlayElements = document.querySelectorAll(
      '[style*="position: fixed"], [style*="position: absolute"], .overlay, .modal, .popup',
    );
    // eslint-disable-next-line no-console
    console.log(`  Elementos sobrepostos encontrados: ${overlayElements.length}`);

    overlayElements.forEach((overlay, index) => {
      if (overlay instanceof HTMLElement) {
        const overlayRect = overlay.getBoundingClientRect();
        const isOverButton =
          overlayRect.left <= centerX &&
          centerX <= overlayRect.right &&
          overlayRect.top <= centerY &&
          centerY <= overlayRect.bottom;

        if (isOverButton) {
          // eslint-disable-next-line no-console
          console.log(`  ⚠️ Elemento ${index + 1} pode estar bloqueando: ${overlay.className}`);
        }
      }
    });

    // Cleanup: remove event listeners
    listeners.forEach(({ type, handler }) => {
      button.removeEventListener(type, handler);
    });

    // eslint-disable-next-line no-console
    console.log('\n🎯 ========== FIM DO DIAGNÓSTICO ==========');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro no diagnóstico:', error);
  }
};

/**
 * Métodos avançados para contornar proteção contra eventos sintéticos
 * @param {DropdownType} type - Tipo do dropdown a ser acionado
 * @returns {Promise<boolean>} True se conseguiu abrir o dropdown
 */
export const triggerDropdownWithTrustedEvents = async (
  type: DropdownType = 'any',
): Promise<boolean> => {
  // eslint-disable-next-line no-console
  console.log(`🔓 Tentando métodos com eventos trusted para "${type}"...`);

  try {
    const dropdowns = findMonacoDropdowns();

    if (dropdowns.length === 0) {
      // eslint-disable-next-line no-console
      console.error('❌ Nenhum dropdown encontrado');
      return false;
    }

    let targetDropdown: DropdownElement | undefined;

    if (type === 'any') {
      targetDropdown = dropdowns[0];
    } else {
      targetDropdown = dropdowns.find((d) => d.type === type);
    }

    if (!targetDropdown) {
      // eslint-disable-next-line no-console
      console.error(`❌ Dropdown do tipo "${type}" não encontrado`);
      return false;
    }

    // eslint-disable-next-line no-console
    console.log(`🎯 Testando métodos trusted: ${targetDropdown.type} - "${targetDropdown.label}"`);

    // MÉTODO 1: Click no SPAN interno (baseado no diagnóstico)
    // eslint-disable-next-line no-console
    console.log('🔄 Método 1: Click no chat-model-label...');

    const chatModelLabel = targetDropdown.button.querySelector('.chat-model-label') as HTMLElement;
    if (chatModelLabel) {
      chatModelLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(100);

      chatModelLabel.focus();
      await wait(50);

      chatModelLabel.click();
      await wait(150);

      const isExpanded1 = targetDropdown.button.getAttribute('aria-expanded') === 'true';
      if (isExpanded1) {
        // eslint-disable-next-line no-console
        console.log('✅ Método 1 funcionou! Dropdown aberto via chat-model-label.');
        return true;
      }
    }

    // MÉTODO 2: Keyboard Enter
    // eslint-disable-next-line no-console
    console.log('🔄 Método 2: Keyboard Enter...');

    targetDropdown.button.focus();
    await wait(50);

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    });
    targetDropdown.button.dispatchEvent(enterEvent);
    await wait(150);

    const isExpanded2 = targetDropdown.button.getAttribute('aria-expanded') === 'true';
    if (isExpanded2) {
      // eslint-disable-next-line no-console
      console.log('✅ Método 2 funcionou! Dropdown aberto via Enter.');
      return true;
    }

    // MÉTODO 3: Space key
    // eslint-disable-next-line no-console
    console.log('🔄 Método 3: Space key...');

    const spaceEvent = new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      which: 32,
      bubbles: true,
      cancelable: true,
    });
    targetDropdown.button.dispatchEvent(spaceEvent);
    await wait(150);

    const isExpanded3 = targetDropdown.button.getAttribute('aria-expanded') === 'true';
    if (isExpanded3) {
      // eslint-disable-next-line no-console
      console.log('✅ Método 3 funcionou! Dropdown aberto via Space.');
      return true;
    }

    // MÉTODO 4: Atalho Cmd+. (específico para Agent)
    if (type === 'agent') {
      // eslint-disable-next-line no-console
      console.log('🔄 Método 4: Atalho Cmd+. para Agent...');

      const cmdPeriodEvent = new KeyboardEvent('keydown', {
        key: '.',
        code: 'Period',
        keyCode: 190,
        which: 190,
        metaKey: true, // Cmd no Mac
        bubbles: true,
        cancelable: true,
      });

      document.dispatchEvent(cmdPeriodEvent);
      await wait(200);

      const isExpanded4 = targetDropdown.button.getAttribute('aria-expanded') === 'true';
      if (isExpanded4) {
        // eslint-disable-next-line no-console
        console.log('✅ Método 4 funcionou! Dropdown aberto via Cmd+.');
        return true;
      }
    }

    // MÉTODO 5: MouseDown + MouseUp sequence
    // eslint-disable-next-line no-console
    console.log('🔄 Método 5: MouseDown + MouseUp sequence...');

    const rect = targetDropdown.button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: centerX,
      clientY: centerY,
      button: 0,
    });

    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      clientX: centerX,
      clientY: centerY,
      button: 0,
    });

    targetDropdown.button.dispatchEvent(mouseDownEvent);
    await wait(50);
    targetDropdown.button.dispatchEvent(mouseUpEvent);
    await wait(150);

    const isExpanded5 = targetDropdown.button.getAttribute('aria-expanded') === 'true';
    if (isExpanded5) {
      // eslint-disable-next-line no-console
      console.log('✅ Método 5 funcionou! Dropdown aberto via MouseDown+MouseUp.');
      return true;
    }

    // eslint-disable-next-line no-console
    console.error('❌ Todos os métodos trusted falharam.');
    return false;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro nos métodos trusted:', error);
    return false;
  }
};
