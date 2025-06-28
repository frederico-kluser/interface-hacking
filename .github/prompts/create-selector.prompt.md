# Prompt para Criação de Novo Seletor

## Contexto

Preciso criar um novo seletor DOM para encontrar elementos específicos no Monaco Editor / VS Code.

## Entrada Necessária

- **Elemento alvo**: Descrição do elemento que preciso encontrar
- **Contexto de uso**: Onde/quando este seletor será usado
- **Atributos únicos**: Quais atributos diferenciam este elemento

## Template de Resposta

1. Crie arquivo em `/src/selectors/` com nome kebab-case
2. Use a estrutura padrão TagWithAttributes[]
3. Implemente hierarquia específica mas robusta
4. Adicione comentários explicando cada nível
5. Teste mentalmente com diferentes estados do editor

## Exemplo de Uso

```typescript
import type TagWithAttributes from '../types/TagWithAttributes.js';

/**
 * Seletor para encontrar [DESCRIÇÃO DO ELEMENTO]
 * Usado em: [CONTEXTO DE USO]
 * Válido quando: [CONDIÇÕES]
 */
const elementSelector: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [{ attribute: 'class', value: 'monaco-editor' }],
  },
  {
    tag: 'textarea',
    attributes: [{ attribute: 'class', value: '^inputarea.*', isRegex: true }],
  },
];

export default elementSelector;
```

## Validação

- ✅ Nome descritivo do arquivo e variável
- ✅ Hierarquia específica o suficiente
- ✅ Comentários explicativos
- ✅ Export default
- ✅ Import de tipos correto
