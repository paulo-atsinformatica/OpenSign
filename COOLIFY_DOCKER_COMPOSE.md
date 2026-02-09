# 🐳 Usando Docker Compose no Coolify

Este guia explica como usar o `docker-compose.coolify.yml` no Coolify para fazer deploy do OpenSign.

## 📋 Pré-requisitos

1. Repositório no GitHub: `https://github.com/paulo-atsinformatica/OpenSign.git`
2. Instância do Coolify configurada
3. Acesso ao repositório no Coolify

## 🚀 Configuração no Coolify

### Opção 1: Usar Docker Compose (Recomendado)

O Coolify suporta deploy direto de docker-compose. Siga estes passos:

1. **No Coolify, vá em Applications → New Application**

2. **Configure a aplicação:**
   - **Name**: `opensign`
   - **Repository**: `paulo-atsinformatica/OpenSign`
   - **Branch**: `staging` (ou a branch desejada)
   - **Build Pack**: `Docker Compose`
   - **Docker Compose File**: `docker-compose.coolify.yml`

3. **Variáveis de Ambiente** (configure no Coolify):
   ```env
   HOST_URL=https://opensign.seu-dominio.com
   DATABASE_URI=mongodb://mongo:27017/opensign
   APP_ID=opensign
   MASTER_KEY=sua-chave-mestra-secreta
   SERVER_URL=https://opensign.seu-dominio.com/api/app
   PUBLIC_URL=https://opensign.seu-dominio.com
   NODE_ENV=production
   REACT_APP_SERVERURL=https://opensign.seu-dominio.com/api/app
   ```

4. **Criar arquivo .env.prod** (ou usar variáveis de ambiente do Coolify):
   - No Coolify, você pode configurar as variáveis diretamente na interface
   - Ou criar um arquivo `.env.prod` no repositório (não recomendado para dados sensíveis)

5. **Deploy:**
   - Clique em **Deploy**
   - O Coolify irá:
     - Fazer checkout do código
     - Construir as imagens Docker
     - Subir todos os serviços (mongo, server, client, caddy)

## 🔧 Configuração de Domínio

1. **No Coolify, na aplicação `opensign`:**
   - Vá em **Settings** → **Domains**
   - Adicione o domínio: `opensign.seu-dominio.com`
   - Configure SSL (geralmente automático)

2. **Atualize a variável HOST_URL** com o domínio real:
   ```
   HOST_URL=https://opensign.seu-dominio.com
   ```

## 📝 Estrutura dos Serviços

O `docker-compose.coolify.yml` contém 4 serviços:

1. **mongo** - Banco de dados MongoDB
   - Porta: 27017
   - Volume persistente: `data-volume`

2. **server** - Backend OpenSign (Parse Server)
   - Porta: 8080
   - Build: `apps/OpenSignServer/Dockerhubfile`
   - Volume: `opensign-files` (para arquivos)

3. **client** - Frontend OpenSign (React)
   - Porta: 3000
   - Build: `apps/OpenSign/Dockerhubfile`

4. **caddy** - Proxy reverso e SSL
   - Portas: 80, 443, 3001
   - Configuração: `Caddyfile`

## ⚙️ Variáveis de Ambiente Importantes

### Obrigatórias:
- `HOST_URL` - URL principal da aplicação
- `DATABASE_URI` - URI de conexão MongoDB
- `APP_ID` - ID da aplicação Parse
- `MASTER_KEY` - Chave mestra (mantenha segura!)
- `SERVER_URL` - URL pública da API
- `PUBLIC_URL` - URL pública da aplicação
- `REACT_APP_SERVERURL` - URL da API para o frontend

### Opcionais (mas recomendadas):
- `SMTP_ENABLE`, `SMTP_HOST`, etc. - Para envio de emails
- `USE_LOCAL` - Para storage local ou S3
- Configurações de DigitalOcean Spaces/AWS S3

## 🔄 Atualizações

Quando você fizer push para o repositório:

1. O Coolify detectará automaticamente (se webhook configurado)
2. Ou você pode fazer deploy manual clicando em **Deploy**
3. O Coolify reconstruirá as imagens e reiniciará os serviços

## 🐛 Troubleshooting

### Erro de Build
- Verifique se os Dockerfiles estão no caminho correto
- Verifique os logs de build no Coolify
- Certifique-se de que o contexto está correto (raiz do projeto)

### Erro de Conexão MongoDB
- Verifique se o serviço `mongo` está rodando
- Use `mongo` como hostname (nome do serviço no docker-compose)
- Verifique a porta: `27017`

### Erro 404 no Frontend
- Verifique `REACT_APP_SERVERURL`
- Certifique-se de que o backend está rodando
- Verifique os logs do serviço `client`

### Problemas com Caddy
- Verifique o arquivo `Caddyfile`
- Certifique-se de que `HOST_URL` está correto
- Verifique os logs do serviço `caddy`

## 📚 Recursos

- [Documentação do Coolify](https://coolify.io/docs)
- [Docker Compose no Coolify](https://coolify.io/docs/docker-compose)
- [Documentação do OpenSign](https://docs.opensignlabs.com)

## 🔐 Segurança

⚠️ **IMPORTANTE**:
- Nunca commite arquivos `.env.prod` com dados sensíveis
- Use variáveis de ambiente do Coolify para secrets
- Mantenha `MASTER_KEY` seguro
- Use HTTPS em produção
- Configure firewalls adequadamente
