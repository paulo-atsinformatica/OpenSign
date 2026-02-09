# 🔧 Solução: Configuração com Traefik/Coolify (Baseado na Issue #1680)

## 📋 Problema Resolvido

Um usuário na [Issue #1680](https://github.com/OpenSignLabs/OpenSign/issues/1680) conseguiu fazer funcionar usando **Traefik** como proxy reverso. A chave foi:

1. **Prioridade do roteador**: A regra da API precisa ter **prioridade maior** que a do cliente
2. **Strip prefix**: O proxy remove `/api` antes de enviar para o servidor
3. **URLs corretas**: Frontend usa `/api/app`, servidor recebe `/app`

## 🎯 Solução com Traefik

### Docker Compose com Traefik

```yaml
services:
  mongo:
    image: mongo:latest
    container_name: mongo-container
    volumes:
      - data-volume:/data/db
    networks:
      - proxy

  server:
    image: opensign/opensignserver:main
    container_name: OpenSignServer-container
    volumes:
      - opensign-files:/usr/src/app/files
    depends_on:
      - mongo
    environment:
      - NODE_ENV=production
    labels:
      traefik.enable: "true"
      traefik.docker.network: proxy

      # Rota da API com PRIORIDADE ALTA (20)
      traefik.http.routers.sign-api.entrypoints: websecure
      traefik.http.routers.sign-api.rule: Host(`sign.example.com`) && PathPrefix(`/api`)
      traefik.http.routers.sign-api.tls: "true"
      traefik.http.routers.sign-api.priority: "20"  # ⚠️ PRIORIDADE ALTA

      # Remove /api antes de enviar para o servidor
      traefik.http.middlewares.sign-strip-api.stripPrefix.prefixes: /api
      traefik.http.routers.sign-api.middlewares: sign-strip-api

      traefik.http.routers.sign-api.service: sign-api
      traefik.http.services.sign-api.loadbalancer.server.port: 8080

    networks:
      - proxy

  client:
    image: opensign/opensign:main
    container_name: OpenSign-container
    depends_on:
      - server
    labels:
      traefik.enable: "true"
      traefik.docker.network: proxy

      # Rota do cliente com PRIORIDADE BAIXA (1)
      traefik.http.routers.sign-web.entrypoints: websecure
      traefik.http.routers.sign-web.rule: Host(`sign.example.com`)
      traefik.http.routers.sign-web.tls: "true"
      traefik.http.routers.sign-web.priority: "1"  # ⚠️ PRIORIDADE BAIXA
      traefik.http.routers.sign-web.service: sign-web
      traefik.http.services.sign-web.loadbalancer.server.port: 3000

    networks:
      - proxy

networks:
  proxy:
    name: proxy
    external: true

volumes:
  data-volume:
  opensign-files:
```

### Variáveis de Ambiente (.env.prod)

```env
# Frontend config 
HOST_URL=https://sign.example.com
PUBLIC_URL=https://sign.example.com
GENERATE_SOURCEMAP=false

# API URL como visto pelo navegador (COM /api)
REACT_APP_SERVERURL=https://sign.example.com/api/app

# Backend config
APP_ID=opensign
MASTER_KEY=sua-chave-secreta
MONGODB_URI=mongodb://mongo:27017/OpenSignDB
PARSE_MOUNT=/app

# URL interna do backend (SEM /api, URL interna do Docker)
SERVER_URL=http://server:8080/app

# Storage
USE_LOCAL=true

# Email (opcional)
SMTP_ENABLE=false
```

## 🔑 Pontos Importantes

### 1. Prioridade do Roteador

- **API**: `priority: "20"` (ALTA) - Processa primeiro
- **Cliente**: `priority: "1"` (BAIXA) - Processa depois

Isso garante que `/api/*` seja roteado para o servidor antes de tentar o cliente.

### 2. Strip Prefix

```yaml
traefik.http.middlewares.sign-strip-api.stripPrefix.prefixes: /api
```

Isso remove `/api` antes de enviar para o servidor:
- Cliente acessa: `https://sign.example.com/api/app/functions/...`
- Traefik envia para servidor: `http://server:8080/app/functions/...`

### 3. URLs Diferentes

- **Frontend** (`REACT_APP_SERVERURL`): `https://sign.example.com/api/app` (com `/api`)
- **Backend** (`SERVER_URL`): `http://server:8080/app` (sem `/api`, URL interna)

## 🚀 Adaptação para Coolify

O Coolify usa Traefik internamente, mas a configuração é diferente. Você precisa:

### Opção 1: Configurar Rotas no Coolify (Recomendado)

1. **No Coolify, configure duas rotas**:
   - Rota 1: `/api/*` → serviço `server` (prioridade alta)
   - Rota 2: `/` → serviço `client` (prioridade baixa)

2. **Variáveis de ambiente**:
   ```env
   HOST_URL=https://atssign.163.176.255.228.sslip.io
   PUBLIC_URL=https://atssign.163.176.255.228.sslip.io
   REACT_APP_SERVERURL=https://atssign.163.176.255.228.sslip.io/api/app
   SERVER_URL=http://server:8080/app
   PARSE_MOUNT=/app
   ```

### Opção 2: Usar Labels Traefik no docker-compose.coolify.yml

Atualize o `docker-compose.coolify.yml` para incluir labels Traefik:

```yaml
services:
  server:
    image: ghcr.io/paulo-atsinformatica/opensignserver:staging
    container_name: OpenSignServer-container
    volumes:
      - opensign-files:/usr/src/app/files
    expose:
      - "8080"
    depends_on:
      - mongo
    environment:
      - NODE_ENV=production
      - PORT=8080
      - DATABASE_URI=${DATABASE_URI}
      - APP_ID=${APP_ID:-opensign}
      - MASTER_KEY=${MASTER_KEY}
      - SERVER_URL=http://server:8080/app  # ⚠️ URL interna, sem /api
      - PUBLIC_URL=${PUBLIC_URL:-${HOST_URL}}
      - PARSE_MOUNT=/app
      # ... outras variáveis
    labels:
      # Rota da API com prioridade alta
      - "traefik.enable=true"
      - "traefik.http.routers.opensign-api.rule=PathPrefix(`/api`)"
      - "traefik.http.routers.opensign-api.priority=20"
      - "traefik.http.routers.opensign-api.service=opensign-api"
      - "traefik.http.services.opensign-api.loadbalancer.server.port=8080"
      # Middleware para remover /api
      - "traefik.http.middlewares.opensign-strip-api.stripPrefix.prefixes=/api"
      - "traefik.http.routers.opensign-api.middlewares=opensign-strip-api"
    networks:
      - app-network
    restart: unless-stopped

  client:
    image: ghcr.io/paulo-atsinformatica/opensign:staging
    container_name: OpenSign-container
    depends_on:
      - server
    environment:
      - REACT_APP_SERVERURL=${REACT_APP_SERVERURL:-${HOST_URL}/api/app}  # ⚠️ COM /api
    expose:
      - "3000"
    labels:
      - "coolify.port=3000"
      - "coolify.expose=true"
      # Rota do cliente com prioridade baixa
      - "traefik.enable=true"
      - "traefik.http.routers.opensign-web.rule=Host(`${HOST_URL}`)"
      - "traefik.http.routers.opensign-web.priority=1"
      - "traefik.http.routers.opensign-web.service=opensign-web"
      - "traefik.http.services.opensign-web.loadbalancer.server.port=3000"
    networks:
      - app-network
    restart: unless-stopped
```

## 📝 Alternativa: Caddyfile (Se Coolify Suportar)

Se o Coolify permitir usar Caddy, você pode criar um `Caddyfile`:

```caddyfile
{$HOST_URL} {
    # Primeiro: API (prioridade alta)
    handle_path /api/* {
        reverse_proxy server:8080
    }

    # Fallback: tudo mais -> frontend
    handle {
        reverse_proxy client:3000
    }
}
```

## ✅ Checklist de Configuração

- [ ] Configurar rota `/api/*` com prioridade alta para o servidor
- [ ] Configurar rota `/` com prioridade baixa para o cliente
- [ ] Middleware para remover `/api` antes de enviar para o servidor
- [ ] `REACT_APP_SERVERURL` com `/api/app` (URL pública)
- [ ] `SERVER_URL` sem `/api` (URL interna do Docker)
- [ ] `PARSE_MOUNT=/app` no servidor

## 🎯 Resumo

A solução funciona porque:

1. **Traefik processa rotas por prioridade**
   - `/api/*` (prioridade 20) → servidor
   - `/` (prioridade 1) → cliente

2. **Strip prefix remove `/api`**
   - Cliente acessa: `/api/app/functions/...`
   - Servidor recebe: `/app/functions/...`

3. **URLs corretas**
   - Frontend: URL pública com `/api`
   - Backend: URL interna sem `/api`

## 🔧 Próximos Passos

1. Atualize o `docker-compose.coolify.yml` com labels Traefik
2. Configure as variáveis de ambiente corretamente
3. Teste se `/api/app` funciona
4. Teste se o frontend carrega corretamente
