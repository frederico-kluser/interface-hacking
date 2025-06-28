/**
 * @fileoverview Automação para GitHub Copilot no VS Code
 * @module CopilotAutomation
 * @description Sistema de automação para interagir com o editor do GitHub Copilot no VS Code
 */

// Imports das funções helper
import { clearEditor } from './helpers/clearEditor.js';
import { focusCopilotEditor } from './helpers/focusCopilotEditor.js';
import { insertTextInCopilot } from './helpers/insertTextInCopilot.js';
import { sendMessage } from './helpers/sendMessage.js';
import { showDebugInfo } from './helpers/showDebugInfo.js';
import { testAllMethods } from './helpers/testAllMethods.js';
import { wait } from './helpers/wait.js';

export {};
/* eslint-disable no-console */

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

((): void => {
  console.log('🚀 Iniciando automação Copilot (versão funcional)...');

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
