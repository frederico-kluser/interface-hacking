import waitElementsByHierarchy from '../core/waitElementsByHierarchy.js';
import monacoListElementSelector from '../selectors/monaco-dropdown-row.js';
import { listDropdownItems } from './dropdown-items.js';
import { wait } from './wait.js';

/**
 * Interface para resultado de tentativa de trigger
 */
export interface TriggerResult {
  success: boolean;
  method: string;
}

/**
 * Método 1: Click direto simples
 * @param {HTMLElement} button - Botão do dropdown
 * @returns {Promise<TriggerResult>} Resultado da tentativa
 */
export const tryDirectClick = async (button: HTMLElement): Promise<TriggerResult> => {
  // eslint-disable-next-line no-console
  console.log('🔄 Tentando click direto...');

  button.focus();
  await wait(100);
  button.click();
  await wait(200);

  // eslint-disable-next-line no-debugger
  debugger; // Para depuração, remova em produção

  // Aguarda os elementos monaco-list-row aparecerem e lista todos
  waitElementsByHierarchy(monacoListElementSelector, {
    limitTime: 5000,
    from: document.body,
  })
    .then((elements) => {
      if (elements.length > 0) {
        listDropdownItems();
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Timeout aguardando monaco dropdown list-row aparecer:', error);
    });

  // Verifica se abriu
  const newState = button.getAttribute('aria-expanded');
  const success = newState === 'true';

  if (success) {
    // eslint-disable-next-line no-console
    console.log('✅ Dropdown aberto com sucesso via click direto');
  }

  return { success, method: 'direct-click' };
};

/**
 * Método 2: Eventos de mouse completos
 * @param {HTMLElement} button - Botão do dropdown
 * @returns {Promise<TriggerResult>} Resultado da tentativa
 */
export const tryMouseEvents = async (button: HTMLElement): Promise<TriggerResult> => {
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

  button.dispatchEvent(mouseDownEvent);
  await wait(50);
  button.dispatchEvent(clickEvent);
  await wait(50);
  button.dispatchEvent(mouseUpEvent);
  await wait(200);

  // Verifica novamente
  const newState = button.getAttribute('aria-expanded');
  const success = newState === 'true';

  if (success) {
    // eslint-disable-next-line no-console
    console.log('✅ Dropdown aberto com sucesso via eventos de mouse');

    // Aguarda os elementos monaco-list-row aparecerem e lista todos
    waitElementsByHierarchy(monacoListElementSelector, {
      limitTime: 5000,
      from: document.body,
    })
      .then((elements) => {
        if (elements.length > 0) {
          listDropdownItems();
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('⚠️ Timeout aguardando monaco-list-row aparecer:', error);
      });
  }

  return { success, method: 'mouse-events' };
};

/**
 * Método 3: Keyboard Enter
 * @param {HTMLElement} button - Botão do dropdown
 * @returns {Promise<TriggerResult>} Resultado da tentativa
 */
export const tryKeyboardEnter = async (button: HTMLElement): Promise<TriggerResult> => {
  // eslint-disable-next-line no-console
  console.log('🔄 Tentando com Enter...');

  button.focus();
  await wait(100);

  const enterEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    bubbles: true,
    cancelable: true,
  });

  button.dispatchEvent(enterEvent);
  await wait(200);

  const newState = button.getAttribute('aria-expanded');
  const success = newState === 'true';

  if (success) {
    // eslint-disable-next-line no-console
    console.log('✅ Dropdown aberto com sucesso via Enter');

    // Aguarda os elementos monaco-list-row aparecerem e lista todos
    waitElementsByHierarchy(monacoListElementSelector, {
      limitTime: 5000,
      from: document.body,
    })
      .then((elements) => {
        if (elements.length > 0) {
          listDropdownItems();
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('⚠️ Timeout aguardando monaco-list-row aparecer:', error);
      });
  }

  return { success, method: 'keyboard-enter' };
};

/**
 * Executa múltiplos métodos de trigger sequencialmente até um funcionar
 * @param {HTMLElement} button - Botão do dropdown
 * @returns {Promise<TriggerResult>} Resultado da tentativa bem-sucedida ou da última falha
 */
export const tryAllTriggerMethods = async (button: HTMLElement): Promise<TriggerResult> => {
  const methods = [tryDirectClick, tryMouseEvents, tryKeyboardEnter];

  for (const method of methods) {
    const result = await method(button);
    if (result.success) {
      return result;
    }
  }

  // eslint-disable-next-line no-console
  console.error('❌ Todos os métodos básicos falharam para abrir o dropdown');
  return { success: false, method: 'all-failed' };
};
