import findElementByHierarchy from '../core/findElementByHierarchy.js';
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
    console.error('❌ Editor do Copilot não encontrado!');
    return false;
  }

  const elementsToClick = [
    editor.inputPart,
    editor.container,
    editor.viewLines,
    editor.viewLines ? findElementByHierarchy(viewLineSelector, editor.viewLines) : null,
  ].filter((element): element is HTMLElement => element !== null);

  for (const element of elementsToClick) {
    element.click();
    await wait(50);
  }

  const activeElement = document.activeElement as HTMLElement;
  console.log('Elemento ativo após foco:', activeElement.tagName, activeElement.className);

  return true;
};
