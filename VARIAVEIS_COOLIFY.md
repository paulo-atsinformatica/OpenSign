# 🔧 Variáveis de Ambiente para Coolify

Este documento lista **todas as variáveis de ambiente** que você precisa configurar no Coolify para o OpenSign funcionar corretamente.

## 📋 Variáveis Obrigatórias (Mínimo para funcionar)

Configure estas variáveis **ANTES** de fazer o primeiro deploy:

```env
# ============================================
# CONFIGURAÇÕES BÁSICAS
# ============================================

# URL principal da aplicação (use seu domínio real)
HOST_URL=https://opensign.seu-dominio.com

# ============================================
# MONGODB
# ============================================

# URI de conexão do MongoDB
# Se usar MongoDB do Coolify, use o nome do serviço como host: mongodb://mongo:27017/opensign
# Se usar MongoDB externo: mongodb://usuario:senha@host:porta/database
DATABASE_URI=mongodb://mongo:27017/opensign
# ou alternativamente:
MONGODB_URI=mongodb://mongo:27017/opensign

# ============================================
# PARSE SERVER (Backend)
# ============================================

# ID da aplicação (pode ser qualquer string, mas mantenha consistente)
APP_ID=opensign

# Chave mestra - GERE UMA CHAVE SEGURA ALEATÓRIA (mínimo 32 caracteres)
# Exemplo: openssl rand -base64 32
MASTER_KEY=sua-chave-mestra-super-secreta-aqui-altere-obrigatoriamente

# URL pública da API do servidor
SERVER_URL=https://opensign.seu-dominio.com/api/app

# URL pública da aplicação (geralmente igual ao HOST_URL)
PUBLIC_URL=https://opensign.seu-dominio.com

# ============================================
# FRONTEND
# ============================================

# URL da API para o frontend (deve apontar para o SERVER_URL)
REACT_APP_SERVERURL=https://opensign.seu-dominio.com/api/app

# ============================================
# NODE ENVIRONMENT
# ============================================

NODE_ENV=production
PORT=8080
```

## 📧 Variáveis de Email (Escolha UMA opção)

### Opção 1: SMTP (Recomendado para produção)

```env
# Habilitar SMTP
SMTP_ENABLE=true

# Servidor SMTP
SMTP_HOST=smtp.gmail.com
# ou para outros provedores:
# SMTP_HOST=smtp.office365.com
# SMTP_HOST=smtp.sendgrid.net

# Porta SMTP (587 para TLS, 465 para SSL)
SMTP_PORT=587

# Email de envio
SMTP_USER_EMAIL=seu-email@gmail.com

# Senha ou App Password (para Gmail, use App Password)
SMTP_PASSWORD=sua-senha-ou-app-password

# Username (opcional, geralmente igual ao email)
SMTP_USERNAME=seu-email@gmail.com

# Senha alternativa (se usar SMTP_PASS ao invés de SMTP_PASSWORD)
# SMTP_PASS=sua-senha

# Seguro (true para porta 465, false para porta 587)
SMTP_SECURE=false
```

### Opção 2: Mailgun

```env
# API Key do Mailgun
MAILGUN_API_KEY=sua-api-key-mailgun

# Domínio do Mailgun
MAILGUN_DOMAIN=seu-dominio.com

# Email remetente
MAILGUN_SENDER=noreply@seu-dominio.com
```

### Opção 3: Google OAuth (Gmail)

```env
# Se usar autenticação OAuth do Google
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
```

## 💾 Variáveis de Storage (Escolha UMA opção)

### Opção 1: Local Storage (Simples, para começar)

```env
USE_LOCAL=true
```

### Opção 2: DigitalOcean Spaces / AWS S3 (Recomendado para produção)

```env
USE_LOCAL=false

# DigitalOcean Spaces
DO_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACE=nome-do-seu-space
DO_BASEURL=https://nome-do-seu-space.nyc3.digitaloceanspaces.com
DO_REGION=nyc3
DO_ACCESS_KEY_ID=sua-access-key-id
DO_SECRET_ACCESS_KEY=sua-secret-access-key
```

## 🔧 Variáveis Opcionais (Avançadas)

