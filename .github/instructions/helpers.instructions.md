# Instruções para Helpers

## Helpers de Integração (`/src/helpers/`)

### Monaco Editor Helpers

- **SEMPRE** implemente múltiplos métodos de fallback
- Priorize APIs oficiais do Monaco sobre DOM manipulation
- Use timing adequado com `wait()` helper
- Sincronize estado visual após modificações

### Padrão de Implementação Monaco

```typescript
export const monacoHelper = async (param: string): Promise<boolean> => {
  try {
    // Método 1: API oficial Monaco
    const monacoInstance = getMonacoEditorInstance(editor);
    if (monacoInstance) {
      // Implementação direta
      return true;
    }

    // Método 2: Native context
    const nativeContext = findElementByHierarchy(nativeSelector);
    if (nativeContext) {
      // Implementação com contexto nativo
      return true;
    }

    // Método 3+: Outros fallbacks

    return false;
  } catch (error) {
    console.error('Erro no helper:', error);
    return false;
  }
};
```

### Timing e Sincronização

- Use `wait()` entre operações críticas
- Implemente timeouts configuráveis
- **SEMPRE** aguarde estabilização do DOM
- Log timing de operações para debugging

### Error Recovery

- Implemente graceful degradation
- Log contexto útil em falhas
- Retorne valores booleanos consistentes
- **NUNCA** deixe promises sem catch
