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
  console.log('🚀 Iniciando automação Copilot (versão otimizada para Monaco)...');

  // API Global
  window.copilot = async (text: string): Promise<boolean> => {
    console.log('📤 Executando comando copilot...');

    // Tenta inserir o texto usando múltiplos métodos otimizados
    const success = await insertTextInCopilot(text);

    if (success) {
      console.log('✅ Texto inserido com sucesso!');
    } else {
      console.error('❌ Falha ao inserir texto - verifique se o editor está visível');
    }

    return success;
  };

  console.log('\n✅ Sistema pronto!');
  console.log('  copilot("quanto é 1 + 1 ?") - Insere texto e funciona na primeira tentativa');
  console.log('  📋 Métodos disponíveis:');
  console.log('    1. Monaco Editor API (direto)');
  console.log('    2. Native Edit Context');
  console.log('    3. IME Textarea');
  console.log('    4. Simulação de digitação');
  console.log('    5. ContentEditable');
  console.log('    6. Clipboard (fallback)');
})();
