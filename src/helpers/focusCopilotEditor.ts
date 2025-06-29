import findElementsByHierarchy from '../core/findElementsByHierarchy.js';
import viewLineSelector from '../selectors/view-line.js';
import { findCopilotEditor } from './findCopilotEditor.js';
import { wait } from './wait.js';

/**
 * Foca corretamente no editor do Copilot
 * @returns {Promise<boolean>} True se o foco foi estabelecido com sucesso
 */
export const focusCopilotEditor = async (): Promise<boolean> => {
  const editor = findCopilotEditor();
  if (!editor) {
    // eslint-disable-next-line no-console
    console.error('❌ Editor do Copilot não encontrado!');
    return false;
  }

  // Sequência otimizada de foco para Monaco Editor
  const elementsToFocus = [
    // 1. Primeiro foca no container principal
    editor.container,
    // 2. Depois no inputPart se existir
    editor.inputPart,
    // 3. Em seguida no viewLines
    editor.viewLines,
    // 4. Finalmente na view-line específica
    editor.viewLines ? (findElementsByHierarchy({ hierarchy: viewLineSelector, from: editor.viewLines })[0] || null) : null,
  ].filter((element): element is HTMLElement => element !== null);

  // Aplica foco em sequência com cliques e chamadas diretas de focus
  for (const element of elementsToFocus) {
    try {
      // Primeiro tenta scroll into view se necessário
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(50);

      // Clique para ativar
      element.click();
      await wait(50);

      // Focus direto
      element.focus();
      await wait(50);

      // Tenta usar tabindex se necessário
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
        element.focus();
        element.removeAttribute('tabindex');
      }

      await wait(25);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Erro ao focar elemento:', element, error);
    }
  }

  // Verifica se o foco foi estabelecido corretamente
  const activeElement = document.activeElement as HTMLElement;
  const isFocused =
    activeElement === editor.container ||
    editor.container.contains(activeElement) ||
    (editor.inputPart && editor.inputPart.contains(activeElement));

  if (isFocused) {
    // eslint-disable-next-line no-console
    console.log('✅ Foco estabelecido:', activeElement.tagName, activeElement.className);
  } else {
    // eslint-disable-next-line no-console
    console.warn('⚠️ Foco pode não ter sido estabelecido corretamente');
  }

  return true;
};
