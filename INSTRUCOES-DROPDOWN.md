# 🔽 Como usar o Controle de Dropdowns do Monaco

## 📋 Nova Funcionalidade: Controle de Dropdowns

A partir desta atualização, o sistema de automação do Copilot inclui controle programático dos dropdowns da toolbar do Monaco Editor, como o seletor de agente e modelo.

## 🎯 HTML Estrutura Suportada

O sistema detecta automaticamente dropdowns com esta estrutura:

```html
<div class="monaco-toolbar chat-input-toolbar">
  <div class="monaco-action-bar">
    <ul class="actions-container" role="toolbar">
      <li class="action-item chat-modelPicker-item" role="presentation">
        <div class="monaco-dropdown">
          <div class="dropdown-label">
            <a
              class="action-label"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              aria-label="Set Mode (⌘.) - Agent"
            >
              <span class="chat-model-label">Agent</span>
              <span class="codicon codicon-chevron-down"></span>
            </a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
```

## 🚀 Como Usar

### 1. Carregar o Script

```javascript
// Copie e cole o código compilado do dist/index.js no console do DevTools
```

### 2. Verificar se Carregou

Você deve ver as novas funções na mensagem de inicialização:

```
🚀 Iniciando automação Copilot (versão otimizada para Monaco)...

✅ Sistema pronto!
  copilot("quanto é 1 + 1 ?") - Insere texto e funciona na primeira tentativa
  dropdown.trigger("agent") - Abre dropdown de agente
  dropdown.trigger("model") - Abre dropdown de modelo
  dropdown.list() - Lista dropdowns disponíveis
```

### 3. Comandos Disponíveis

#### 📋 Listar Dropdowns Disponíveis

```javascript
// Lista todos os dropdowns encontrados
dropdown.list();

// Resultado típico:
// 📋 Dropdowns disponíveis:
//   1. Tipo: agent | Label: "Agent" | Status: ▶️ Fechado
//   2. Tipo: model | Label: "Claude Sonnet 4" | Status: ▶️ Fechado
```

#### 🔽 Acionar Dropdowns Específicos

```javascript
// Abre o dropdown de agente/modo
await dropdown.trigger('agent');

// Abre o dropdown de modelo
await dropdown.trigger('model');

// Abre qualquer dropdown disponível (primeiro encontrado)
await dropdown.trigger('any');
// ou simplesmente:
await dropdown.trigger();
```

## 🎯 Tipos de Dropdown Suportados

### 1. **Agent/Mode Dropdown**

- **Tipo**: `"agent"`
- **Identificação**: aria-label contém "Agent" ou "Mode"
- **Função**: Alternar entre diferentes modos do Copilot

### 2. **Model Dropdown**

- **Tipo**: `"model"`
- **Identificação**: aria-label contém "Model" ou "Pick Model"
- **Função**: Selecionar modelo de IA (ex: Claude, GPT-4, etc.)

### 3. **Any Dropdown**

- **Tipo**: `"any"`
- **Função**: Aciona o primeiro dropdown encontrado

## 🔧 Múltiplos Métodos de Acionamento

O sistema implementa 3 métodos de fallback para garantir compatibilidade:

### Método 1: Click Direto

```javascript
button.click();
```

### Método 2: Eventos de Mouse

```javascript
button.dispatchEvent(new MouseEvent('mousedown', {...}))
button.dispatchEvent(new MouseEvent('click', {...}))
button.dispatchEvent(new MouseEvent('mouseup', {...}))
```

### Método 3: Eventos de Teclado

```javascript
button.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', ...}))
```

## 🧪 Debugging

### Logs Detalhados

O sistema mostra logs detalhados para debugging:

```javascript
await dropdown.trigger('agent');

// Saída típica:
// 🔽 Executando comando dropdown...
// 🎯 Acionando dropdown do tipo: "agent"
// 🔍 Buscando dropdowns do Monaco...
// ✅ Dropdown encontrado - Tipo: agent, Label: "Agent"
// 🔍 Total de dropdowns encontrados: 2
// 🎯 Acionando dropdown: agent - "Agent"
// ✅ Dropdown aberto com sucesso via click
```

### Se Algo Der Errado

```javascript
await dropdown.trigger('inexistente');

// Saída:
// ❌ Dropdown do tipo "inexistente" não encontrado
// Dropdowns disponíveis: ['agent (Agent)', 'model (Claude Sonnet 4)']
```

## 🔄 Integração com Função copilot()

Você pode combinar as funcionalidades:

```javascript
// 1. Abre o dropdown de modelo
await dropdown.trigger('model');

// 2. (Usuário seleciona um modelo diferente)

// 3. Insere uma pergunta
await copilot('Explique como funciona machine learning');
```

## 📊 Estados do Dropdown

O sistema verifica automaticamente o estado via `aria-expanded`:

- **▶️ Fechado**: `aria-expanded="false"` ou ausente
- **🔽 Aberto**: `aria-expanded="true"`

## ⚠️ Observações Importantes

1. **Compatibilidade**: Funciona com a estrutura atual do VS Code/Copilot
2. **Detecção Automática**: Identifica dropdowns baseado em classes CSS e aria-labels
3. **Fallback Robusto**: Múltiplos métodos garantem funcionamento mesmo com mudanças na UI
4. **Type-Safe**: Totalmente tipado com TypeScript

## 🛠️ Troubleshooting

### Problema: "Nenhum dropdown encontrado"

**Solução**:

- Verifique se a toolbar do Copilot está visível
- Confirme que você está em uma sessão de chat ativa
- Execute `dropdown.list()` para ver se há dropdowns detectados

### Problema: "Dropdown não abre"

**Solução**:

- Tente focar manualmente no dropdown primeiro
- Verifique se não há overlays ou modais bloqueando
- O sistema tentará 3 métodos automaticamente

### Problema: "Tipo não encontrado"

**Solução**:

- Use `dropdown.list()` para ver tipos disponíveis
- Experimente `dropdown.trigger("any")` como fallback

## 🎉 Próximos Passos

Esta funcionalidade abre possibilidades para automação mais avançada:

1. **Seleção Automática de Modelos**
2. **Mudança de Modo Programática**
3. **Workflows Automatizados**
4. **Testing de Interface**

---

**Nota**: Esta funcionalidade é experimental e pode necessitar ajustes conforme o VS Code/Copilot evolui.
