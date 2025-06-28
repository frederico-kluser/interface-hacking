# Instruções para Tipos TypeScript

## Definição de Tipos (`/src/types/`)

### Estrutura de Interface Padrão

```typescript
interface InterfaceName {
  property: Type;
  optionalProperty?: Type;
  methodName(param: Type): ReturnType;
}

export default InterfaceName;
```

### Convenções de Nomenclatura

- Use PascalCase para interfaces e types
- Seja descritivo: `HTMLElementWithMonaco` vs `Element`
- Use sufixos adequados: `Instance`, `Config`, `Options`

### Tipagem DOM

- **SEMPRE** estenda tipos DOM apropriados
- Use union types para elementos que podem variar
- Implemente type guards quando necessário
- Document propriedades customizadas

### Exportação

- **SEMPRE** export como default para tipos principais
- Use named exports para tipos auxiliares
- Mantenha imports organizados com `import type`

### Exemplos de Boas Práticas

```typescript
// Interface para elemento Monaco estendido
interface HTMLElementWithMonaco extends HTMLElement {
  _editor?: MonacoEditorInstance;
  editor?: MonacoEditorInstance;
  [key: string]: unknown;
}

// Type para opções de configuração
type WaitOptions = {
  limitTime?: number;
  from?: HTMLElement | Element;
};
```
