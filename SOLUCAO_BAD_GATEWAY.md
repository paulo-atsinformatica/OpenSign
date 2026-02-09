# 🔧 Solução: Bad Gateway

O erro "Bad Gateway" significa que o Coolify está tentando se conectar ao serviço, mas não está conseguindo. Vamos resolver isso.

## 🔍 Diagnóstico Rápido

### 1. Verificar Status dos Containers

No Coolify, verifique se todos os containers estão **Running**:

- ✅ `mongo-container` - Deve estar "Running"
- ✅ `OpenSignServer-container` - Deve estar "Running"  
- ✅ `OpenSign-container` - Deve estar "Running"

**Se algum estiver parado ou com erro:**
- Clique no container
- Veja os logs
- Identifique o erro

### 2. Verificar Logs do Frontend (Client)

O erro Bad Gateway geralmente vem do serviço `client` (frontend):

1. **No Coolify, clique no serviço `OpenSign-container`**
2. **Veja os logs** - Procure por:
   - Erros de conexão
   - Erros de build
   - Erros de inicialização
   - Erros relacionados ao `REACT_APP_SERVERURL`

### 3. Verificar Porta do Serviço

O Coolify precisa saber qual porta expor. Verifique:

1. **No docker-compose, o serviço `client` deve ter:**
   ```yaml
   expose:
     - "3000"
   labels:
     - "coolify.port=3000"
     - "coolify.expose=true"
   ```

2. **No Coolify, verifique:**
   - Settings → Port
   - Deve estar configurado para porta `3000`

## ✅ Soluções

### Solução 1: Verificar Variáveis de Ambiente

O frontend precisa da variável `REACT_APP_SERVERURL` correta:

```env
REACT_APP_SERVERURL=http://atssign.163.176.255.228.sslip.io/api/app
```

**Verifique no Coolify:**
1. Vá em Environment Variables
2. Confirme que `REACT_APP_SERVERURL` está definida
3. Confirme que termina com `/api/app`

### Solução 2: Reiniciar o Serviço Client

1. **No Coolify:**
   - Vá no serviço `OpenSign-container`
   - Clique em **Restart** ou **Stop** e depois **Start**

2. **Aguarde alguns segundos** para o serviço inicializar

3. **Verifique os logs** novamente

### Solução 3: Verificar se o Serviço Está Escutando

O serviço frontend precisa estar escutando na porta 3000:

1. **No Coolify, vá nos logs do `OpenSign-container`**
2. **Procure por mensagens como:**
   - "Server running on port 3000"
   - "Listening on port 3000"
   - Ou qualquer mensagem de inicialização

**Se não aparecer nada:**
- O serviço pode não estar iniciando
- Verifique erros anteriores nos logs

### Solução 4: Verificar Configuração do Coolify

1. **No Coolify, vá em Settings → Ports**
2. **Verifique:**
   - Porta interna: `3000`
   - Porta externa: Deve estar configurada

3. **Se não estiver configurado:**
   - Configure a porta `3000`
   - Salve
   - Faça redeploy

### Solução 5: Verificar Dependências

O serviço `client` depende do `server`. Verifique:

1. **O serviço `server` está rodando?**
   - Verifique logs do `OpenSignServer-container`
   - Deve estar escutando na porta 8080

2. **O MongoDB está rodando?**
   - Verifique logs do `mongo-container`
   - Deve estar escutando na porta 27017

### Solução 6: Forçar Redeploy

1. **No Coolify:**
   - Vá na aplicação
   - Clique em **Stop All**
   - Aguarde todos os containers pararem
   - Clique em **Deploy** novamente

2. **Aguarde o deploy completar**
3. **Verifique os logs de cada serviço**

## 🔧 Correção no Docker Compose

Se o problema persistir, pode ser necessário ajustar o docker-compose. Verifique se está assim:

```yaml
client:
  image: ghcr.io/paulo-atsinformatica/opensign:staging
  container_name: OpenSign-container
  depends_on:
    - server
  environment:
    - REACT_APP_SERVERURL=${REACT_APP_SERVERURL:-${SERVER_URL:-${HOST_URL}/api/app}}
  expose:
    - "3000"
  networks:
    - app-network
  restart: unless-stopped
  labels:
    - "coolify.port=3000"
    - "coolify.expose=true"
```

## 🐛 Troubleshooting Detalhado

### Erro nos Logs do Client

**Se aparecer erro sobre `REACT_APP_SERVERURL`:**
- A variável não está sendo passada corretamente
- Verifique se está definida no Coolify
- Faça redeploy após corrigir

**Se aparecer erro de conexão com a API:**
- Verifique se o serviço `server` está rodando
- Verifique se `REACT_APP_SERVERURL` aponta para a URL correta
- Teste a API diretamente: `http://atssign.163.176.255.228.sslip.io/api/app`

### Erro nos Logs do Server

**Se o server não estiver iniciando:**
- Verifique variáveis obrigatórias:
  - `DATABASE_URI`
  - `MASTER_KEY`
  - `APP_ID`
- Verifique logs do MongoDB
- Verifique se `USE_LOCAL=true` está definido

### Teste Manual da API

Teste se a API está respondendo:

```bash
curl http://atssign.163.176.255.228.sslip.io/api/app
```

Ou no navegador, acesse:
```
http://atssign.163.176.255.228.sslip.io/api/app
```

**Deve retornar:**
- Status 200 ou uma resposta JSON
- Não deve retornar "Bad Gateway"

## 📋 Checklist de Verificação

Antes de reportar o problema, verifique:

- [ ] Todos os containers estão "Running"
- [ ] Logs do `client` não mostram erros críticos
- [ ] Logs do `server` não mostram erros críticos
- [ ] `REACT_APP_SERVERURL` está definida e correta
- [ ] `SERVER_URL` está definida e termina com `/api/app`
- [ ] Porta 3000 está configurada no Coolify
- [ ] Labels `coolify.port` e `coolify.expose` estão no docker-compose
- [ ] API responde quando acessada diretamente

## 🚀 Solução Rápida (Passo a Passo)

1. **Pare todos os serviços no Coolify**
2. **Verifique todas as variáveis de ambiente** (veja `CORRECAO_VARIAVEIS.md`)
3. **Corrija `REACT_APP_SERVERURL`** se necessário:
   ```
   http://atssign.163.176.255.228.sslip.io/api/app
   ```
4. **Faça deploy novamente**
5. **Aguarde todos os serviços iniciarem**
6. **Verifique os logs de cada serviço**
7. **Tente acessar novamente**

## 💡 Dica Importante

O erro "Bad Gateway" geralmente significa:
- ✅ O Coolify está funcionando (consegue receber a requisição)
- ❌ O serviço backend não está respondendo ou não está acessível

**Foque em:**
1. Verificar se o serviço `client` está rodando
2. Verificar se o serviço `server` está rodando
3. Verificar se as variáveis de ambiente estão corretas
4. Verificar se os serviços conseguem se comunicar

## 📞 Próximos Passos

Se após seguir todos os passos ainda não funcionar:

1. **Copie os logs completos** de cada serviço
2. **Verifique as variáveis de ambiente** novamente
3. **Teste a API diretamente** no navegador
4. **Verifique a configuração de rede** no Coolify
