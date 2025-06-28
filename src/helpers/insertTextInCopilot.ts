import findElementByHierarchy from '../core/findElementByHierarchy.js';
import findElementsByHierarchy from '../core/findElementsByHierarchy.js';
import allTextareasSelector from '../selectors/all-textareas.js';
import interactiveViewLineSelector from '../selectors/interactive-view-line.js';
import { focusCopilotEditor } from './focusCopilotEditor.js';
import { wait } from './wait.js';

/**
 * Insere texto no editor do Copilot usando múltiplos métodos
 * @param {string} text - Texto a ser inserido no editor
 * @returns {Promise<boolean>} True se o texto foi inserido com sucesso
 */
export const insertTextInCopilot = async (text: string): Promise<boolean> => {
  console.log(`📝 Inserindo: "${text}"`);

  await focusCopilotEditor();
  await wait(100);

  // Método A: Textarea ativo
  const activeTextarea = document.activeElement as HTMLTextAreaElement;
  if (activeTextarea && activeTextarea.tagName === 'TEXTAREA') {
    console.log('✅ Textarea ativo encontrado!');
    activeTextarea.value = text;
    activeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    activeTextarea.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  // Método B: Procura por textarea visível no contexto
  const allTextareas = findElementsByHierarchy(
    allTextareasSelector,
    document.body,
  ) as HTMLTextAreaElement[];
  for (const textarea of allTextareas) {
    const rect = textarea.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    // Verifica se o textarea está dentro de interactive-input-part
    const isInCopilot = Boolean(textarea.closest('.interactive-input-part'));

    if (isVisible && isInCopilot && !textarea.readOnly) {
      console.log('✅ Textarea do Copilot encontrado!');
      textarea.focus();
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
  }

  // Método C: Data transfer para simular paste
  await focusCopilotEditor();
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', text);

  const pasteEvent = new ClipboardEvent('paste', {
    clipboardData: dataTransfer,
    bubbles: true,
    cancelable: true,
  });

  if (document.activeElement) {
    document.activeElement.dispatchEvent(pasteEvent);
  }

  // Método D: ContentEditable
  const viewLine = findElementByHierarchy(interactiveViewLineSelector, document.body);
  if (viewLine) {
    viewLine.contentEditable = 'true';
    viewLine.focus();

    document.execCommand('selectAll');
    document.execCommand('insertText', false, text);

    viewLine.contentEditable = 'false';
    return true;
  }

  return false;
};
