# 🚨 Pessoas Desaparecidas - Mato Grosso

Sistema web para consulta e cadastro de informações sobre pessoas desaparecidas no estado de Mato Grosso, desenvolvido para a Polícia Civil.

## 👤 Dados do Desenvolvedor

**Nome:** José Ricardo Borges Soares da Silva  
**Email:** borges2001jose@gmail.com  
**Telefone:** (65) 99937-1811

## 📋 Sobre o Projeto

Sistema desenvolvido em Next.js 14 com TypeScript, integrado à API da Polícia Civil de Mato Grosso para facilitar a busca e visualização de informações sobre pessoas desaparecidas.

### 🎯 Funcionalidades

- **Busca de Pessoas**: Filtros por nome, sexo, status e data
- **Visualização Detalhada**: Informações completas de cada caso
- **Formulário de Informações**: Possibilidade de enviar informações sobre desaparecidos
- **Interface Responsiva**: Design moderno e adaptável
- **Status da API**: Monitoramento em tempo real da conectividade

### 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **API**: Integração com API da Polícia Civil MT
- **Containerização**: Docker, Docker Compose
- **Deploy**: Configuração para produção

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ instalado
- Docker Desktop instalado
- Git instalado

### 📥 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd pessoas-desaparecidas
```

### 🐳 2. Execução com Docker (Recomendado)

#### Build e Execução:

```bash
# Build da imagem e execução
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Parar aplicação
docker-compose down
```

#### Acesso:

- **URL**: http://localhost:3000
- **Status**: Container rodando em background

### 💻 3. Execução Local (Desenvolvimento)

#### Instalar Dependências:

```bash
npm install
```

#### Executar em Modo Desenvolvimento:

```bash
npm run dev
```

#### Acesso:

- **URL**: http://localhost:3000
- **Hot Reload**: Ativado

## 🧪 Testes

### 1. Teste de Funcionalidade

#### Navegação Principal:

- ✅ Acesse a página inicial
- ✅ Teste os filtros de busca
- ✅ Navegue pelos cards de pessoas
- ✅ Acesse detalhes de uma pessoa

#### Formulário de Informações:

- ✅ Acesse `/informar/[ocoId]`
- ✅ Preencha o formulário
- ✅ Teste upload de fotos
- ✅ Envie informações

#### Páginas Específicas:

- ✅ `/como-ajudar` - Página de orientações
- ✅ `/pessoa/[id]` - Detalhes da pessoa
- ✅ Filtros de busca funcionais

### 2. Teste de Responsividade

#### Dispositivos:

- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

#### Navegadores:

- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### 3. Teste de Performance

#### Métricas:

- ✅ Tempo de carregamento < 3s
- ✅ Lighthouse Score > 90
- ✅ Imagens otimizadas
- ✅ Compressão Gzip ativa

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://abitus-api.geia.vip
NEXT_PUBLIC_USE_API_MOCK=false

# Application
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Configuração Docker

#### Estrutura de Arquivos:

```
├── Dockerfile              # Configuração da imagem
├── docker-compose.yml      # Orquestração dos serviços
├── .dockerignore           # Arquivos ignorados no build
├── next.config.mjs         # Configuração Next.js
└── README-Docker.md        # Documentação Docker
```

## 📊 Monitoramento

### Health Check

- **Endpoint**: http://localhost:3000/health
- **Intervalo**: 30 segundos
- **Timeout**: 10 segundos

### Logs

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs específicos
docker-compose logs app
```

### Status da API

- Monitoramento automático da conectividade
- Indicador visual no footer
- Atualização a cada 30 segundos

## 🚀 Deploy em Produção

### 1. Build de Produção

```bash
# Build otimizado
npm run build

# Verificar build
npm run start
```

### 2. Deploy com Docker

```bash
# Build da imagem
docker-compose build

# Executar em produção
docker-compose up -d
```

### 3. Configurações de Produção

- ✅ Compressão Gzip ativa
- ✅ Headers de segurança configurados
- ✅ Cache otimizado
- ✅ Imagens otimizadas

## 🐛 Troubleshooting

### Problemas Comuns

#### Container não inicia:

```bash
# Verificar logs
docker-compose logs

# Rebuild completo
docker-compose down
docker-compose up --build -d
```

#### Erro de build:

```bash
# Limpar cache
docker system prune -f

# Rebuild sem cache
docker-compose build --no-cache
```

#### Porta ocupada:

```bash
# Verificar processos
netstat -tulpn | grep :3000

# Parar containers
docker-compose down
```

## 📱 Contato e Suporte

**Desenvolvedor:** José Ricardo Borges Soares da Silva  
**Email:** borges2001jose@gmail.com  
**Telefone:** (65) 99937-1811

### Relatório de Bugs

Para reportar problemas, inclua:

- Descrição detalhada do erro
- Passos para reproduzir
- Logs do console
- Informações do navegador

## 📄 Licença

Este projeto foi desenvolvido para a Polícia Civil do Estado de Mato Grosso. Todos os direitos reservados.

## 🙏 Agradecimentos

- Polícia Civil do Estado de Mato Grosso
- Equipe de desenvolvimento
- Comunidade Next.js
- Contribuidores do projeto

---

**Versão:** 2.1.0  
**Última atualização:** Janeiro 2025  
**Status:** ✅ Produção
