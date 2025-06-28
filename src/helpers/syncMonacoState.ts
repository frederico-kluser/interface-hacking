import type { MonacoEditorInstance } from '../types/MonacoEditor.js';
import { wait } from './wait.js';

/**
 * Força a sincronização do estado interno do Monaco Editor
 * @param {MonacoEditorInstance} editor - Instância do Monaco Editor
 * @param {string} text - Texto a ser sincronizado
 * @returns {Promise<boolean>} True se sincronizado com sucesso
 */
export const syncMonacoEditorState = async (
  editor: MonacoEditorInstance,
  text: string,
): Promise<boolean> => {
  try {
    // Força o foco primeiro
    editor.focus();
    await wait(100);

    // Obtém o modelo atual
    const model = editor.getModel();
    if (!model) return false;

    // Método 1: setValue direto (mais simples)
    try {
      editor.setValue(text);
      await wait(50);
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('setValue falhou, tentando executeEdits:', error);
    }

    // Método 2: executeEdits (mais preciso)
    try {
      const fullRange = model.getFullModelRange();
      const editResult = editor.executeEdits('syncText', [
        {
          range: fullRange,
          text,
          forceMoveMarkers: true,
        },
      ]);

      // Posiciona cursor no final
      const lineCount = model.getLineCount();
      const lastLineLength = model.getLineLength(lineCount);
      editor.setPosition({ lineNumber: lineCount, column: lastLineLength + 1 });

      await wait(50);
      return Boolean(editResult);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('executeEdits falhou:', error);
    }

    return false;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro ao sincronizar estado Monaco:', error);
    return false;
  }
};

/**
 * Força atualização visual do Monaco Editor
 * @param {HTMLElement} monacoContainer - Container do Monaco Editor
 * @returns {Promise<void>}
 */
export const forceMonacoVisualUpdate = async (monacoContainer: HTMLElement): Promise<void> => {
  try {
    // Dispara eventos de redimensionamento para forçar atualização
    monacoContainer.dispatchEvent(new Event('resize', { bubbles: true }));

    // Dispara eventos de input para notificar mudanças
    monacoContainer.dispatchEvent(new Event('input', { bubbles: true }));
    monacoContainer.dispatchEvent(new Event('change', { bubbles: true }));

    // Força repaint se necessário
    const style = monacoContainer.style;
    const originalDisplay = style.display;
    style.display = 'none';
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    monacoContainer.offsetHeight; // Força reflow
    style.display = originalDisplay;

    await wait(25);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Erro ao forçar atualização visual:', error);
  }
};
