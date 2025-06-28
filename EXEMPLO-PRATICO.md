# 🎯 Exemplo Prático: Usando o Controle de Dropdowns

## Cenário: Automação Completa do Copilot

Vamos criar um exemplo prático de como usar as novas funcionalidades de dropdown junto com a inserção de texto.

### 1. Carregar o Sistema

```javascript
// 1. Copie todo o conteúdo do arquivo dist/index.js
// 2. Cole no console do DevTools do VS Code
// 3. Você deve ver:

🚀 Iniciando automação Copilot (versão otimizada para Monaco)...

✅ Sistema pronto!
  copilot("quanto é 1 + 1 ?") - Insere texto e funciona na primeira tentativa
  dropdown.trigger("agent") - Abre dropdown de agente
  dropdown.trigger("model") - Abre dropdown de modelo
  dropdown.list() - Lista dropdowns disponíveis
```

### 2. Descobrir Dropdowns Disponíveis

```javascript
// Lista todos os dropdowns
const dropdowns = dropdown.list();

// Resultado típico:
📋 Listando dropdowns disponíveis...
🔍 Buscando dropdowns do Monaco...
✅ Dropdown encontrado - Tipo: agent, Label: "Agent"
✅ Dropdown encontrado - Tipo: model, Label: "Claude Sonnet 4"
🔍 Total de dropdowns encontrados: 2
📋 Dropdowns disponíveis:
  1. Tipo: agent | Label: "Agent" | Status: ▶️ Fechado
  2. Tipo: model | Label: "Claude Sonnet 4" | Status: ▶️ Fechado
```

### 3. Mudar o Modo do Copilot

```javascript
// Abre o dropdown de modo/agente
await dropdown.trigger("agent");

// Resultado:
🔽 Executando comando dropdown...
🎯 Acionando dropdown do tipo: "agent"
🔍 Buscando dropdowns do Monaco...
✅ Dropdown encontrado - Tipo: agent, Label: "Agent"
✅ Dropdown encontrado - Tipo: model, Label: "Claude Sonnet 4"
🔍 Total de dropdowns encontrados: 2
🎯 Acionando dropdown: agent - "Agent"
✅ Dropdown aberto com sucesso via click

// Agora você pode clicar manualmente na opção desejada
```

### 4. Trocar o Modelo de IA

```javascript
// Abre o dropdown de modelo
await dropdown.trigger("model");

// Resultado:
🔽 Executando comando dropdown...
🎯 Acionando dropdown do tipo: "model"
🔍 Buscando dropdowns do Monaco...
✅ Dropdown encontrado - Tipo: agent, Label: "Agent"
✅ Dropdown encontrado - Tipo: model, Label: "Claude Sonnet 4"
🔍 Total de dropdowns encontrados: 2
🎯 Acionando dropdown: model - "Claude Sonnet 4"
✅ Dropdown aberto com sucesso via click

// Agora você pode selecionar outro modelo (GPT-4, etc.)
```

### 5. Inserir Pergunta Automaticamente

```javascript
// Agora insere uma pergunta
await copilot("Como implementar autenticação JWT em Node.js?");

// Resultado:
📤 Executando comando copilot...
📝 Inserindo: "Como implementar autenticação JWT em Node.js?"
✅ Instância Monaco encontrada - sincronizando estado
✅ Texto inserido com sucesso!
```

## 🔄 Workflow Completo Automatizado

```javascript
// Função helper para workflow completo
async function copilotWorkflow(modelType, question) {
  console.log(`🎯 Iniciando workflow: ${modelType} -> "${question}"`);

  // 1. Lista dropdowns disponíveis
  const available = dropdown.list();

  // 2. Se especificado, tenta trocar modelo
  if (modelType && modelType !== 'current') {
    const success = await dropdown.trigger('model');
    if (success) {
      console.log(
        '⚠️ Dropdown aberto - selecione o modelo manualmente e pressione Enter quando pronto',
      );
      // Aqui você selecionaria o modelo desejado manualmente
    }
  }

  // 3. Aguarda um pouco para estabilizar
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 4. Insere a pergunta
  const inserted = await copilot(question);

  if (inserted) {
    console.log('✅ Workflow completo executado com sucesso!');
  } else {
    console.error('❌ Falha no workflow');
  }

  return inserted;
}

// Uso do workflow
await copilotWorkflow('claude', 'Explique como funciona React Hooks');
```

