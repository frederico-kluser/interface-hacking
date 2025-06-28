# Prompt para Debug e Troubleshooting

## Contexto

Preciso debuggar uma função que não está funcionando corretamente ou otimizar performance.

## Diagnóstico Sistemático

### 1. Verificação de Seletores

- ✅ Testou o seletor isoladamente?
- ✅ Verificou se elementos existem no DOM?
- ✅ Confirmou hierarquia em diferentes estados?
- ✅ Validou regex patterns?

### 2. Análise de Timing

- ✅ Adicionou wait() entre operações?
- ✅ Verificou se DOM estabilizou?
- ✅ Testou com timeouts maiores?
- ✅ Confirmou ordem de execução?

### 3. Error Handling

- ✅ Todos os try/catch estão capturando?
- ✅ Logs estão fornecendo contexto útil?
- ✅ Retornos são consistentes?
- ✅ Fallbacks estão funcionando?

### 4. Performance

- ✅ Usando getElementsByTagName quando possível?
- ✅ Limitando escopo de busca?
- ✅ Evitando queries desnecessárias?
- ✅ Cacheando elementos apropriadamente?

## Template de Debug

```typescript
// Adicionar logs detalhados
console.group('🐛 Debug: [FUNÇÃO_NAME]');
console.log('Input:', parameter);
console.log('DOM State:', document.readyState);
console.log('Elements found:', elements?.length || 0);

// Testar seletor isoladamente
const testElement = findElementByHierarchy(selector);
console.log('Selector test:', testElement ? '✅' : '❌');

// Timing de operações
const startTime = performance.now();
// ... operação ...
const endTime = performance.now();
console.log(`⏱️ Operation took: ${endTime - startTime}ms`);

console.groupEnd();
```

## Checklist de Otimização

- [ ] Reduced DOM queries
- [ ] Implemented early returns
- [ ] Added appropriate caching
- [ ] Optimized regex patterns
- [ ] Validated timing dependencies
- [ ] Tested edge cases
- [ ] Verified cross-browser compatibility
