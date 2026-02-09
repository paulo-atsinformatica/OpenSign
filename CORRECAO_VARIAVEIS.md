# 🔧 Correção das Variáveis de Ambiente

Baseado na sua configuração atual, aqui estão as correções necessárias:

## ❌ Problemas Identificados

1. **SERVER_URL** está sem `/api/app` no final
2. **REACT_APP_SERVERURL** está sem `/api/app` no final  
3. Variáveis vazias podem causar problemas
4. SMTP ainda tem valores de exemplo

## ✅ Configuração Corrigida

### Variáveis Obrigatórias (Corrigidas)

```env
# URL principal (use http:// se não tiver SSL, https:// se tiver)
HOST_URL=http://atssign.163.176.255.228.sslip.io

# MongoDB
DATABASE_URI=mongodb://mongo:27017/opensign
MONGODB_URI=mongodb://mongo:27017/opensign

# Parse Server
APP_ID=atssign
MASTER_KEY=ehfZ0to+LFWwPlGXVh656B3rRtqdkfUJCqInszfTP/E=

# ⚠️ CORRIGIR: Adicionar /api/app no final
SERVER_URL=http://atssign.163.176.255.228.sslip.io/api/app
PUBLIC_URL=http://atssign.163.176.255.228.sslip.io

# ⚠️ CORRIGIR: Adicionar /api/app no final
REACT_APP_SERVERURL=http://atssign.163.176.255.228.sslip.io/api/app

# Node
NODE_ENV=production
PORT=8080
```

### Variáveis de Email (Atualizar com seus dados reais)

```env
SMTP_ENABLE=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER_EMAIL=seu-email-real@gmail.com
SMTP_PASSWORD=sua-app-password-real
SMTP_USERNAME=seu-email-real@gmail.com
SMTP_SECURE=false
```

### Storage (Local - Correto)

```env
USE_LOCAL=true
```

### Variáveis Opcionais (Remover se vazias)

**IMPORTANTE**: No Coolify, **NÃO defina variáveis vazias**. Remova estas variáveis se não tiver valores:

- `DO_SECRET_ACCESS_KEY` (remover se vazia)
- `GOOGLE_CLIENT_SECRET` (remover se vazia)
- `FILE_KEY` (remover se vazia)
- `DO_ENDPOINT` (remover se vazia)
- `DO_SPACE` (remover se vazia)
- `SMTP_PASS` (remover se vazia)
- `DO_BASEURL` (remover se vazia)
- `MAILGUN_API_KEY` (remover se vazia)
- `MAILGUN_DOMAIN` (remover se vazia)
- `MAILGUN_SENDER` (remover se vazia)
- `DO_REGION` (remover se vazia)
- `DO_ACCESS_KEY_ID` (remover se vazia)
- `GOOGLE_CLIENT_ID` (remover se vazia)

### Variáveis que devem permanecer

```env
PARSE_MOUNT=/app
```

## 📝 Configuração Final Recomendada

### Mínimo Necessário (Copie e cole no Coolify)

```env
HOST_URL=http://atssign.163.176.255.228.sslip.io
DATABASE_URI=mongodb://mongo:27017/opensign
MONGODB_URI=mongodb://mongo:27017/opensign
APP_ID=atssign
MASTER_KEY=ehfZ0to+LFWwPlGXVh656B3rRtqdkfUJCqInszfTP/E=
SERVER_URL=http://atssign.163.176.255.228.sslip.io/api/app
PUBLIC_URL=http://atssign.163.176.255.228.sslip.io
REACT_APP_SERVERURL=http://atssign.163.176.255.228.sslip.io/api/app
NODE_ENV=production
PORT=8080
USE_LOCAL=true
PARSE_MOUNT=/app
```

### Com Email SMTP (Adicione estas se quiser enviar emails)

```env
SMTP_ENABLE=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER_EMAIL=seu-email-real@gmail.com
SMTP_PASSWORD=sua-app-password-real
SMTP_USERNAME=seu-email-real@gmail.com
SMTP_SECURE=false
```

## 🔧 Como Corrigir no Coolify

1. **Acesse sua aplicação no Coolify**
2. **Vá em Environment Variables**
3. **Para cada variável que precisa corrigir:**
   - Clique na variável
   - Edite o valor
   - Salve

4. **Para variáveis vazias:**
   - **DELETE** as variáveis que estão vazias
   - Não deixe variáveis com valor vazio

5. **Correções específicas:**
   - `SERVER_URL`: Mude de `http://atssign.163.176.255.228.sslip.io` para `http://atssign.163.176.255.228.sslip.io/api/app`
   - `REACT_APP_SERVERURL`: Mude de `http://atssign.163.176.255.228.sslip.io` para `http://atssign.163.176.255.228.sslip.io/api/app`

6. **Após corrigir:**
   - Faça um **redeploy** da aplicação
   - Verifique os logs para confirmar que está funcionando

## ⚠️ Importante sobre SMTP

Se você configurou SMTP mas ainda não tem as credenciais reais:

1. **Opção 1**: Remova todas as variáveis SMTP (aplicação funcionará sem envio de emails)
2. **Opção 2**: Configure com suas credenciais reais do Gmail:
   - Use **App Password** do Gmail (não a senha normal)
   - Como criar App Password: https://support.google.com/accounts/answer/185833

## 🔍 Verificação

Após corrigir, verifique:

1. ✅ `SERVER_URL` termina com `/api/app`
2. ✅ `REACT_APP_SERVERURL` termina com `/api/app`
3. ✅ Não há variáveis vazias
4. ✅ `USE_LOCAL=true` está definido
5. ✅ `MASTER_KEY` está definido e seguro

## 🚀 Após Corrigir

1. Faça um **redeploy** no Coolify
2. Verifique os logs do servidor
3. Acesse a aplicação no navegador
4. Teste o login/cadastro
