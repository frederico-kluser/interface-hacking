/**
 * @fileoverview Automação para GitHub Copilot no VS Code
 * @module CopilotAutomation
 * @description Sistema de automação para interagir com o editor do GitHub Copilot no VS Code
 */

// Imports das funções hierárquicas
import findElementByHierarchy from './core/findElementByHierarchy.js';
import findElementsByHierarchy from './core/findElementsByHierarchy.js';
import allTextareasSelector from './selectors/all-textareas.js';
import editableTextareaSelector from './selectors/editable-textarea.js';
import interactiveViewLineSelector from './selectors/interactive-view-line.js';
import monacoDefaultButtonSelector from './selectors/monaco-default-button.js';
import monacoEditorsSelector from './selectors/monaco-editors.js';
import sendButtonAriaSelector from './selectors/send-button-aria.js';
import sendIconButtonSelector from './selectors/send-icon-button.js';
import submitButtonAriaSelector from './selectors/submit-button-aria.js';
import submitButtonSelector from './selectors/submit-button.js';
import viewLineSelector from './selectors/view-line.js';
import viewLinesSelector from './selectors/view-lines.js';

export {};
/* eslint-disable no-console */

/** Tipo para elementos do editor Monaco */
interface MonacoEditor {
  /** Container principal do editor */
  container: HTMLElement;
  /** Elemento que contém as linhas de visualização */
  viewLines: HTMLElement | null;
  /** Parte de entrada interativa */
  inputPart: HTMLElement | null;
}

/** Interface para a API global do Copilot */
interface CopilotAPI {
  /** Insere texto no editor do Copilot */
  type: (text: string) => Promise<boolean>;
  /** Envia a mensagem atual */
  send: () => Promise<boolean>;
  /** Digita e envia uma mensagem */
  ask: (text: string) => Promise<boolean>;
  /** Limpa o editor */
  clear: () => Promise<void>;
  /** Mostra informações de debug */
  debug: () => void;
  /** Foca no editor do Copilot */
  focus: () => Promise<boolean>;
  /** Testa todos os métodos de inserção */
  testAllMethods: (text?: string) => Promise<void>;
}

declare global {
  interface Window {
    copilot: CopilotAPI;
  }
  // Add navigator to the global scope for TypeScript
  var navigator: Navigator;
}

declare let navigator: Navigator;

((): void => {
  console.log('🚀 Iniciando automação Copilot (versão funcional)...');

  /**
   * Aguarda um determinado tempo em milissegundos
   * @param {number} ms - Tempo em milissegundos para aguardar
   * @returns {Promise<void>} Promise que resolve após o tempo especificado
   */
  const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Encontra o editor Monaco do Copilot no DOM
   * @returns {MonacoEditor | null} Objeto com elementos do editor ou null se não encontrado
   */
  const findCopilotEditor = (): MonacoEditor | null => {
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

  /**
   * Foca corretamente no editor do Copilot
   * @returns {Promise<boolean>} True se o foco foi estabelecido com sucesso
   */
  const focusCopilotEditor = async (): Promise<boolean> => {
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

  /**
   * Insere texto no editor do Copilot usando múltiplos métodos
   * @param {string} text - Texto a ser inserido no editor
   * @returns {Promise<boolean>} True se o texto foi inserido com sucesso
   */
  const insertTextInCopilot = async (text: string): Promise<boolean> => {
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

  /**
   * Envia a mensagem atual no editor do Copilot
   * @returns {Promise<boolean>} True se a mensagem foi enviada com sucesso
   */
  const sendMessage = (): Promise<boolean> => {
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

  /**
   * Limpa o conteúdo do editor
   * @returns {Promise<void>}
   */
  const clearEditor = async (): Promise<void> => {
    await focusCopilotEditor();
    document.execCommand('selectAll');
    document.execCommand('delete');
  };

  /**
   * Mostra informações de debug sobre o estado atual do editor
   * @returns {void}
   */
  const showDebugInfo = (): void => {
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

  /**
   * Testa todos os métodos de inserção de texto
   * @param {string} text - Texto para testar (padrão: 'Teste 123')
   * @returns {Promise<void>}
   */
  const testAllMethods = async (text = 'Teste 123'): Promise<void> => {
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

  // API Global
  window.copilot = {
    type: async (text: string): Promise<boolean> => {
      const success = await insertTextInCopilot(text);
      if (!success) {
        console.error('❌ Falha ao inserir texto');
      }
      return success;
    },

    send: (): Promise<boolean> => sendMessage(),

    ask: async (text: string): Promise<boolean> => {
      console.log('🤖 Executando comando completo...');
      const inserted = await insertTextInCopilot(text);
      if (inserted) {
        await wait(200);
        return await sendMessage();
      }
      return false;
    },

    clear: (): Promise<void> => clearEditor(),

    debug: (): void => showDebugInfo(),

    focus: (): Promise<boolean> => focusCopilotEditor(),

    testAllMethods: (text?: string): Promise<void> => testAllMethods(text),
  };

  console.log('\n✅ Sistema pronto!');
  console.log('📚 Comandos disponíveis:');
  console.log('  copilot.ask("sua pergunta") - Digita e envia');
  console.log('  copilot.type("texto") - Apenas digita');
  console.log('  copilot.send() - Apenas envia');
  console.log('  copilot.focus() - Foca no editor');
  console.log('  copilot.debug() - Mostra informações');
  console.log('  copilot.testAllMethods() - Testa vários métodos');

  // Debug inicial
  setTimeout(() => {
    console.log('\n🔍 Debug inicial:');
    window.copilot.debug();
  }, 500);
})();
