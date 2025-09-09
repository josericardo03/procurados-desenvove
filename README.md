# 🚨 Pessoas Desaparecidas - Mato Grosso

Sistema web para consulta e cadastro de informações sobre pessoas desaparecidas no estado de Mato Grosso, desenvolvido para a Polícia Civil.

## 👤 Dados do Desenvolvedor

**Nome:** José Ricardo Borges Soares da Silva  
**Email:** borges2001jose@gmail.com  
**Telefone:** (65) 99937-1811

## 📋 Sobre o Projeto

Sistema desenvolvido em Next.js 14 com TypeScript, integrado à API da Polícia Civil de Mato Grosso para facilitar a busca e visualização de informações sobre pessoas desaparecidas.

### 🎯 Funcionalidades

- **Busca de Pessoas**: Filtros por nome, sexo, status e data com paginação ≥10 itens
- **Visualização Detalhada**: Informações completas de cada caso com destaque visual de status
- **Formulário de Informações**: Envio de informações com validações, máscaras e localização automática
- **Interface Responsiva**: Design moderno e adaptável
- **Status da API**: Monitoramento em tempo real da conectividade
- **Preservação de Estado**: Filtros e página mantidos na URL para navegação/volta

### 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **API**: Integração com API da Polícia Civil MT
- **Containerização**: Docker, Docker Compose
- **Deploy**: Configuração para produção

### 🔗 API e Documentação

