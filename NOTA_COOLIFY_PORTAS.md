# 🔧 Nota sobre Portas no Coolify

## Mudanças Realizadas

O `docker-compose.coolify.yml` foi atualizado para funcionar corretamente com o Coolify:

### ✅ O que foi alterado:

1. **Removido `ports:`** - Substituído por `expose:` para serviços internos
   - `expose` apenas expõe a porta na rede interna do Docker
   - Evita conflitos de porta no host
   - Serviços se comunicam pela rede interna

2. **Removido serviço Caddy** - Não é necessário no Coolify
   - O Coolify faz o proxy reverso automaticamente
   - Gerencia SSL/HTTPS automaticamente
   - Não precisa de Caddy separado

3. **Adicionado labels no client** - Para indicar ao Coolify qual serviço expor
   ```yaml
   labels:
     - "coolify.port=3000"
     - "coolify.expose=true"
   ```

## Como Funciona Agora

### Comunicação Interna:
- **MongoDB** → Expõe porta 27017 apenas internamente
- **Server** → Expõe porta 8080 apenas internamente  
- **Client** → Expõe porta 3000 (será exposto pelo Coolify)

### Proxy Reverso:
- O **Coolify** detecta o serviço `client` e faz o proxy reverso automaticamente
- O Coolify gerencia SSL/HTTPS automaticamente
- Não precisa configurar Caddy ou nginx manualmente

## Configuração no Coolify

1. **No Coolify, configure o domínio:**
   - Vá em **Settings** → **Domains**
   - Adicione seu domínio: `opensign.seu-dominio.com`
   - O Coolify configurará automaticamente o proxy para o serviço `client`

2. **Se precisar acessar a API diretamente:**
   - Você pode criar um segundo domínio apontando para o serviço `server`
   - Ou usar o mesmo domínio com path `/api/app`

## Variáveis Importantes

Certifique-se de configurar:

```env
HOST_URL=https://opensign.seu-dominio.com
SERVER_URL=https://opensign.seu-dominio.com/api/app
PUBLIC_URL=https://opensign.seu-dominio.com
REACT_APP_SERVERURL=https://opensign.seu-dominio.com/api/app
```

## Troubleshooting

### Erro: "port is already allocated"
- ✅ **Resolvido**: Agora usamos `expose` ao invés de `ports`
- Os serviços não mapeiam portas no host, apenas na rede interna

### Como acessar a API do servidor?
- O Coolify pode criar um proxy reverso para o serviço `server` também
- Configure um segundo domínio ou use paths no mesmo domínio
- Exemplo: `api.opensign.seu-dominio.com` → serviço `server`

### MongoDB não está acessível?
- MongoDB é apenas interno, não precisa ser exposto
- Use `mongo:27017` como hostname na `DATABASE_URI`
- Os serviços se comunicam pela rede `app-network`
