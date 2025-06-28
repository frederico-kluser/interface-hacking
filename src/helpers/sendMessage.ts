import findElementByHierarchy from '../core/findElementByHierarchy.js';
import monacoDefaultButtonSelector from '../selectors/monaco-default-button.js';
import sendButtonAriaSelector from '../selectors/send-button-aria.js';
import sendIconButtonSelector from '../selectors/send-icon-button.js';
import submitButtonAriaSelector from '../selectors/submit-button-aria.js';
import submitButtonSelector from '../selectors/submit-button.js';

/**
 * Envia a mensagem atual no editor do Copilot
 * @returns {Promise<boolean>} True se a mensagem foi enviada com sucesso
 */
export const sendMessage = (): Promise<boolean> => {
  console.log('📤 Enviando mensagem...');

  // Tentativa 1: Botão Send com aria-label
  const sendButton = findElementByHierarchy(
    sendButtonAriaSelector,
    document.body,
  ) as HTMLButtonElement;
  if (sendButton && !sendButton.disabled) {
    sendButton.click();
    console.log('✅ Mensagem enviada!');
    return Promise.resolve(true);
  }

  // Tentativa 2: Botão Submit com aria-label
  const submitButton = findElementByHierarchy(
    submitButtonAriaSelector,
    document.body,
  ) as HTMLButtonElement;
  if (submitButton && !submitButton.disabled) {
    submitButton.click();
    console.log('✅ Mensagem enviada!');
    return Promise.resolve(true);
  }

  // Tentativa 3: Botão com ícone send
  const sendIconButton = findElementByHierarchy(
    sendIconButtonSelector,
    document.body,
  ) as HTMLButtonElement;
  if (sendIconButton && !sendIconButton.disabled) {
    sendIconButton.click();
    console.log('✅ Mensagem enviada!');
    return Promise.resolve(true);
  }

  // Tentativa 4: Botão submit dentro de interactive-input-part
  const submitTypeButton = findElementByHierarchy(
    submitButtonSelector,
    document.body,
  ) as HTMLButtonElement;
  if (submitTypeButton && !submitTypeButton.disabled) {
    submitTypeButton.click();
    console.log('✅ Mensagem enviada!');
    return Promise.resolve(true);
  }

  // Tentativa 5: Botão Monaco padrão
  const monacoButton = findElementByHierarchy(
    monacoDefaultButtonSelector,
    document.body,
  ) as HTMLButtonElement;
  if (monacoButton && !monacoButton.disabled) {
    monacoButton.click();
    console.log('✅ Mensagem enviada!');
    return Promise.resolve(true);
  }

  // Fallback: Tenta Enter
  const activeElement = document.activeElement;
  if (activeElement) {
    activeElement.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
      }),
    );
  }

  return Promise.resolve(false);
};
