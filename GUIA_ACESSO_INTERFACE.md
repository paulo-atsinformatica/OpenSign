# 🌐 Guia de Acesso à Interface do OpenSign

Este guia explica como acessar a interface web do OpenSign após o deploy no Coolify.

## 📋 Pré-requisitos

1. ✅ Deploy realizado com sucesso no Coolify
2. ✅ Variáveis de ambiente configuradas corretamente
3. ✅ Todos os serviços rodando (mongo, server, client)

## 🚀 Passo 1: Configurar Domínio no Coolify

### Opção A: Usar o Domínio do Coolify (Temporário para Teste)

1. **No Coolify, vá na sua aplicação**
2. **Vá em Settings → Domains**
3. **O Coolify já deve ter gerado um domínio automático**, algo como:
   - `atssign-xxxxx.coolify.io`
   - Ou use o IP que você configurou: `http://atssign.163.176.255.228.sslip.io`

### Opção B: Configurar Domínio Personalizado

1. **No Coolify, vá em Settings → Domains**
2. **Clique em "Add Domain"**
3. **Digite seu domínio**: `atssign.163.176.255.228.sslip.io`
4. **O Coolify configurará SSL automaticamente** (se disponível)

## 🔗 Passo 2: Acessar a Interface

### URL de Acesso

Baseado na sua configuração, acesse:

```
http://atssign.163.176.255.228.sslip.io
```

Ou se o Coolify gerou um domínio:

```
https://atssign-xxxxx.coolify.io
```

### Verificar se Está Funcionando

1. **Abra o navegador**
2. **Digite a URL** acima
3. **Você deve ver a tela de login/cadastro do OpenSign**

## 🔍 Passo 3: Verificar Status dos Serviços

Antes de acessar, verifique se todos os serviços estão rodando:

### No Coolify:

1. **Vá na sua aplicação**
2. **Verifique os containers:**
   - ✅ `mongo-container` - Deve estar "Running"
   - ✅ `OpenSignServer-container` - Deve estar "Running"
   - ✅ `OpenSign-container` - Deve estar "Running"

3. **Verifique os logs:**
   - Clique em cada serviço
   - Veja os logs para garantir que não há erros

## 🐛 Troubleshooting

### Erro: "Cannot connect" ou "Connection refused"

**Solução:**
1. Verifique se todos os containers estão rodando
2. Verifique os logs do serviço `client` (frontend)
3. Verifique se o domínio está configurado corretamente

### Erro: "API Error" ou "Cannot reach server"

**Solução:**
1. Verifique se `REACT_APP_SERVERURL` está correto:
   ```
   http://atssign.163.176.255.228.sslip.io/api/app
   ```
2. Verifique os logs do serviço `server` (backend)
3. Verifique se `SERVER_URL` está configurado corretamente

### Página em Branco

**Solução:**
1. Abra o Console do Navegador (F12)
2. Veja se há erros JavaScript
3. Verifique se `REACT_APP_SERVERURL` está correto
4. Verifique os logs do serviço `client`

### Erro 404

**Solução:**
1. Verifique se o domínio está configurado no Coolify
2. Verifique se o serviço `client` está exposto corretamente
3. Verifique os labels no docker-compose:
   ```yaml
   labels:
     - "coolify.port=3000"
     - "coolify.expose=true"
   ```

## 📝 Passo 4: Primeiro Acesso

### Criar Conta de Administrador

1. **Acesse a interface** (URL acima)
2. **Clique em "Sign Up" ou "Cadastrar"**
3. **Preencha o formulário:**
   - Email
   - Senha
   - Nome
4. **Faça login** com as credenciais criadas

### Verificar Funcionalidades

Após fazer login, teste:

1. ✅ **Dashboard** - Deve carregar
2. ✅ **Upload de Documento** - Teste fazer upload
3. ✅ **Criar Assinatura** - Teste criar uma assinatura
4. ✅ **Enviar para Assinar** - Teste enviar documento

## 🔧 Configurações Importantes

### URLs que Devem Estar Corretas

No Coolify, verifique estas variáveis:

```env
# URL principal (onde você acessa a interface)
HOST_URL=http://atssign.163.176.255.228.sslip.io

# URL da API (deve terminar com /api/app)
SERVER_URL=http://atssign.163.176.255.228.sslip.io/api/app

# URL pública (geralmente igual ao HOST_URL)
PUBLIC_URL=http://atssign.163.176.255.228.sslip.io

# URL da API para o frontend (deve terminar com /api/app)
REACT_APP_SERVERURL=http://atssign.163.176.255.228.sslip.io/api/app
```

## 🌐 Estrutura de URLs

### Frontend (Interface Web)
```
http://atssign.163.176.255.228.sslip.io
```
- Esta é a URL que você acessa no navegador
- Serve a interface React do OpenSign

### Backend (API)
```
http://atssign.163.176.255.228.sslip.io/api/app
```
- Esta é a URL da API
- O frontend usa esta URL para fazer requisições
- Deve terminar com `/api/app`

## 🔐 Segurança

### HTTPS (Recomendado para Produção)

Se você tiver um domínio próprio:

1. **Configure SSL no Coolify:**
   - Vá em Settings → Domains
   - O Coolify configurará SSL automaticamente

2. **Atualize as variáveis para HTTPS:**
   ```env
   HOST_URL=https://seu-dominio.com
   SERVER_URL=https://seu-dominio.com/api/app
   PUBLIC_URL=https://seu-dominio.com
   REACT_APP_SERVERURL=https://seu-dominio.com/api/app
   ```

## 📱 Acesso Mobile

A interface do OpenSign é responsiva e funciona em:

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

Acesse a mesma URL no navegador do celular.

## 🎯 Checklist de Acesso

Antes de acessar, verifique:

- [ ] Todos os containers estão rodando
- [ ] Domínio configurado no Coolify
- [ ] `HOST_URL` está correto
- [ ] `SERVER_URL` termina com `/api/app`
- [ ] `REACT_APP_SERVERURL` termina com `/api/app`
- [ ] `PUBLIC_URL` está correto
- [ ] Logs não mostram erros críticos

## 🆘 Ainda Não Consegue Acessar?

1. **Verifique os logs no Coolify:**
   - Logs do serviço `client` (frontend)
   - Logs do serviço `server` (backend)
   - Logs do serviço `mongo` (banco de dados)

2. **Verifique o Console do Navegador:**
   - Pressione F12
   - Vá na aba "Console"
   - Veja se há erros JavaScript

3. **Teste a API diretamente:**
   ```
   http://atssign.163.176.255.228.sslip.io/api/app/health
   ```
   Ou:
   ```
   http://atssign.163.176.255.228.sslip.io/api/app
   ```

4. **Verifique a rede:**
   - Teste se o servidor está acessível
   - Verifique firewall/portas

## 📚 Próximos Passos

Após conseguir acessar:

1. ✅ Criar conta de administrador
2. ✅ Configurar perfil
3. ✅ Testar upload de documentos
4. ✅ Testar criação de assinaturas
5. ✅ Configurar templates (opcional)
6. ✅ Configurar integrações (opcional)
