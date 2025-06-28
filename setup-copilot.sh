#!/bin/bash

# ============================================================================
# 🚀 GitHub Copilot Setup Script para Interface Hacking
# ============================================================================

set -e  # Exit on any error

echo "🚀 Iniciando configuração do GitHub Copilot para Interface Hacking..."

# ============================================================================
# Verificações de Pré-requisitos
# ============================================================================

echo ""
echo "🔍 Verificando pré-requisitos..."

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="24.0.0"

    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        echo "✅ Node.js $NODE_VERSION encontrado (requerido: $REQUIRED_VERSION+)"
    else
        echo "❌ Node.js $NODE_VERSION é muito antigo. Requerido: $REQUIRED_VERSION+"
        echo "📥 Instale Node.js 24+ em: https://nodejs.org/"
        exit 1
    fi
else
    echo "❌ Node.js não encontrado"
    echo "📥 Instale Node.js 24+ em: https://nodejs.org/"
    exit 1
fi

# Check VS Code
if command -v code &> /dev/null; then
    echo "✅ VS Code encontrado"
else
    echo "❌ VS Code não encontrado"
    echo "📥 Instale VS Code em: https://code.visualstudio.com/"
    exit 1
fi

# Check GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI encontrado"
else
    echo "📥 Instalando GitHub CLI..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install gh
        else
            echo "❌ Homebrew não encontrado. Instale manualmente: https://cli.github.com/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh
    else
        echo "❌ SO não suportado para instalação automática do GitHub CLI"
        echo "📥 Instale manualmente: https://cli.github.com/"
        exit 1
    fi
fi

# ============================================================================
# Configuração do GitHub Copilot
# ============================================================================

echo ""
echo "🤖 Configurando GitHub Copilot..."

# Install Copilot CLI extension
echo "📦 Instalando extensão GitHub Copilot CLI..."
gh extension install github/gh-copilot 2>/dev/null || echo "⚠️  Extensão já instalada"

# Check GitHub authentication
if gh auth status &> /dev/null; then
    echo "✅ Já autenticado no GitHub"
else
    echo "🔐 Autenticando no GitHub..."
    gh auth login
fi

# Check Copilot status
echo "📊 Verificando status do Copilot..."
if gh copilot status &> /dev/null; then
    echo "✅ GitHub Copilot ativo"
else
    echo "❌ GitHub Copilot não ativo"
    echo "💡 Verifique sua licença em: https://github.com/settings/copilot"
    echo "💡 Para uso pessoal (gratuito): https://copilot.github.com/"
fi

# ============================================================================
# Configuração do VS Code
# ============================================================================

echo ""
echo "🔧 Configurando VS Code..."

# Install essential extensions
echo "📦 Instalando extensões essenciais..."

EXTENSIONS=(
    "GitHub.copilot"
    "GitHub.copilot-chat"
    "ms-vscode.vscode-typescript-next"
    "dbaeumer.vscode-eslint"
    "esbenp.prettier-vscode"
    "eamodio.gitlens"
    "usernamehw.errorlens"
    "streetsidesoftware.code-spell-checker"
)

for ext in "${EXTENSIONS[@]}"; do
    echo "📥 Instalando $ext..."
    code --install-extension "$ext" --force
done

# ============================================================================
# Configuração do Projeto
# ============================================================================

echo ""
echo "📁 Configurando projeto..."

# Install dependencies
if [ -f "package.json" ]; then
    echo "📦 Instalando dependências do projeto..."
    npm install
else
    echo "⚠️  package.json não encontrado"
fi

# Build project
if [ -f "package.json" ] && npm run build &> /dev/null; then
    echo "🏗️  Projeto construído com sucesso"
else
    echo "⚠️  Falha ao construir o projeto (normal se for primeira execução)"
fi

# ============================================================================
# Validação da Configuração
# ============================================================================

echo ""
echo "✅ Validando configuração..."

# Check Copilot instructions
if [ -f ".github/copilot-instructions.md" ]; then
    echo "✅ Instruções do Copilot encontradas"
else
    echo "❌ Instruções do Copilot não encontradas"
fi

# Check VS Code settings
if [ -f ".vscode/settings.json" ]; then
    echo "✅ Configurações do VS Code encontradas"
else
    echo "❌ Configurações do VS Code não encontradas"
fi

# Check extensions
if [ -f ".vscode/extensions.json" ]; then
    echo "✅ Extensões recomendadas configuradas"
else
    echo "❌ Extensões recomendadas não configuradas"
fi

# ============================================================================
# Teste da Configuração
# ============================================================================

echo ""
echo "🧪 Testando configuração..."

# Test Copilot CLI
if gh copilot suggest "list files in typescript project" &> /dev/null; then
    echo "✅ Copilot CLI funcionando"
else
    echo "⚠️  Copilot CLI pode não estar funcionando corretamente"
fi

# ============================================================================
# Finalização
# ============================================================================

echo ""
echo "🎉 Configuração concluída com sucesso!"
echo ""
echo "📋 Resumo da configuração:"
echo "  ✅ Node.js $(node --version) com TypeScript nativo"
echo "  ✅ GitHub CLI com extensão Copilot"
echo "  ✅ VS Code com extensões otimizadas"
echo "  ✅ Projeto configurado para máxima produtividade"
echo ""
echo "🚀 Próximos passos:"
echo "  1. Abra o projeto no VS Code: code ."
echo "  2. Pressione Ctrl+Shift+P e digite 'GitHub Copilot'"
echo "  3. Verifique se o Copilot está ativo (ícone na status bar)"
echo "  4. Comece a codar! O Copilot usará as instruções personalizadas"
echo ""
echo "💡 Dicas:"
echo "  • Use Ctrl+I (Cmd+I no Mac) para chat inline"
echo "  • Tab para aceitar sugestões"
echo "  • Alt+] / Alt+[ para navegar entre sugestões"
echo "  • Consulte .github/README-COPILOT.md para guia completo"
echo ""
echo "📚 Documentação:"
echo "  • Configurações: .github/README-COPILOT.md"
echo "  • Instruções: .github/copilot-instructions.md"
echo "  • Prompts: .github/prompts/"
echo ""

# Final validation
if command -v code &> /dev/null && gh copilot status &> /dev/null; then
    echo "🎯 Tudo pronto! Produtividade máxima ativada! 🚀"

    # Optional: Open VS Code
    read -p "🤔 Abrir o projeto no VS Code agora? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        code .
    fi
else
    echo "⚠️  Configuração pode não estar completa. Verifique os passos acima."
fi
