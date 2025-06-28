import { focusCopilotEditor } from './focusCopilotEditor.js';

/**
 * Limpa o conteúdo do editor
 * @returns {Promise<void>}
 */
export const clearEditor = async (): Promise<void> => {
  await focusCopilotEditor();
  document.execCommand('selectAll');
  document.execCommand('delete');
};
