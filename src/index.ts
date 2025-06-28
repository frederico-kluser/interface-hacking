/**
 * @fileoverview Automação para GitHub Copilot no VS Code
 * @module CopilotAutomation
 * @description Sistema de automação para interagir com o editor do GitHub Copilot no VS Code
 */

// Imports das funções helper
import { insertTextInCopilot } from './helpers/insertTextInCopilot.js';

export {};
/* eslint-disable no-console */

/** Interface para a API global do Copilot */
type CopilotAPI = (text: string) => Promise<boolean>;

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
  window.copilot = async (text: string): Promise<boolean> => {
    const success = await insertTextInCopilot(text);
    if (!success) {
      console.error('❌ Falha ao inserir texto');
    }
    return success;
  };

  console.log('\n✅ Sistema pronto!');
  console.log('  copilot("sua pergunta") - Digita e envia');
})();
