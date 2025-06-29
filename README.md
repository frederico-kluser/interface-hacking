# Interface Hacking

🔍 **Biblioteca TypeScript para manipulação avançada de elementos DOM através de hierarquia**

Uma biblioteca moderna e robusta que permite encontrar elementos DOM de forma precisa usando hierarquias personalizadas e suporte a regex.

## ✨ Características

- 🚀 **TypeScript Nativo**: Escrito em TypeScript com suporte total a tipagem
- 🎯 **Busca Hierárquica**: Encontre elementos seguindo uma hierarquia específica de tags
- 🔄 **Suporte a Regex**: Use expressões regulares para busca avançada de atributos
- ⏱️ **Busca Assíncrona**: Aguarde elementos aparecerem com timeout configurável
- 🌊 **Node.js 24+**: Aproveita o suporte nativo ao TypeScript do Node.js
- 📦 **ESM**: Módulos ES nativos
- 🛡️ **Type-Safe**: Totalmente tipado com TypeScript

## 🚀 Instalação

```bash
npm install interface-hacking
```

## 📋 Requisitos

- Node.js 24.0.0 ou superior
- TypeScript 5.6.0 ou superior (para desenvolvimento)

## 🔧 Uso

### Buscar um único elemento

```typescript
import { findElementByHierarchy, type TagWithAttributes } from 'interface-hacking';

const hierarchy: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [{ attribute: 'class', value: 'container' }],
  },
  {
    tag: 'button',
    attributes: [{ attribute: 'data-testid', value: 'submit-btn' }],
  },
];

const element = findElementByHierarchy(hierarchy);
if (element) {
  element.click();
}
```

### Buscar múltiplos elementos

```typescript
import { findElementsByHierarchy } from 'interface-hacking';

const elements = findElementsByHierarchy(hierarchy);
elements.forEach((el) => console.log(el.textContent));
```

### Aguardar elemento aparecer

```typescript
import { waitElementByHierarchy } from 'interface-hacking';

try {
  const element = await waitElementByHierarchy(hierarchy, {
    limitTime: 5000, // 5 segundos
    from: document.body,
  });

  if (element) {
    element.click();
  }
} catch (error) {
  console.error('Elemento não encontrado no tempo limite');
}
```

### Usando Regex

```typescript
const hierarchyWithRegex: TagWithAttributes[] = [
  {
    tag: 'div',
    attributes: [
      {
        attribute: 'class',
        value: '^btn-.*',
        isRegex: true,
      },
    ],
  },
];
```

### Exemplo: Manipulação de Dropdowns do Monaco/Copilot

```typescript
import {
  triggerMonacoDropdown,
  getMonacoDropdownItems,
  selectMonacoDropdownItem,
  type DropdownType,
  type DropdownItem,
} from 'interface-hacking';

// Abre o dropdown do agente Copilot e captura automaticamente os itens
async function openAndListCopilotAgents() {
  const success = await triggerMonacoDropdown('agent');

  if (success) {
    // A função automaticamente detecta e lista os itens no console
    // Aguarda um momento para os elementos carregarem
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Obtém os itens programaticamente
    const items = getMonacoDropdownItems();

    console.log('Itens disponíveis:');
    items.forEach((item) => {
      console.log(
        `- ${item.title}: ${item.description} (${item.isSelected ? 'Selecionado' : 'Disponível'})`,
      );
    });

    return items;
  }

  return [];
}

// Seleciona um modo específico
async function switchToEditMode() {
  // Primeiro abre o dropdown
  await triggerMonacoDropdown('agent');

  // Aguarda um momento para carregar
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Seleciona o modo "Edit"
  const success = await selectMonacoDropdownItem('Edit');

  if (success) {
    console.log('✅ Modo Edit ativado com sucesso!');
  } else {
    console.log('❌ Falha ao ativar modo Edit');
  }
}

// Exemplo de uso
openAndListCopilotAgents().then((items) => {
  if (items.length > 0) {
    console.log(`Encontrados ${items.length} itens no dropdown`);
  }
});
```

**Output esperado no console:**

```
🎯 Acionando dropdown do tipo: "agent"
✅ Dropdown aberto com sucesso via click direto
🎯 Monaco dropdown list-row detectado! Listando itens do dropdown:
  📋 Item 1 (data-index: 0):
    Título: "Ask"
    Descrição: ""
    Aria-label: "Ask"
    Role: "menuitemcheckbox"
    Selecionado: ❌
  📋 Item 2 (data-index: 1):
    Título: "Agent"
    Descrição: "⇧⌘I"
    Aria-label: "Agent"
    Role: "menuitemcheckbox"
    Selecionado: ✅
  📋 Item 3 (data-index: 2):
    Título: "Edit"
    Descrição: ""
    Aria-label: "Edit"
    Role: "menuitemcheckbox"
    Selecionado: ❌
🎯 Total de itens do dropdown Copilot: 3
```

## 🛠️ Desenvolvimento

### Scripts disponíveis

```bash
# Construir o projeto
npm run build

# Modo de desenvolvimento (watch)
npm run dev

# Limpar build
npm run clean

# Lint
npm run lint
npm run lint:fix

# Formatação
npm run format
npm run format:check
```

### Configuração do ambiente

O projeto está configurado com:

- **ESLint**: Linting rigoroso com regras TypeScript
- **Prettier**: Formatação automática de código
- **TypeScript**: Configuração otimizada para Node.js 24+
- **VS Code**: Configurações recomendadas incluídas

## 📝 API

### `findElementByHierarchy(hierarchy, from?)`

Busca o primeiro elemento que corresponde à hierarquia especificada.

**Parâmetros:**

- `hierarchy`: Array de `TagWithAttributes` definindo a hierarquia
- `from`: Elemento base para iniciar a busca (padrão: `document.body`)

**Retorna:** `HTMLElement | null`

### `findElementsByHierarchy(hierarchy, from?)`

Busca todos os elementos que correspondem à hierarquia especificada.

**Parâmetros:**

- `hierarchy`: Array de `TagWithAttributes` definindo a hierarquia
- `from`: Elemento base para iniciar a busca (padrão: `document.body`)

**Retorna:** `HTMLElement[]`

### `waitElementByHierarchy(hierarchy, config?)`

Aguarda um elemento aparecer no DOM.

**Parâmetros:**

- `hierarchy`: Array de `TagWithAttributes` definindo a hierarquia
- `config`: Configuração opcional:
  - `limitTime`: Tempo limite em ms (padrão: 10000)
  - `from`: Elemento base (padrão: `document.body`)

**Retorna:** `Promise<HTMLElement | null>`

### Tipos

```typescript
interface TagAttribute {
  attribute: string;
  value: string;
  isRegex?: boolean;
}

interface TagWithAttributes {
  tag: string;
  attributes: TagAttribute[];
}
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 🔧 Configuração do Projeto

Este projeto utiliza as melhores práticas modernas:

- **Node.js 24+** com suporte nativo ao TypeScript
- **ESM** (ES Modules) como padrão
- **Configuração rigorosa do TypeScript** com todas as verificações ativadas
- **ESLint e Prettier** integrados
- **VS Code** configurado com extensões recomendadas
