import { wait } from './wait.js';

/**
 * Interface para métodos de fechamento de dropdown
 */
export interface CloseResult {
  success: boolean;
  method: string;
}

/**
 * Método 1: Tecla Escape para fechar dropdown
 * @param {HTMLElement} button - Botão do dropdown
 * @returns {Promise<CloseResult>} Resultado da tentativa
 */
export const tryEscapeKey = async (button: HTMLElement): Promise<CloseResult> => {
  const escapeEvent = new KeyboardEvent('keydown', {
    key: 'Escape',
    code: 'Escape',
    bubbles: true,
    cancelable: true,
  });

  button.dispatchEvent(escapeEvent);
  await wait(200);

  // Verifica se fechou
  const newState = button.getAttribute('aria-expanded');
  const success = newState === 'false' || newState === null;

  if (success) {
    // eslint-disable-next-line no-console
    console.log('✅ Dropdown fechado com sucesso via Escape');
  }

  return { success, method: 'escape-key' };
};

/**
 * Método 2: Click novamente para toggle
 * @param {HTMLElement} button - Botão do dropdown
 * @returns {Promise<CloseResult>} Resultado da tentativa
 */
export const tryToggleClick = async (button: HTMLElement): Promise<CloseResult> => {
  button.click();
  await wait(200);

  const newState = button.getAttribute('aria-expanded');
  const success = newState === 'false' || newState === null;

  if (success) {
    // eslint-disable-next-line no-console
    console.log('✅ Dropdown fechado com sucesso via click toggle');
  }

  return { success, method: 'toggle-click' };
};

/**
 * Método 3: Click fora do dropdown
 * @param {HTMLElement} button - Botão do dropdown
 * @returns {Promise<CloseResult>} Resultado da tentativa
 */
export const tryOutsideClick = async (button: HTMLElement): Promise<CloseResult> => {
  const body = document.body;
  const outsideClick = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  body.dispatchEvent(outsideClick);
  await wait(200);

  const newState = button.getAttribute('aria-expanded');
  const success = newState === 'false' || newState === null;

  if (success) {
    // eslint-disable-next-line no-console
    console.log('✅ Dropdown fechado com sucesso via click externo');
  }

  return { success, method: 'outside-click' };
};

/**
 * Executa múltiplos métodos de fechamento sequencialmente até um funcionar
 * @param {HTMLElement} button - Botão do dropdown
 * @returns {Promise<CloseResult>} Resultado da tentativa bem-sucedida ou da última falha
 */
export const tryAllCloseMethods = async (button: HTMLElement): Promise<CloseResult> => {
  const methods = [tryEscapeKey, tryToggleClick, tryOutsideClick];

  for (const method of methods) {
    const result = await method(button);
    if (result.success) {
      return result;
    }
  }

  // eslint-disable-next-line no-console
  console.warn('⚠️ Não foi possível fechar o dropdown');
  return { success: false, method: 'all-failed' };
};
