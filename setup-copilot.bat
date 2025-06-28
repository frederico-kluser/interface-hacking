@echo off
setlocal enabledelayedexpansion

REM ============================================================================
REM 🚀 GitHub Copilot Setup Script para Interface Hacking (Windows)
REM ============================================================================

echo 🚀 Iniciando configuração do GitHub Copilot para Interface Hacking...

REM ============================================================================
REM Verificações de Pré-requisitos
REM ============================================================================

echo.
echo 🔍 Verificando pré-requisitos...

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado
    echo 📥 Instale Node.js 24+ em: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1 delims=v" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% encontrado

REM Check VS Code
where code >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ VS Code não encontrado
    echo 📥 Instale VS Code em: https://code.visualstudio.com/
    pause
    exit /b 1
)
echo ✅ VS Code encontrado

REM Check GitHub CLI
where gh >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 GitHub CLI não encontrado
    echo 💡 Instale via winget: winget install GitHub.cli
    echo 💡 Ou baixe em: https://cli.github.com/
    pause
    exit /b 1
)
echo ✅ GitHub CLI encontrado

REM ============================================================================
REM Configuração do GitHub Copilot
REM ============================================================================

echo.
echo 🤖 Configurando GitHub Copilot...

REM Install Copilot CLI extension
echo 📦 Instalando extensão GitHub Copilot CLI...
gh extension install github/gh-copilot 2>nul || echo ⚠️  Extensão já instalada

REM Check GitHub authentication
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Autenticando no GitHub...
    gh auth login
) else (
    echo ✅ Já autenticado no GitHub
)

REM Check Copilot status
echo 📊 Verificando status do Copilot...
gh copilot status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ GitHub Copilot não ativo
    echo 💡 Verifique sua licença em: https://github.com/settings/copilot
    echo 💡 Para uso pessoal ^(gratuito^): https://copilot.github.com/
) else (
    echo ✅ GitHub Copilot ativo
)

REM ============================================================================
REM Configuração do VS Code
REM ============================================================================

echo.
echo 🔧 Configurando VS Code...

echo 📦 Instalando extensões essenciais...

REM Install essential extensions
call :install_extension "GitHub.copilot"
call :install_extension "GitHub.copilot-chat"
call :install_extension "ms-vscode.vscode-typescript-next"
call :install_extension "dbaeumer.vscode-eslint"
call :install_extension "esbenp.prettier-vscode"
call :install_extension "eamodio.gitlens"
call :install_extension "usernamehw.errorlens"
call :install_extension "streetsidesoftware.code-spell-checker"

REM ============================================================================
REM Configuração do Projeto
REM ============================================================================

echo.
echo 📁 Configurando projeto...

REM Install dependencies
if exist "package.json" (
    echo 📦 Instalando dependências do projeto...
    npm install
) else (
    echo ⚠️  package.json não encontrado
)

REM Build project
if exist "package.json" (
    echo 🏗️  Tentando construir projeto...
    npm run build >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ Projeto construído com sucesso
    ) else (
        echo ⚠️  Falha ao construir o projeto ^(normal se for primeira execução^)
    )
)

REM ============================================================================
REM Validação da Configuração
REM ============================================================================

echo.
echo ✅ Validando configuração...

if exist ".github\copilot-instructions.md" (
    echo ✅ Instruções do Copilot encontradas
) else (
    echo ❌ Instruções do Copilot não encontradas
)

if exist ".vscode\settings.json" (
    echo ✅ Configurações do VS Code encontradas
) else (
    echo ❌ Configurações do VS Code não encontradas
)

if exist ".vscode\extensions.json" (
    echo ✅ Extensões recomendadas configuradas
) else (
    echo ❌ Extensões recomendadas não configuradas
)

REM ============================================================================
REM Teste da Configuração
REM ============================================================================

echo.
echo 🧪 Testando configuração...

gh copilot suggest "list files in typescript project" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Copilot CLI funcionando
) else (
    echo ⚠️  Copilot CLI pode não estar funcionando corretamente
)

REM ============================================================================
REM Finalização
REM ============================================================================

echo.
echo 🎉 Configuração concluída com sucesso!
echo.
echo 📋 Resumo da configuração:
for /f "tokens=*" %%i in ('node --version') do echo   ✅ Node.js %%i com TypeScript nativo
echo   ✅ GitHub CLI com extensão Copilot
echo   ✅ VS Code com extensões otimizadas
echo   ✅ Projeto configurado para máxima produtividade
echo.
echo 🚀 Próximos passos:
echo   1. Abra o projeto no VS Code: code .
echo   2. Pressione Ctrl+Shift+P e digite 'GitHub Copilot'
echo   3. Verifique se o Copilot está ativo ^(ícone na status bar^)
echo   4. Comece a codar! O Copilot usará as instruções personalizadas
echo.
echo 💡 Dicas:
echo   • Use Ctrl+I para chat inline
echo   • Tab para aceitar sugestões
echo   • Alt+] / Alt+[ para navegar entre sugestões
echo   • Consulte .github\README-COPILOT.md para guia completo
echo.
echo 📚 Documentação:
echo   • Configurações: .github\README-COPILOT.md
echo   • Instruções: .github\copilot-instructions.md
echo   • Prompts: .github\prompts\
echo.

REM Final validation and optional VS Code launch
where code >nul 2>&1 && gh copilot status >nul 2>&1
if %errorlevel% equ 0 (
    echo 🎯 Tudo pronto! Produtividade máxima ativada! 🚀
    echo.
    set /p choice="🤔 Abrir o projeto no VS Code agora? (y/N): "
    if /i "!choice!"=="y" (
        code .
    )
) else (
    echo ⚠️  Configuração pode não estar completa. Verifique os passos acima.
)

pause
exit /b 0

REM ============================================================================
REM Functions
REM ============================================================================

:install_extension
echo 📥 Instalando %~1...
code --install-extension "%~1" --force >nul 2>&1
goto :eof
