/**
 * @fileoverview Automação para GitHub Copilot no VS Code
 * @module CopilotAutomation
 * @description Sistema de automação para interagir com o editor do GitHub Copilot no VS Code
 */

// Imports das funções helper
import { insertTextInCopilot } from './helpers/insertTextInCopilot.js';
import {
  closeMonacoDropdown,
  debugFindPossibleDropdowns,
  findDropdownsDirectly,
  listMonacoDropdowns,
  testDropdownTrigger,
  triggerMonacoDropdown,
  type DropdownElement,
} from './helpers/triggerMonacoDropdown.js';

// Exportações públicas da biblioteca
export {
  closeMonacoDropdown,
  debugFindPossibleDropdowns,
  findDropdownsDirectly,
  insertTextInCopilot,
  listMonacoDropdowns,
  testDropdownTrigger,
  triggerMonacoDropdown,
  type DropdownElement,
};
/* eslint-disable no-console */

/** Interface para a API global do Copilot */
type CopilotAPI = (text: string) => Promise<boolean>;

/** Interface para as funções de dropdown */
interface DropdownAPI {
  /** Aciona dropdown do Monaco (agent, model, any) */
  trigger: (type?: 'agent' | 'model' | 'any') => Promise<boolean>;
  /** Fecha dropdown do Monaco (agent, model, any) */
  close: (type?: 'agent' | 'model' | 'any') => Promise<boolean>;
  /** Lista dropdowns disponíveis */
  list: () => DropdownElement[];
  /** Debug: analisa estrutura DOM para encontrar dropdowns */
  debug: () => void;
  /** Teste: executa debug específico de trigger */
  test: () => Promise<void>;
}

declare global {
  interface Window {
    copilot: CopilotAPI;
    dropdown: DropdownAPI;
    debugDropdowns: () => void;
  }
  // Add navigator to the global scope for TypeScript
  var navigator: Navigator;
}

((): void => {
  console.log('🚀 Iniciando automação Copilot (versão otimizada para Monaco)...');

  // API Global para inserção de texto
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

  // Função de debug para dropdowns
  window.debugDropdowns = (): void => {
    console.log('🔧 DEBUG: Executando análise de dropdowns...');
    console.log('\n1. Buscando elementos possíveis:');
    debugFindPossibleDropdowns();
    console.log('\n2. Busca direta por seletores:');
    findDropdownsDirectly();
  };

  // API Global para controle de dropdowns
  window.dropdown = {
    trigger: async (type = 'any'): Promise<boolean> => {
      console.log('🔽 Executando comando dropdown...');
      return triggerMonacoDropdown(type);
    },
    close: async (type = 'any'): Promise<boolean> => {
      console.log('🔒 Executando comando fechar dropdown...');
      return closeMonacoDropdown(type);
    },
    list: (): DropdownElement[] => {
      console.log('📋 Listando dropdowns...');
      return listMonacoDropdowns();
    },
    debug: (): void => {
      console.log('🔧 DEBUG: Executando análise detalhada...');
      debugFindPossibleDropdowns();
      findDropdownsDirectly();
    },
    test: async (): Promise<void> => {
      console.log('🧪 TESTE: Executando debug de trigger...');
      await testDropdownTrigger();
    },
  };

  console.log('\n✅ Sistema pronto!');
  console.log('  copilot("quanto é 1 + 1 ?") - Insere texto e funciona na primeira tentativa');
  console.log('  dropdown.trigger("agent") - Abre dropdown de agente');
  console.log('  dropdown.trigger("model") - Abre dropdown de modelo');
  console.log('  dropdown.close("agent") - Fecha dropdown de agente');
  console.log('  dropdown.close("model") - Fecha dropdown de modelo');
  console.log('  dropdown.list() - Lista dropdowns disponíveis');
  console.log('  dropdown.debug() - Análise DEBUG de dropdowns');
  console.log('  dropdown.test() - Teste específico de trigger (NOVO!)');
  console.log('  debugDropdowns() - Função de debug independente');
  console.log('  📋 Métodos disponíveis:');
  console.log('    1. Monaco Editor API (direto)');
  console.log('    2. Native Edit Context');
  console.log('    3. IME Textarea');
  console.log('    4. Simulação de digitação');
  console.log('    5. ContentEditable');
  console.log('    6. Clipboard (fallback)');
  console.log('    7. Dropdown Control (NOVO!)');
})();
