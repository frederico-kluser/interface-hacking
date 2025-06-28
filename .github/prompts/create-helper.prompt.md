# Prompt para Criação de Helper Function

## Contexto

Preciso criar uma nova função helper para integração com Monaco Editor / Copilot.

## Entrada Necessária

- **Funcionalidade**: O que a função deve fazer
- **Parâmetros**: Quais entradas são necessárias
- **Retorno esperado**: Tipo de retorno e estados de sucesso/falha
- **Dependências**: Quais seletores ou outras funções usar

## Template de Resposta

1. Crie arquivo em `/src/helpers/` com nome camelCase
2. Implemente múltiplos métodos de fallback
3. Use error handling completo com try/catch
4. Adicione logging estruturado
5. Sincronize estado quando necessário

## Estrutura Padrão

```typescript
import findElementByHierarchy from '../core/findElementByHierarchy.js';
import selectorName from '../selectors/selector-name.js';
import { wait } from './wait.js';

/**
 * [DESCRIÇÃO DA FUNÇÃO]
 * @param {Type} param - Descrição do parâmetro
 * @returns {Promise<boolean>} True se bem-sucedido
 */
export const helperFunctionName = async (param: Type): Promise<boolean> => {
  console.log(`🔧 [AÇÃO]: "${param}"`);

  try {
    // Método 1: Tentativa principal
    const element = findElementByHierarchy(selectorName);
    if (element) {
      // Implementação principal
      console.log('✅ Método 1 bem-sucedido');
      return true;
    }

    // Método 2: Fallback
    // Implementação alternativa

    console.error('❌ Todos os métodos falharam');
    return false;
  } catch (error) {
    console.error('Erro na função helper:', error);
    return false;
  }
};
```

## Validação

- ✅ Múltiplos métodos de fallback
- ✅ Error handling completo
- ✅ Logging estruturado com emojis
- ✅ Retorno booleano consistente
- ✅ JSDoc completo
- ✅ Import/export correto
