# 📋 Resumo Rápido - Deploy OpenSign no Coolify

## ✅ Checklist Pré-Deploy

- [x] Repositório conectado ao GitHub: `https://github.com/paulo-atsinformatica/OpenSign.git`
- [x] Branch atual: `staging`
- [x] Documentação criada

## 🚀 Passos Rápidos

### 1. Fazer Push do Código

```bash
git add DEPLOY_COOLIFY.md VARIABLES_ENV.md Dockerfile.server Dockerfile.client RESUMO_DEPLOY.md
git commit -m "Adicionar documentação e Dockerfiles para deploy no Coolify"
git push origin staging
```

### 2. No Coolify - Criar 3 Aplicações

#### Aplicação 1: MongoDB (Database)
- Tipo: MongoDB
- Nome: `opensign-mongodb`
- Anotar credenciais geradas

#### Aplicação 2: Backend Server
- Nome: `opensign-server`
- Repositório: `paulo-atsinformatica/OpenSign`
- Branch: `staging`
- Build Pack: `Dockerfile`
- Dockerfile: `Dockerfile.server` (ou `apps/OpenSignServer/Dockerhubfile`)
- Port: `8080`
- Context: `.` (raiz do projeto)

**Variáveis de Ambiente:**
```
DATABASE_URI=mongodb://opensign-mongodb:27017/opensign
APP_ID=opensign
MASTER_KEY=<gerar-chave-secreta>
SERVER_URL=https://opensign-server.seu-dominio.com/api/app
PUBLIC_URL=https://opensign.seu-dominio.com
NODE_ENV=production
PORT=8080
```

#### Aplicação 3: Frontend Client
- Nome: `opensign-client`
- Repositório: `paulo-atsinformatica/OpenSign`
- Branch: `staging`
- Build Pack: `Dockerfile`
- Dockerfile: `Dockerfile.client` (ou `apps/OpenSign/Dockerhubfile`)
- Port: `3000`
- Context: `.` (raiz do projeto)

**Variáveis de Ambiente:**
```
REACT_APP_SERVERURL=https://opensign-server.seu-dominio.com/api/app
```

### 3. Configurar Domínios

- Backend: `opensign-server.seu-dominio.com`
- Frontend: `opensign.seu-dominio.com`

### 4. Deploy

1. Deploy MongoDB primeiro
2. Deploy Backend
3. Deploy Frontend

## 📚 Documentação Completa

- **Guia Completo**: Veja `DEPLOY_COOLIFY.md`
- **Variáveis de Ambiente**: Veja `VARIABLES_ENV.md`

## ⚠️ Importante

1. **MASTER_KEY**: Gere uma chave segura aleatória (mínimo 32 caracteres)
2. **DATABASE_URI**: Use o nome do serviço MongoDB do Coolify como host
3. **Ordem de Deploy**: MongoDB → Backend → Frontend
4. **SSL**: Configure HTTPS nos domínios

## 🔧 Troubleshooting Rápido

- **Erro de conexão MongoDB**: Verifique se o nome do serviço está correto
- **404 no frontend**: Verifique `REACT_APP_SERVERURL`
- **Erro de build**: Verifique o caminho do Dockerfile e contexto
