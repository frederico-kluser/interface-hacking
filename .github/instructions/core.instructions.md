# Instruções para Desenvolvimento Core

## Funções Core (`/src/core/`)

### Padrões de Implementação

- **SEMPRE** implemente busca hierárquica completa
- Valide cada nível da hierarquia antes de prosseguir
- Use early returns para otimização de performance
- Implemente suporte completo a regex com error handling

### Estrutura de Função Padrão

```typescript
const functionName = (
  hierarchy: TagWithAttributes[],
  from: HTMLElement | Element = document.body,
): ReturnType => {
  let currentElements: HTMLElement[] = [from as HTMLElement];

  for (const { tag, attributes } of hierarchy) {
    // Implementação do nível
    if (matchingElements.length === 0) {
      return appropriateEmptyReturn;
    }
    currentElements = matchingElements;
  }

  return result;
};
```

### Validação de Atributos

- Suporte a `innerHTML`, `innerText` e atributos DOM
- Regex validation com try/catch
- **SEMPRE** verificar se atributo existe antes de testar
- Log erros de regex com contexto útil

### Performance Guidelines

- Use `getElementsByTagName()` para busca inicial
- Evite `querySelectorAll()` para hierarquias complexas
- Implemente break conditions em loops
- Cache elementos parent quando apropriado
