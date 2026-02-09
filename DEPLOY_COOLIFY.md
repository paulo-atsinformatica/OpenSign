# Guia de Deploy do OpenSign no Coolify

Este guia explica como fazer o deploy do OpenSign no Coolify, uma plataforma de deploy self-hosted.

## 📋 Pré-requisitos

1. **Repositório no GitHub/GitLab** - O projeto já está conectado ao seu repositório
2. **Instância do Coolify** - Você precisa ter uma instância do Coolify rodando
3. **MongoDB** - Você precisará de uma instância MongoDB (pode ser provisionada pelo Coolify ou externa)

## 🚀 Passo 1: Preparar o Repositório

### 1.1 Verificar o Status do Git

```bash
git status
```

### 1.2 Fazer Commit e Push das Alterações (se necessário)

```bash
git add .
git commit -m "Preparar projeto para deploy no Coolify"
git push origin main
```

## 🐳 Passo 2: Configurar Aplicações no Coolify

O OpenSign é composto por **3 serviços principais**:

1. **Frontend (OpenSign)** - Aplicação React
2. **Backend (OpenSignServer)** - API Node.js/Parse Server
3. **MongoDB** - Banco de dados

### 2.1 Criar Aplicação MongoDB

1. No Coolify, vá em **Resources** → **Databases** → **MongoDB**
2. Crie uma nova instância MongoDB
3. Anote as credenciais de conexão (serão usadas nas variáveis de ambiente)

### 2.2 Criar Aplicação Backend (OpenSignServer)

1. No Coolify, vá em **Applications** → **New Application**
2. Configure:
   - **Name**: `opensign-server`
   - **Repository**: Seu repositório GitHub/GitLab
   - **Branch**: `main` (ou a branch desejada)
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `apps/OpenSignServer/Dockerhubfile`
   - **Port**: `8080`
   - **Context Directory**: `apps/OpenSignServer`

3. **Variáveis de Ambiente** (veja seção completa abaixo):
   - `DATABASE_URI` - URI de conexão do MongoDB
   - `APP_ID` - ID da aplicação
   - `MASTER_KEY` - Chave mestra (mantenha segura!)
   - `SERVER_URL` - URL pública do servidor
   - `PUBLIC_URL` - URL pública da aplicação
   - E outras variáveis necessárias

### 2.3 Criar Aplicação Frontend (OpenSign)

1. No Coolify, vá em **Applications** → **New Application**
2. Configure:
   - **Name**: `opensign-client`
   - **Repository**: Seu repositório GitHub/GitLab
   - **Branch**: `main` (ou a branch desejada)
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `apps/OpenSign/Dockerhubfile`
   - **Port**: `3000`
   - **Context Directory**: `apps/OpenSign`

3. **Variáveis de Ambiente**:
   - `REACT_APP_SERVERURL` - URL da API do backend (ex: `https://opensign-server.seu-dominio.com/api/app`)

## 🔧 Passo 3: Variáveis de Ambiente

### Variáveis do Backend (OpenSignServer)

#### Obrigatórias:

```env
# MongoDB
DATABASE_URI=mongodb://usuario:senha@mongodb-host:27017/opensign
# ou se usar MongoDB do Coolify:
DATABASE_URI=mongodb://mongodb-container:27017/opensign

# Parse Server
APP_ID=opensign
MASTER_KEY=sua-chave-mestra-secreta-aqui
SERVER_URL=https://opensign-server.seu-dominio.com/api/app
PUBLIC_URL=https://opensign.seu-dominio.com

# Node Environment
NODE_ENV=production
PORT=8080
```

#### Opcionais (mas recomendadas):

```env
# Email (escolha uma opção)
# Opção 1: SMTP
SMTP_ENABLE=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER_EMAIL=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app
SMTP_SECURE=false

# Opção 2: Mailgun
MAILGUN_API_KEY=sua-api-key
MAILGUN_DOMAIN=seu-dominio.com
MAILGUN_SENDER=noreply@seu-dominio.com

# Storage (escolha uma opção)
# Opção 1: Local Storage
USE_LOCAL=true

# Opção 2: DigitalOcean Spaces / AWS S3
USE_LOCAL=false
DO_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACE=seu-space
DO_BASEURL=https://seu-space.nyc3.digitaloceanspaces.com
DO_REGION=nyc3
DO_ACCESS_KEY_ID=sua-access-key
DO_SECRET_ACCESS_KEY=sua-secret-key
```

### Variáveis do Frontend (OpenSign)

```env
REACT_APP_SERVERURL=https://opensign-server.seu-dominio.com/api/app
```

## 📝 Passo 4: Configuração de Domínio

### 4.1 Configurar Domínio para o Backend

1. No Coolify, na aplicação `opensign-server`:
   - Vá em **Settings** → **Domains**
   - Adicione o domínio: `opensign-server.seu-dominio.com`
   - Configure SSL (geralmente automático)

### 4.2 Configurar Domínio para o Frontend

1. No Coolify, na aplicação `opensign-client`:
   - Vá em **Settings** → **Domains**
   - Adicione o domínio principal: `opensign.seu-dominio.com`
   - Configure SSL (geralmente automático)

## 🔄 Passo 5: Deploy

1. **Deploy do Backend primeiro**:
   - Vá na aplicação `opensign-server`
   - Clique em **Deploy**
   - Aguarde o build e deploy completar

2. **Deploy do Frontend**:
   - Vá na aplicação `opensign-client`
   - Clique em **Deploy**
   - Aguarde o build e deploy completar

## ✅ Passo 6: Verificação

1. Acesse o frontend: `https://opensign.seu-dominio.com`
2. Teste o cadastro de usuário
3. Verifique os logs em caso de erro

## 🐛 Troubleshooting

### Erro de Conexão com MongoDB

- Verifique se o `DATABASE_URI` está correto
- Se usar MongoDB do Coolify, use o nome do serviço como host
- Verifique se as credenciais estão corretas

### Erro 404 no Frontend

- Verifique se `REACT_APP_SERVERURL` aponta para a URL correta do backend
- Certifique-se de que o backend está rodando

### Erro de Build

- Verifique os logs de build no Coolify
- Certifique-se de que o Dockerfile está no caminho correto
- Verifique se o contexto do diretório está correto

## 📚 Recursos Adicionais

- [Documentação do Coolify](https://coolify.io/docs)
- [Documentação do OpenSign](https://docs.opensignlabs.com)

## 🔐 Segurança

⚠️ **IMPORTANTE**: 
- Nunca commite arquivos `.env` no repositório
- Use variáveis de ambiente do Coolify para dados sensíveis
- Mantenha o `MASTER_KEY` seguro e nunca o compartilhe
- Use HTTPS em produção
- Configure firewalls adequadamente

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Coolify
2. Consulte a documentação do OpenSign
3. Abra uma issue no repositório
