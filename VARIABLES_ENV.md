# Variáveis de Ambiente do OpenSign

Este documento lista todas as variáveis de ambiente necessárias para configurar o OpenSign.

## 📋 Variáveis Obrigatórias

### Backend (OpenSignServer)

```env
# MongoDB Connection
DATABASE_URI=mongodb://usuario:senha@host:porta/database
# ou
MONGODB_URI=mongodb://usuario:senha@host:porta/database

# Parse Server
APP_ID=opensign
MASTER_KEY=SUA_CHAVE_MESTRA_SECRETA_AQUI
SERVER_URL=https://opensign-server.seu-dominio.com/api/app
PUBLIC_URL=https://opensign.seu-dominio.com

# Node
NODE_ENV=production
PORT=8080
```

### Frontend (OpenSign)

```env
REACT_APP_SERVERURL=https://opensign-server.seu-dominio.com/api/app
```

## 📧 Configuração de Email

### Opção 1: SMTP

```env
SMTP_ENABLE=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER_EMAIL=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app
SMTP_SECURE=false
```

### Opção 2: Mailgun

```env
MAILGUN_API_KEY=sua-api-key
MAILGUN_DOMAIN=seu-dominio.com
MAILGUN_SENDER=noreply@seu-dominio.com
```

## 💾 Configuração de Storage

### Opção 1: Local Storage

```env
USE_LOCAL=true
```

### Opção 2: DigitalOcean Spaces / AWS S3

```env
USE_LOCAL=false
DO_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACE=seu-space-name
DO_BASEURL=https://seu-space.nyc3.digitaloceanspaces.com
DO_REGION=nyc3
DO_ACCESS_KEY_ID=sua-access-key-id
DO_SECRET_ACCESS_KEY=sua-secret-access-key
```

## 🔧 Variáveis Opcionais

```env
# Parse Mount Path
PARSE_MOUNT=/parse

# File Key
FILE_KEY=seu-file-key-opcional

# Host URL (usado no docker-compose)
HOST_URL=https://opensign.seu-dominio.com
```

## 📝 Notas Importantes

1. **MASTER_KEY**: Gere uma chave segura aleatória (mínimo 32 caracteres)
2. **DATABASE_URI**: Use o formato correto do MongoDB
3. **SERVER_URL e PUBLIC_URL**: Configure com seus domínios reais
4. **Email**: Configure SMTP ou Mailgun para envio de emails
5. **Storage**: Use local para desenvolvimento, S3/Spaces para produção

## 🔐 Segurança

⚠️ **NUNCA** commite arquivos `.env` no repositório!
- Use variáveis de ambiente do Coolify para dados sensíveis
- Mantenha o `MASTER_KEY` seguro e nunca o compartilhe