## 🎪 Casos de Uso Avançados

### Teste A/B com Diferentes Modelos

```javascript
async function testModels(question) {
  console.log('🧪 Testando diferentes modelos...');

  // Lista modelos disponíveis
  dropdown.list();

  // Teste com primeiro modelo
  await dropdown.trigger('model');
  // (selecionar modelo 1 manualmente)
  await copilot(`[Modelo 1] ${question}`);

  // Aguarda resposta...
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Teste com segundo modelo
  await dropdown.trigger('model');
  // (selecionar modelo 2 manualmente)
  await copilot(`[Modelo 2] ${question}`);
}

await testModels('Qual a melhor arquitetura para microserviços?');
```

### Verificação de Estado

```javascript
// Função para verificar se dropdowns estão funcionando
function healthCheck() {
  console.log('🏥 Executando health check...');

  const dropdowns = dropdown.list();

  if (dropdowns.length === 0) {
    console.error('❌ Nenhum dropdown encontrado!');
    return false;
  }

  console.log(`✅ ${dropdowns.length} dropdown(s) encontrado(s)`);

  // Testa cada dropdown
  dropdowns.forEach(async (d, index) => {
    console.log(`🔍 Testando dropdown ${index + 1}: ${d.type}`);
    const success = await dropdown.trigger(d.type);
    console.log(`${success ? '✅' : '❌'} Dropdown ${d.type}: ${success ? 'OK' : 'FALHA'}`);
  });

  return true;
}

healthCheck();
```

## 🚨 Tratamento de Erros

```javascript
async function safeDropdownTrigger(type) {
  try {
    const success = await dropdown.trigger(type);
    if (!success) {
      console.warn(`⚠️ Falha ao abrir dropdown ${type}, tentando fallback...`);
      return await dropdown.trigger('any');
    }
    return success;
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return false;
  }
}

async function safeCopilot(text) {
  try {
    const success = await copilot(text);
    if (!success) {
      console.warn('⚠️ Falha na primeira tentativa, aguardando e tentando novamente...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return await copilot(text);
    }
    return success;
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return false;
  }
}

// Uso seguro
await safeDropdownTrigger('model');
await safeCopilot('Pergunta importante aqui');
```

## 🎯 Combinações Úteis

### Sessão de Brainstorming

```javascript
const questions = [
  'Quais são as tendências de desenvolvimento web em 2025?',
  'Como implementar CI/CD moderno?',
  'Melhores práticas para performance de APIs',
];

for (const question of questions) {
  await copilot(question);
  console.log('⏳ Aguardando resposta...');
  await new Promise((resolve) => setTimeout(resolve, 3000));
}
```

### Debug e Análise

```javascript
// Monitora estado dos dropdowns
setInterval(() => {
  const dropdowns = dropdown.list();
  const open = dropdowns.filter((d) => d.button.getAttribute('aria-expanded') === 'true').length;

  if (open > 0) {
    console.log(`🔽 ${open} dropdown(s) aberto(s)`);
  }
}, 1000);
```

## 🎉 Conclusão

Com essas novas funcionalidades, você pode:

- ✅ **Controlar dropdowns programaticamente**
- ✅ **Automatizar mudanças de modelo/modo**
- ✅ **Criar workflows personalizados**
- ✅ **Testar diferentes combinações**
- ✅ **Integrar com outros scripts**

A automação agora é muito mais poderosa e flexível!
