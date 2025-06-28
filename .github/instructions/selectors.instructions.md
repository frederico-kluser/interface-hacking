# Instruções para Seletores

## Seletores DOM (`/src/selectors/`)

### Estrutura Padrão

```typescript
import type TagWithAttributes from '../types/TagWithAttributes.js';

const selectorName: TagWithAttributes[] = [
  {
    tag: 'element',
    attributes: [
      { attribute: 'class', value: 'specific-class' },
      { attribute: 'data-attr', value: '^pattern.*', isRegex: true },
    ],
  },
];

export default selectorName;
```

### Nomenclatura

- Use nomes descritivos: `monacoEditorsSelector`
- Inclua contexto: `allTextareasSelector` vs `monacoTextareaSelector`
- Use kebab-case para arquivos: `interactive-view-line.ts`

### Padrões de Seleção

- **SEMPRE** seja específico o suficiente para evitar falsos positivos
- Use regex apenas quando necessário
- Teste padrões em diferentes estados do editor
- Documente quando/onde o seletor é válido

### Hierarquias Complexas

- Mantenha hierarquias simples quando possível
- Use no máximo 3-4 níveis de profundidade
- Prefira atributos únicos (IDs, data-attributes)
- **SEMPRE** teste com diferentes temas do VS Code
