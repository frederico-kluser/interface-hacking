# Interface Hacking - Automação Copilot

🤖 **Sistema de automação para GitHub Copilot no VS Code**

Uma biblioteca otimizada para interagir programaticamente com o editor do GitHub Copilot, resolvendo problemas comuns de inserção de texto em editores Monaco.

## ✨ O Problema Resolvido

Ao interagir com o GitHub Copilot via DevTools, era comum precisar chamar a função **duas vezes** para que o texto fosse inserido corretamente:

- **1ª chamada**: Texto aparecia ao lado do placeholder
- **2ª chamada**: Texto era inserido corretamente

Este projeto resolve esse problema implementando múltiplos métodos de inserção de texto que funcionam **na primeira tentativa**.

## 🔧 Métodos de Inserção Implementados

### 1. 🎯 Monaco Editor API (Direto)

- Acessa diretamente a instância do Monaco Editor
- Usa `executeEdits()` e `setValue()` para manipular o modelo
- Sincroniza o estado interno do editor

### 2. 🎪 Native Edit Context

- Interage com o elemento `native-edit-context`
- Elemento real que recebe a entrada do usuário no Monaco
- Simula eventos de teclado e clipboard

### 3. 📝 IME Textarea

- Busca pela textarea específica `ime-text-area`
- Manipula diretamente o valor da textarea
- Dispara eventos de input e change

### 4. ⌨️ Simulação de Digitação

- Simula digitação caractere por caractere
- Dispara eventos de keyboard, keypress e input
- Comportamento mais natural

### 5. 📄 ContentEditable

- Manipula elementos com `contentEditable`
- Usa Selection API para controle preciso
- Executa comandos de edição do navegador

### 6. 📋 Clipboard (Fallback)

- Último recurso usando eventos de paste
- Funciona quando outros métodos falham

## 🚀 Como Usar

### No DevTools do VS Code:

```javascript
// Carregar o script (uma vez)
// Cole o código compilado no console

// Usar a API global
await copilot('Como criar uma função assíncrona em TypeScript?');

// Resultado: texto inserido na primeira tentativa ✅
```

### Desenvolvimento:

```bash
# Instalar dependências
npm install

# Compilar o projeto
npm run build

# O arquivo dist/index.js contém o código para usar no DevTools
```

## 🏗️ Arquitetura

```
src/
├── index.ts                     # Ponto de entrada e API global
├── core/                        # Funções principais de busca DOM
│   ├── findElementByHierarchy.ts
│   ├── findElementsByHierarchy.ts
│   └── waitElementByHierarchy.ts
├── helpers/                     # Funções auxiliares
│   ├── findCopilotEditor.ts    # Localiza o editor do Copilot
│   ├── focusCopilotEditor.ts   # Estabelece foco correto
│   ├── insertTextInCopilot.ts  # Função principal de inserção
│   ├── syncMonacoState.ts      # Sincronização do Monaco Editor
│   └── wait.ts                 # Utilitário de delay
├── selectors/                  # Seletores DOM hierárquicos
│   ├── monaco-editors.ts
│   ├── native-edit-context.ts
│   ├── interactive-view-line.ts
│   └── all-textareas.ts
└── types/                      # Definições TypeScript
    ├── MonacoEditor.ts         # Interfaces do Monaco Editor
    ├── TagAttribute.ts
    └── TagWithAttributes.ts
```

## 🎯 Características Técnicas

- **TypeScript Nativo**: Totalmente tipado com interfaces para Monaco Editor
- **Múltiplos Métodos**: 6 estratégias diferentes de inserção de texto
- **Detecção Inteligente**: Localiza automaticamente o editor correto
- **Sincronização de Estado**: Força atualização do estado interno do Monaco
- **Foco Otimizado**: Estabelece foco adequado antes da inserção
- **Error Handling**: Tratamento robusto de erros com fallbacks

## 🔬 Como Funciona

1. **Detecção do Editor**: Localiza o container do Monaco Editor do Copilot
2. **Estabelecimento de Foco**: Garante que o editor está ativo e pronto
3. **Tentativa Hierárquica**: Executa métodos de inserção em ordem de prioridade
4. **Sincronização**: Força atualização visual e de estado
5. **Verificação**: Confirma se a inserção foi bem-sucedida

## 🧪 Debugging

O sistema inclui logging detalhado para debugging:

```javascript
// Ativar logs detalhados no console
await copilot('teste');

// Saída típica:
// 📝 Inserindo: "teste"
// ✅ Instância Monaco encontrada - sincronizando estado
// ✅ Foco estabelecido: DIV monaco-editor
```

## 🛠️ Requisitos

- VS Code com GitHub Copilot ativo
- Acesso ao DevTools do VS Code
- Monaco Editor versão suportada pelo VS Code

## 📈 Benefícios

- ✅ **Funciona na primeira tentativa** - sem necessidade de chamar duas vezes
- ⚡ **Performance otimizada** - métodos ordenados por eficiência
- 🔒 **Type-safe** - interfaces TypeScript para Monaco Editor
- 🔄 **Múltiplos fallbacks** - continua funcionando mesmo com mudanças no VS Code
- 🎯 **Foco inteligente** - estabelece foco correto automaticamente

## 🤝 Contribuição

Contribuições são bem-vindas! Este projeto resolve um problema real enfrentado ao automatizar o GitHub Copilot.

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

---

**Nota**: Este projeto é para fins educacionais e de automação pessoal. Use com responsabilidade.