- **API Base URL**: `https://abitus-api.geia.vip`
- **Documentação Swagger**: [Acessar Swagger UI](https://abitus-api.geia.vip/swagger-ui.html)
- **OpenAPI Spec**: [https://abitus-api.geia.vip/v3/api-docs](https://abitus-api.geia.vip/v3/api-docs)
- **Endpoints Principais**:
  - `GET /v1/pessoas/aberto/filtro` - Listagem paginada de pessoas (≥10 itens)
  - `GET /v1/pessoas/{id}` - Detalhes de uma pessoa específica
  - `POST /v1/ocorrencias/informacoes-desaparecido` - Envio de informações
- **Cobertura de Filtros**: 100% dos filtros da API implementados
- **Paginação**: Implementação completa conforme contrato público
- **Documentação Técnica**: [Ver detalhes da integração](./docs/api-integration.md)

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

### ⚙️ 2. Configuração do Ambiente

```bash
# Copie o arquivo de exemplo de variáveis de ambiente
cp env.example .env.local

# Edite as configurações conforme necessário
nano .env.local
```

**Variáveis de ambiente disponíveis:**

- `NEXT_PUBLIC_API_BASE_URL`: URL base da API (padrão: https://abitus-api.geia.vip)
- `NEXT_PUBLIC_USE_API_MOCK`: Usar dados mock quando API estiver indisponível (padrão: false)
- `NEXT_PUBLIC_DEFAULT_PAGE_SIZE`: Tamanho padrão da paginação (padrão: 10)
- `NEXT_PUBLIC_MAX_PAGE_SIZE`: Tamanho máximo da paginação (padrão: 50)

### 🐳 3. Execução com Docker (Recomendado)

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

### 💻 4. Execução Local (Desenvolvimento)

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

#### Paginação (Requisito Obrigatório ≥10):

- ✅ **Paginação mínima**: Sistema exibe 10 itens por página por padrão
- ✅ **Seletor de tamanho**: Opções de 10, 20 e 50 itens por página
- ✅ **Preservação de estado**: Filtros e página mantidos na URL
- ✅ **Navegação funcional**: Botões anterior/próxima e números de página
- ✅ **Contador de itens**: Exibe "X de Y registros" e "Página X de Y"
- ✅ **URL compartilhável**: Links mantêm filtros e página aplicados

#### Formulário de Informações:

- ✅ Acesse `/informar/[ocoId]`
- ✅ Preencha o formulário com validações
- ✅ Teste máscaras de telefone e data
- ✅ Teste localização automática
- ✅ Teste upload de fotos
- ✅ Envie informações com feedback visual

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

## 🚀 Melhorias Implementadas

### ✅ Requisitos Funcionais Atendidos

#### 1. **Paginação Obrigatória ≥10**

- ✅ Seletor de tamanho de página (10/20/50 itens)
- ✅ Preservação de estado na URL
- ✅ Navegação funcional com botões e números
- ✅ Contador de itens e páginas

#### 2. **Destaque Visual de Status**

- ✅ Badges consistentes para "Desaparecido" e "Localizado"
- ✅ Cores semânticas (vermelho/verde)
- ✅ Indicadores visuais na listagem e detalhes
- ✅ Banner de status na página de detalhes

#### 3. **Formulário Aprimorado**

- ✅ Máscaras de telefone e validação de data
- ✅ Localização automática com geolocalização
- ✅ Validações robustas com feedback visual
- ✅ Feedback de processamento com loading states
- ✅ Toasts informativos de sucesso/erro

#### 4. **Preservação de Estado**

- ✅ Filtros mantidos na URL
- ✅ Página preservada ao navegar/voltar
- ✅ URLs compartilháveis
- ✅ Histórico do navegador funcional

### 📊 Evidências Técnicas

- **Paginação**: Implementada com `pageSize >= 10` obrigatório
- **API**: Integração completa com `https://abitus-api.geia.vip`
- **Swagger**: Documentação disponível em `/swagger-ui.html`
- **Validações**: Máscaras, limites e feedback visual
- **Geolocalização**: API de geocodificação reversa integrada
- **Estado**: URLSearchParams para persistência

## 🧪 Testes Automatizados

### ✅ Cobertura de Testes

- **Componentes**: Testes unitários para todos os componentes principais
- **Serviços**: Testes de integração para API e serviços
- **Formulários**: Testes de validação e interação
- **Paginação**: Testes específicos para requisito ≥10 itens
- **Cobertura**: Mínimo 70% de cobertura de código

### 🚀 Pipeline CI/CD

- **GitHub Actions**: Pipeline automatizado com testes, build e deploy
- **Testes**: Execução automática em Node.js 18.x e 20.x
- **Linting**: Verificação de código com ESLint
- **Type Checking**: Validação de tipos TypeScript
- **Docker**: Build e teste de imagem multi-stage
- **Security**: Scan de vulnerabilidades com Trivy
- **Performance**: Testes de performance com Lighthouse

### 📋 Comandos de Teste

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes para CI
npm run test:ci
```

### 🔧 Configuração de Testes

- **Jest**: Framework de testes principal
- **Testing Library**: Utilitários para testes de componentes React
- **MSW**: Mock de requisições HTTP
- **Coverage**: Relatórios de cobertura com Codecov

## 🚀 Melhorias Implementadas

### ✅ **1. Paginação Obrigatória ≥10**

- **Seletor de Página**: 10/20/50 itens por página
- **Preservação de Estado**: Filtros e página mantidos na URL/Store
- **Navegação**: URLs compartilháveis e histórico funcional
- **Validação**: Mínimo 10 itens garantido
- **Hook Personalizado**: `usePeopleStore` para gerenciamento de estado

### ✅ **2. Destaque Visual de Status**

- **Badges Gradientes**: Verde para localizada, vermelho para desaparecida
- **Consistência**: Mesmo padrão em lista e detalhes
- **Ícones**: Símbolos visuais para melhor identificação
- **Cores Semânticas**: Verde = encontrada, vermelho = desaparecida

### ✅ **3. Validações e Máscaras**

- **Telefone**: Máscara (XX) XXXXX-XXXX com validação
- **Data**: Validação de intervalo e formato
- **Campos Obrigatórios**: Validação em tempo real
- **Feedback Visual**: Mensagens de erro contextuais
- **Zod**: Validação robusta com schemas

### ✅ **4. Geolocalização Automática**

- **GPS**: Tentativa de localização via navigator.geolocation
- **Geocodificação**: API de geocodificação reversa
- **Fallback**: Coordenadas quando geocodificação falha
- **Feedback**: Toast de sucesso/erro

### ✅ **5. Feedback de Processamento**

- **Loading**: Spinner e texto durante envio
- **Botões**: Desabilitados durante processamento
- **Toasts**: Notificações de sucesso/erro
- **Estados**: Loading, sucesso, erro claramente indicados

### ✅ **6. Preservação de Estado**

- **URL**: Filtros e página na URL
- **Navegação**: Estado mantido ao voltar
- **Compartilhamento**: URLs funcionais
- **Histórico**: Navegação do navegador funcional

### ✅ **7. Ações de Compartilhamento**

- **Compartilhar**: Botão de compartilhamento nativo
- **Copiar Link**: Cópia para área de transferência
- **Feedback Visual**: Confirmação de cópia
- **Fallback**: Cópia quando compartilhamento não disponível

### ✅ **8. Interceptors de API**

- **Timeout**: Configurável via variável de ambiente
- **Mapeamento de Erros**: Mensagens amigáveis para cada status
- **Retry Automático**: Para erros 5xx
- **Cancelamento**: Suporte a cancelamento de requisições

### ✅ **9. Estados de Loading**

- **Skeleton**: Componentes de loading realistas
- **Empty State**: Estado vazio com ações
- **Error State**: Erro com botão de retry
- **Loading States**: Indicadores de carregamento

### ✅ **10. Testes Automatizados**

- **MSW**: Mock de requisições HTTP
- **Jest**: Testes unitários e de integração
- **Testing Library**: Testes de componentes
- **Cobertura**: Mínimo 70% de cobertura

### ✅ **11. Validação com Zod**

- **Schemas**: Validação robusta de dados
- **Type Safety**: Tipos TypeScript gerados
- **Error Handling**: Mensagens de erro claras
- **Runtime Validation**: Validação em tempo de execução

### ✅ **12. Docker Multi-Stage**

- **4 Stages**: Base, Dependencies, Build, Production
- **Imagem Enxuta**: Apenas arquivos necessários
- **Segurança**: Usuário não-root
- **Health Check**: Verificação de saúde

### ✅ **13. Docker Compose**

- **Desenvolvimento**: Ambiente completo com Redis e PostgreSQL
- **Nginx**: Proxy reverso com rate limiting
- **Adminer**: Interface para banco de dados
- **Volumes**: Persistência de dados
