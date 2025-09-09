# Multi-stage Dockerfile para aplicação Next.js - Pessoas Desaparecidas MT
# Otimizado para imagem enxuta e segurança

# ===========================================
# Stage 1: Base - Configuração comum
# ===========================================
FROM node:20-alpine AS base

# Instalar dependências do sistema necessárias
RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Configurar diretório de trabalho
WORKDIR /app

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# ===========================================
# Stage 2: Dependencies - Instalar dependências
# ===========================================
FROM base AS deps

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar dependências de produção
RUN npm ci --only=production --frozen-lockfile \
    && npm cache clean --force

# ===========================================
# Stage 3: Build - Compilar aplicação
# ===========================================
FROM base AS builder

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar todas as dependências (dev + prod)
RUN npm ci --frozen-lockfile

# Copiar código fonte
COPY . .

# Configurar variáveis de ambiente para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Criar pasta public se não existir e build da aplicação
RUN mkdir -p public && rm -rf .next && npm run build

# ===========================================
# Stage 4: Production - Imagem final otimizada
# ===========================================
FROM base AS runner

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copiar dependências de produção
COPY --from=deps /app/node_modules ./node_modules

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Copiar arquivos de build com permissões corretas
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Configurar permissões
RUN chown -R nextjs:nodejs /app

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Usar dumb-init para gerenciar processos
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
