import findElementsByHierarchy from '../core/findElementsByHierarchy.js';
import allTextareasSelector from '../selectors/all-textareas.js';
import interactiveViewLineSelector from '../selectors/interactive-view-line.js';
import nativeEditContextSelector from '../selectors/native-edit-context.js';
import type { HTMLElementWithMonaco, MonacoEditorInstance } from '../types/MonacoEditor.js';
import { findCopilotEditor } from './findCopilotEditor.js';
import { focusCopilotEditor } from './focusCopilotEditor.js';
import { forceMonacoVisualUpdate, syncMonacoEditorState } from './syncMonacoState.js';
import { wait } from './wait.js';

/**
 * Obtém a instância do Monaco Editor a partir do elemento DOM
 * @param {HTMLElement} monacoElement - Elemento DOM do Monaco Editor
 * @returns {MonacoEditorInstance | null} Instância do Monaco Editor ou null
 */
const getMonacoEditorInstance = (monacoElement: HTMLElement): MonacoEditorInstance | null => {
  const elementWithMonaco = monacoElement as HTMLElementWithMonaco;

  // Tentativa 1: Procurar pela chave comum onde o Monaco armazena a instância
  const keys = Object.keys(elementWithMonaco);
  for (const key of keys) {
    if (key.startsWith('__reactInternalInstance') || key.startsWith('_reactInternalFiber')) {
      continue;
    }
    const value = elementWithMonaco[key];
    if (
      value &&
      typeof value === 'object' &&
      'getModel' in value &&
      'setValue' in value &&
      typeof (value as { getModel: unknown }).getModel === 'function'
    ) {
      return value as MonacoEditorInstance;
    }
  }

  // Tentativa 2: Buscar em propriedades conhecidas
  const possibleProps: (keyof HTMLElementWithMonaco)[] = [
    '_editor',
    'editor',
    '_codeEditor',
    'codeEditor',
  ];
  for (const prop of possibleProps) {
    const editor = elementWithMonaco[prop];
    if (
      editor &&
      typeof editor === 'object' &&
      'getModel' in editor &&
      'setValue' in editor &&
      typeof (editor as { getModel: unknown }).getModel === 'function'
    ) {
      return editor as MonacoEditorInstance;
    }
  }

  return null;
};

/**
 * Simula digitação natural no Monaco Editor
 * @param {HTMLElement} monacoElement - Elemento DOM do Monaco Editor
 * @param {string} text - Texto a ser digitado
 * @returns {Promise<boolean>} True se simulado com sucesso
 */
const simulateTypingInMonaco = async (
  monacoElement: HTMLElement,
  text: string,
): Promise<boolean> => {
  try {
    // Limpa o conteúdo atual primeiro
    const selectAllEvent = new KeyboardEvent('keydown', {
      key: 'a',
      code: 'KeyA',
      ctrlKey: true,
      metaKey: true,
      bubbles: true,
    });
    monacoElement.dispatchEvent(selectAllEvent);
    await wait(50);

    // Simula a digitação caractere por caractere
    for (const char of text) {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: char,
        code: `Key${char.toUpperCase()}`,
        bubbles: true,
      });

      const keypressEvent = new KeyboardEvent('keypress', {
        key: char,
        code: `Key${char.toUpperCase()}`,
        bubbles: true,
      });

      const inputEvent = new InputEvent('input', {
        data: char,
        inputType: 'insertText',
        bubbles: true,
      });

      monacoElement.dispatchEvent(keydownEvent);
      monacoElement.dispatchEvent(keypressEvent);
      monacoElement.dispatchEvent(inputEvent);

      await wait(10); // Pequena pausa entre caracteres
    }

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro ao simular digitação:', error);
    return false;
  }
};

/**
 * Insere texto no editor do Copilot usando múltiplos métodos otimizados para Monaco
 * @param {string} text - Texto a ser inserido no editor
 * @returns {Promise<boolean>} True se o texto foi inserido com sucesso
 */
