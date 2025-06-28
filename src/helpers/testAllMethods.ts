import findElementsByHierarchy from '../core/findElementsByHierarchy.js';
import editableTextareaSelector from '../selectors/editable-textarea.js';
import { focusCopilotEditor } from './focusCopilotEditor.js';
import { wait } from './wait.js';

declare let navigator: Navigator;

/**
 * Testa todos os métodos de inserção de texto
 * @param {string} text - Texto para testar (padrão: 'Teste 123')
 * @returns {Promise<void>}
 */
export const testAllMethods = async (text = 'Teste 123'): Promise<void> => {
  console.log('🧪 Testando todos os métodos...\n');

  console.log('1. Testando foco...');
  await focusCopilotEditor();
  await wait(500);

  console.log('\n2. Testando textarea direto...');
  const textareas = findElementsByHierarchy(
    editableTextareaSelector,
    document.body,
  ) as HTMLTextAreaElement[];
  const textarea = textareas.find((ta) => !ta.readOnly);
  if (textarea) {
    textarea.focus();
    textarea.value = text;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Textarea modificado:', textarea.value);
  }

  await wait(500);

  console.log('\n3. Testando execCommand...');
  document.execCommand('selectAll');
  document.execCommand('insertText', false, text);

  await wait(500);

  console.log('\n4. Testando clipboard...');
  try {
    await navigator.clipboard.writeText(text);
    document.execCommand('paste');
  } catch (e) {
    console.log('Clipboard falhou:', (e as Error).message);
  }

  console.log('\n✅ Testes concluídos! Verifique o editor.');
};
