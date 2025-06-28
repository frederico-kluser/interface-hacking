import findElementByHierarchy from '../core/findElementByHierarchy.js';
import findElementsByHierarchy from '../core/findElementsByHierarchy.js';
import allTextareasSelector from '../selectors/all-textareas.js';
import viewLineSelector from '../selectors/view-line.js';
import { findCopilotEditor } from './findCopilotEditor.js';

/**
 * Mostra informações de debug sobre o estado atual do editor
 * @returns {void}
 */
export const showDebugInfo = (): void => {
  const editor = findCopilotEditor();
  const activeElement = document.activeElement as HTMLElement;

  console.log('🔍 Debug Info:');
  console.log('Editor encontrado:', Boolean(editor));
  console.log('Elemento ativo:', {
    tag: activeElement?.tagName,
    class: activeElement?.className,
    id: activeElement?.id,
    value: (activeElement as HTMLInputElement)?.value,
  });

  const textareas = findElementsByHierarchy(
    allTextareasSelector,
    document.body,
  ) as HTMLTextAreaElement[];
  console.log(`\nTextareas encontrados: ${textareas.length}`);
  textareas.forEach((ta, i) => {
    const rect = ta.getBoundingClientRect();
    console.log(`Textarea #${i}:`, {
      visible: rect.width > 0 && rect.height > 0,
      readonly: ta.readOnly,
      class: ta.className,
      inCopilot: Boolean(ta.closest('.interactive-input-part')),
    });
  });

  if (editor && editor.viewLines) {
    const viewLine = findElementByHierarchy(viewLineSelector, editor.viewLines);
    const content = viewLine?.textContent;
    console.log('\nConteúdo atual:', content || '(vazio)');
  }
};
