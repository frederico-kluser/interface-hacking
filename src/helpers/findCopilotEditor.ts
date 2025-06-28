import findElementByHierarchy from '../core/findElementByHierarchy.js';
import findElementsByHierarchy from '../core/findElementsByHierarchy.js';
import monacoEditorsSelector from '../selectors/monaco-editors.js';
import viewLinesSelector from '../selectors/view-lines.js';

/** Tipo para elementos do editor Monaco */
interface MonacoEditor {
  /** Container principal do editor */
  container: HTMLElement;
  /** Elemento que contém as linhas de visualização */
  viewLines: HTMLElement | null;
  /** Parte de entrada interativa */
  inputPart: HTMLElement | null;
}

/**
 * Encontra o editor Monaco do Copilot no DOM
 * @returns {MonacoEditor | null} Objeto com elementos do editor ou null se não encontrado
 */
export const findCopilotEditor = (): MonacoEditor | null => {
  const editors = findElementsByHierarchy(monacoEditorsSelector, document.body);

  for (const editor of editors) {
    // Verifica se o editor está dentro de interactive-input-part ou interactive-input-editor
    let parent = editor.parentElement;
    let inputPart: HTMLElement | null = null;

    // Busca por parent com as classes necessárias
    while (parent && parent !== document.body) {
      if (parent.classList.contains('interactive-input-part')) {
        inputPart = parent;
        break;
      }
      if (parent.classList.contains('interactive-input-editor')) {
        // Pode haver um interactive-input-part acima
        const part = parent.closest('.interactive-input-part');
        if (part instanceof HTMLElement) {
          inputPart = part;
        }
        break;
      }
      parent = parent.parentElement;
    }

    if (inputPart || parent?.classList.contains('interactive-input-editor')) {
      const viewLines = findElementByHierarchy(viewLinesSelector, editor);
      return {
        container: editor,
        viewLines,
        inputPart,
      };
    }
  }

  return null;
};

export type { MonacoEditor };