```env
# Caminho do Parse Server (padrão: /app)
PARSE_MOUNT=/app

# File Key (opcional)
FILE_KEY=seu-file-key-opcional

# Porta do servidor (padrão: 8080)
PORT=8080

# Database name para MongoDB (se não especificado na URI)
MONGO_INITDB_DATABASE=opensign
```

## 📝 Como Configurar no Coolify

### Passo 1: Acessar Variáveis de Ambiente

1. No Coolify, vá na sua aplicação
2. Clique em **Environment Variables** ou **Variables**
3. Clique em **Add Variable**

### Passo 2: Adicionar Variáveis

Para cada variável:
1. **Key**: Nome da variável (ex: `DATABASE_URI`)
2. **Value**: Valor da variável (ex: `mongodb://mongo:27017/opensign`)
3. **Is Build Variable**: Geralmente deixe desmarcado (a menos que precise no build)
4. Clique em **Save**

### Passo 3: Ordem de Configuração

Configure nesta ordem:

1. **Primeiro**: Variáveis obrigatórias básicas
2. **Segundo**: Configuração de email (SMTP ou Mailgun)
3. **Terceiro**: Configuração de storage (Local ou S3)
4. **Por último**: Variáveis opcionais (se necessário)

## 🎯 Exemplo Completo Mínimo

Aqui está um exemplo completo com o mínimo necessário para funcionar:

```env
# Básicas
HOST_URL=https://opensign.seu-dominio.com
DATABASE_URI=mongodb://mongo:27017/opensign
APP_ID=opensign
MASTER_KEY=AltereEstaChaveParaUmaChaveSeguraAleatoriaComPeloMenos32Caracteres
SERVER_URL=https://opensign.seu-dominio.com/api/app
PUBLIC_URL=https://opensign.seu-dominio.com
REACT_APP_SERVERURL=https://opensign.seu-dominio.com/api/app
NODE_ENV=production
PORT=8080

# Email (SMTP)
SMTP_ENABLE=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER_EMAIL=seu-email@gmail.com
SMTP_PASSWORD=sua-app-password
SMTP_SECURE=false

# Storage (Local)
USE_LOCAL=true
```

## 🔐 Segurança - Variáveis Sensíveis

⚠️ **IMPORTANTE**: Estas variáveis contêm informações sensíveis:

- `MASTER_KEY` - **NUNCA** compartilhe ou commite
- `SMTP_PASSWORD` - Senha do email
- `DO_SECRET_ACCESS_KEY` - Chave secreta do storage
- `MAILGUN_API_KEY` - API key do Mailgun

**No Coolify:**
- Use a seção de **Secrets** para variáveis sensíveis
- Ou marque como **Sensitive** se disponível
- Nunca exponha essas variáveis em logs

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"

**Solução**: 
- Verifique se `DATABASE_URI` está correto
- Se usar MongoDB do Coolify, use `mongo` como hostname
- Verifique se o serviço MongoDB está rodando

### Erro: "Invalid master key"

**Solução**:
- Gere uma nova `MASTER_KEY` com pelo menos 32 caracteres
- Use: `openssl rand -base64 32` ou um gerador online

### Emails não estão sendo enviados

**Solução**:
- Verifique se `SMTP_ENABLE=true` ou se configurou Mailgun
- Teste as credenciais SMTP
- Para Gmail, use App Password (não a senha normal)

### Erro 404 no frontend

**Solução**:
- Verifique se `REACT_APP_SERVERURL` aponta para o `SERVER_URL` correto
- Certifique-se de que o backend está rodando
- Verifique os logs do serviço `client`

## 📚 Referências

- [Documentação Completa de Variáveis](VARIABLES_ENV.md)
- [Guia de Deploy no Coolify](DEPLOY_COOLIFY.md)
- [Configuração Docker Compose](COOLIFY_DOCKER_COMPOSE.md)

## ✅ Checklist

Antes de fazer deploy, certifique-se de ter configurado:

- [ ] `HOST_URL` com seu domínio real
- [ ] `DATABASE_URI` apontando para MongoDB
- [ ] `APP_ID` definido
- [ ] `MASTER_KEY` gerada e segura (mínimo 32 caracteres)
- [ ] `SERVER_URL` e `PUBLIC_URL` com domínios corretos
- [ ] `REACT_APP_SERVERURL` apontando para a API
- [ ] Configuração de email (SMTP ou Mailgun)
- [ ] Configuração de storage (Local ou S3)
