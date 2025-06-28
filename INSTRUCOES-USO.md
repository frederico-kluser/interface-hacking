# 🚀 Como usar a Automação Copilot no DevTools

## 📋 Instruções Passo a Passo

### 1. Abrir o DevTools no VS Code

- Pressione `Cmd+Shift+P` (macOS) ou `Ctrl+Shift+P` (Windows/Linux)
- Digite: `Developer: Toggle Developer Tools`
- Navegue até a aba **Console**

### 2. Carregar o Script

- Copie todo o conteúdo do arquivo `dist/index.js`
- Cole no console do DevTools
- Pressione Enter

### 3. Verificar se Carregou

Você deve ver uma mensagem similar a:

```
🚀 Iniciando automação Copilot (versão otimizada para Monaco)...

✅ Sistema pronto!
  copilot("quanto é 1 + 1 ?") - Insere texto e funciona na primeira tentativa
  📋 Métodos disponíveis:
    1. Monaco Editor API (direto)
    2. Native Edit Context
    3. IME Textarea
    4. Simulação de digitação
    5. ContentEditable
    6. Clipboard (fallback)
```

### 4. Usar a Função

```javascript
// Exemplo básico
await copilot('Como criar uma API REST em Node.js?');

// Exemplo com pergunta mais específica
await copilot('Crie uma função TypeScript que valida email usando regex');

// Exemplo para refatoração
await copilot('Refatore este código para usar async/await');
```

## ✅ Vantagens da Nova Versão

### Antes (Problema):

```javascript
// Primeira chamada - texto aparecia ao lado do placeholder ❌
await copilot('minha pergunta');

// Segunda chamada - finalmente funcionava ✅
await copilot('minha pergunta');
```

### Agora (Solução):

```javascript
// Uma única chamada - funciona perfeitamente ✅
await copilot('minha pergunta');
```

## 🔧 Debugging

### Logs Detalhados

O sistema mostra logs detalhados para debugging:

```javascript
📝 Inserindo: "Como criar uma função assíncrona?"
✅ Instância Monaco encontrada - sincronizando estado
✅ Texto inserido com sucesso!
```

### Se Algo Der Errado

```javascript
📝 Inserindo: "teste"
⚠️ Foco pode não ter sido estabelecido corretamente
🔄 Tentando simulação de digitação...
✅ Texto inserido com sucesso!
```

## 🎯 Métodos de Inserção (em ordem de prioridade)

1. **Monaco Editor API**: Acesso direto à instância do editor
2. **Native Edit Context**: Interage com o elemento de entrada real
3. **IME Textarea**: Manipula a textarea específica do Monaco
4. **Simulação de Digitação**: Simula digitação natural
5. **ContentEditable**: Manipula elementos editáveis
6. **Clipboard**: Fallback usando eventos de paste

## 🛠️ Troubleshooting

### Problema: "Editor do Copilot não encontrado"

- **Solução**: Certifique-se de que o chat do Copilot está aberto e visível
- Clique na área de input do Copilot antes de executar

### Problema: Texto não aparece

- **Solução**: Verifique se o Copilot está ativo
- Tente recarregar a página do VS Code e executar novamente

### Problema: Script não carrega

- **Solução**: Copie o arquivo `dist/index.js` completo
- Certifique-se de colar no console correto (DevTools do VS Code)

## 🎪 Funcionalidades Avançadas

### Verificar Status do Sistema

```javascript
// Verificar se a função está disponível
typeof window.copilot === 'function';
// Retorna: true se carregado corretamente
```

### Debug Manual

```javascript
// Verificar se consegue encontrar o editor
import { findCopilotEditor } from './helpers/findCopilotEditor.js';
const editor = findCopilotEditor();
console.log('Editor encontrado:', !!editor);
```

## 🎉 Sucesso!

Quando tudo estiver funcionando, você verá:

- ✅ Texto inserido na primeira tentativa
- 🚀 Resposta mais rápida do Copilot
- 🎯 Automação confiável e consistente

---

**💡 Dica**: Salve este script como snippet no DevTools para reutilização rápida!