export const insertTextInCopilot = async (text: string): Promise<boolean> => {
  // eslint-disable-next-line no-console
  console.log(`📝 Inserindo: "${text}"`);

  // Estabelece foco primeiro
  await focusCopilotEditor();
  await wait(150); // Tempo maior para estabilizar o foco

  const editor = findCopilotEditor();
  if (!editor) {
    // eslint-disable-next-line no-console
    console.error('❌ Editor do Copilot não encontrado!');
    return false;
  }

  // Método 1: Interação direta com Monaco Editor usando sincronização otimizada
  const monacoInstance = getMonacoEditorInstance(editor.container);
  if (monacoInstance) {
    // eslint-disable-next-line no-console
    console.log('✅ Instância Monaco encontrada - sincronizando estado');
    const success = await syncMonacoEditorState(monacoInstance, text);
    if (success) {
      // Força atualização visual para garantir sincronização
      await forceMonacoVisualUpdate(editor.container);
      return true;
    }
  }

  // Método 2: Busca pelo native-edit-context (elemento de entrada real do Monaco)
  const nativeContexts = findElementsByHierarchy({ hierarchy: nativeEditContextSelector, from: editor.container });
  const nativeContext = nativeContexts[0] || null;
  if (nativeContext) {
    // eslint-disable-next-line no-console
    console.log('✅ Native edit context encontrado');

    // Foca no contexto nativo
    nativeContext.focus();
    await wait(100);

    // Simula eventos de teclado no contexto nativo
    nativeContext.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'a',
        code: 'KeyA',
        ctrlKey: true,
        metaKey: true,
        bubbles: true,
      }),
    );

    await wait(50);

    // Usa clipboard data para inserir o texto
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', text);

    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData,
      bubbles: true,
      cancelable: true,
    });

    nativeContext.dispatchEvent(pasteEvent);
    await wait(100);

    return true;
  }

  // Método 3: Busca pela textarea específica do Monaco
  const textareas = findElementsByHierarchy({
    hierarchy: allTextareasSelector,
    from: editor.container,
  }) as HTMLTextAreaElement[];
  for (const textarea of textareas) {
    if (!textarea.readOnly && textarea.classList.contains('ime-text-area')) {
      // eslint-disable-next-line no-console
      console.log('✅ IME textarea encontrada');
      textarea.readOnly = false;
      textarea.focus();
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      textarea.readOnly = true;
      return true;
    }
  }

  // Método 4: Simulação de digitação natural
  // eslint-disable-next-line no-console
  console.log('🔄 Tentando simulação de digitação...');
  const typingSuccess = await simulateTypingInMonaco(editor.container, text);
  if (typingSuccess) {
    return true;
  }

  // Método 5: Manipulação do contentEditable com seleção adequada
  const viewLines = findElementsByHierarchy({ hierarchy: interactiveViewLineSelector, from: document.body });
  const viewLine = viewLines[0] || null;
  if (viewLine) {
    // eslint-disable-next-line no-console
    console.log('✅ View line encontrada - usando contentEditable');

    // Foca no elemento primeiro
    viewLine.focus();
    await wait(50);

    // Torna editável temporariamente
    const wasEditable = viewLine.contentEditable;
    viewLine.contentEditable = 'true';

    // Seleciona todo o conteúdo
    const range = document.createRange();
    range.selectNodeContents(viewLine);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Insere o texto
    document.execCommand('insertText', false, text);

    // Restaura o estado original
    viewLine.contentEditable = wasEditable;

    return true;
  }

  // Método 6: Clipboard como fallback
  // eslint-disable-next-line no-console
  console.log('🔄 Tentando método clipboard...');
  try {
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', text);

    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    });

    editor.container.focus();
    await wait(50);
    editor.container.dispatchEvent(pasteEvent);

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no método clipboard:', error);
  }

  // eslint-disable-next-line no-console
  console.error('❌ Todos os métodos falharam');
  return false;
};
