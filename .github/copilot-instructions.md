# Instruções do GitHub Copilot - Interface Hacking

## Visão Geral do Projeto

Este é um projeto de biblioteca TypeScript especializada em manipulação avançada de elementos DOM através de hierarquia. O projeto é focado em automatização de interfaces, especialmente para integração com editores como VS Code/Monaco Editor e GitHub Copilot.

## Padrões de Código Obrigatórios

### TypeScript

- **SEMPRE** use TypeScript strict mode
- **SEMPRE** exporte tipos e interfaces
- Use `import type` para imports apenas de tipos
- Prefira `interface` para definição de contratos públicos
- Use `type` para unions, intersections e computed types
- **NUNCA** use `any` - prefira `unknown` quando necessário
- Implemente error handling explícito com try/catch

### Estrutura de Arquivos

- Core functions em `/src/core/`
- Helper functions em `/src/helpers/`
- Seletores DOM em `/src/selectors/`
- Tipos TypeScript em `/src/types/`
- **SEMPRE** use extensão `.js` nos imports (ES Modules)

### Nomenclatura e Convenções

- Use PascalCase para tipos, interfaces e classes
- Use camelCase para funções, variáveis e métodos
- Use kebab-case para nomes de arquivos
- Prefixe seletores com o tipo: `allTextareasSelector`, `monacoEditorsSelector`
- Use nomes descritivos: `findElementByHierarchy` ao invés de `findEl`

## Padrões Específicos do Projeto

### Manipulação DOM

- **SEMPRE** retorne `HTMLElement | null` para funções de busca únicas
- **SEMPRE** retorne `HTMLElement[]` para funções de busca múltiplas
- Use `TagWithAttributes[]` para definir hierarquias de busca
- Implemente suporte a regex nos atributos com `isRegex?: boolean`
- **SEMPRE** valide se elementos existem antes de manipulá-los

### Seletores

- Crie seletores reutilizáveis em arquivos separados
- Use a estrutura: `const selectorName: TagWithAttributes[] = [...]`
- Export como default function
- Documente o propósito de cada seletor

### Integração Monaco Editor

- Use tipos específicos: `MonacoEditorInstance`, `HTMLElementWithMonaco`
- Implemente múltiplos métodos de fallback para robustez
- **SEMPRE** sincronize estado do editor após modificações
- Use `wait()` helper para timing adequado entre operações
- Priorize APIs oficiais do Monaco sobre manipulação DOM direta

### Error Handling

- **SEMPRE** use try/catch em operações assíncronas
- Log erros com contexto útil usando `console.error`
- Retorne valores falsy (`null`, `false`) em caso de falha
- **NUNCA** deixe erros não tratados propagarem

## Arquitetura e Organização

### Separação de Responsabilidades

- **Core**: Lógica fundamental de busca de elementos
- **Helpers**: Utilitários específicos (Copilot, Monaco, timing)
- **Selectors**: Definições de hierarquias DOM reutilizáveis
- **Types**: Contratos TypeScript bem definidos

### Padrões de Implementação

- Use composition over inheritance
- Implemente funções puras sempre que possível
- Mantenha funções focadas em uma única responsabilidade
- Use dependency injection implícita (parâmetros opcionais)

## Segurança e Robustez

### Validação de Entrada

- **SEMPRE** valide parâmetros de entrada
- Use type guards para verificação de tipos em runtime
- Sanitize inputs que serão usados em regex
- **NUNCA** execute código dinâmico sem validação

### Manipulação DOM Segura

- **SEMPRE** verifique se elementos existem antes de acessá-los
- Use `getAttribute()` ao invés de acesso direto a propriedades
- Implemente timeouts para operações assíncronas
- **NUNCA** modifique DOM global sem restaurar estado original

## Performance e Otimização

### Busca de Elementos

- Use `getElementsByTagName()` para performance quando apropriado
- Limite escopo de busca com parâmetro `from`
- Implemente early return em loops de validação
- Cache elementos quando possível dentro do mesmo contexto

### Operações Assíncronas

- Use `Promise<T>` para operações que podem falhar
- Implemente timeouts configuráveis
- **SEMPRE** cleanup resources em caso de timeout
- Use `await` ao invés de `.then()` para melhor legibilidade

## Testes e Qualidade

### Cobertura de Código

- Mínimo 80% de cobertura para funções core
- Teste cenários de erro e edge cases
- Mock DOM APIs em testes unitários
- Use factories para criar test data consistente

### Debugging e Logging

- Use logs estruturados com emojis para categorização
- Log timing de operações críticas
- **SEMPRE** log contexto útil em caso de falha
- Use `console.group()` para agrupar logs relacionados

## APIs e Integrações

### API Global

- Exponha APIs no `window` object apenas quando necessário
- Use TypeScript declarations para APIs globais
- Implemente error handling gracioso em APIs públicas
- **SEMPRE** documente APIs públicas com JSDoc

### Monaco Editor Integration

- Priorize APIs oficiais sobre hacks DOM
- Implemente multiple fallback strategies
- Sincronize estado visual após modificações programáticas
- Handle diferentes versões do Monaco graciosamente

## Exemplos de Implementação

### Função de Busca Padrão

```typescript
const findElementByHierarchy = (
  hierarchy: TagWithAttributes[],
  from: HTMLElement | Element = document.body,
): HTMLElement | null => {
  // Implementação com early returns e validação
};
```

### Helper com Error Handling

```typescript
export const helperFunction = async (param: string): Promise<boolean> => {
  try {
    // Implementação
    return true;
  } catch (error) {
    console.error('Contexto específico do erro:', error);
    return false;
  }
};
```

### Seletor Reutilizável

```typescript
const specificSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [{ attribute: 'class', value: '^monaco-.*', isRegex: true }],
  },
];

export default specificSelector;
```

## Manutenção e Evolução

### Versionamento

- Use semantic versioning estritamente
- Document breaking changes no changelog
- Mantenha backward compatibility quando possível
- **SEMPRE** teste migrations entre versões

### Documentação

- **SEMPRE** atualize README.md com novas features
- Use JSDoc para todas as funções públicas
- Documente padrões de uso e edge cases
- Inclua exemplos de código funcionais
