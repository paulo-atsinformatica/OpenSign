# 🔐 Primeiro Login no OpenSign

## 📋 Informação Importante

**O OpenSign NÃO vem com usuário padrão pré-configurado.**

Você precisa **criar sua primeira conta** através da tela de cadastro.

## 🚀 Como Criar a Primeira Conta

### Passo 1: Acessar a Interface

1. **Abra o navegador**
2. **Acesse a URL da sua aplicação:**
   ```
   http://atssign.163.176.255.228.sslip.io
   ```

### Passo 2: Criar Conta

1. **Na tela inicial, você verá opções de:**
   - **Login** (se já tiver conta)
   - **Sign Up** ou **Cadastrar** (para criar nova conta)

2. **Clique em "Sign Up" ou "Cadastrar"**

3. **Preencha o formulário:**
   - **Email**: Seu email (ex: `admin@seudominio.com`)
   - **Senha**: Escolha uma senha segura
   - **Nome**: Seu nome completo
   - Outros campos solicitados

4. **Clique em "Criar Conta" ou "Sign Up"**

### Passo 3: Fazer Login

1. **Após criar a conta, você será redirecionado para o login**
2. **Digite o email e senha que acabou de criar**
3. **Clique em "Login" ou "Entrar"**

## 👤 Primeira Conta = Administrador

A **primeira conta criada** no sistema geralmente se torna o **administrador** automaticamente.

Você terá acesso a:
- ✅ Dashboard completo
- ✅ Gerenciar usuários
- ✅ Configurações do sistema
- ✅ Todas as funcionalidades

## 🔧 Se Não Conseguir Criar Conta

### Problema: Botão de cadastro não aparece

**Solução:**
- Verifique se o backend está rodando
- Verifique os logs do serviço `server`
- Verifique se `DATABASE_URI` está correto

### Problema: Erro ao criar conta

**Solução:**
1. **Verifique os logs do serviço `server`**
2. **Verifique se o MongoDB está rodando**
3. **Verifique variáveis de ambiente:**
   - `DATABASE_URI`
   - `APP_ID`
   - `MASTER_KEY`

### Problema: Erro de conexão com API

**Solução:**
1. **Verifique `REACT_APP_SERVERURL`:**
   ```
   http://atssign.163.176.255.228.sslip.io/api/app
   ```
2. **Teste a API diretamente:**
   ```
   http://atssign.163.176.255.228.sslip.io/api/app
   ```
3. **Verifique se o serviço `server` está rodando**

## 📝 Dicas de Segurança

### Para a Primeira Conta (Admin):

1. **Use um email profissional**
   - Ex: `admin@seudominio.com`
   - Não use emails pessoais temporários

2. **Use uma senha forte:**
   - Mínimo 12 caracteres
   - Combine letras, números e símbolos
   - Ex: `MinhaSenh@Segura123!`

3. **Guarde as credenciais em local seguro**
   - Use um gerenciador de senhas
   - Não compartilhe a senha do admin

## 🔄 Criar Outros Usuários

Após criar sua conta de administrador:

1. **Faça login**
2. **Vá em "Users" ou "Usuários"**
3. **Clique em "Add User" ou "Adicionar Usuário"**
4. **Preencha os dados do novo usuário**
5. **O usuário receberá um email de convite** (se SMTP estiver configurado)

## 🎯 Resumo

- ❌ **NÃO há** usuário padrão
- ✅ **Crie** sua primeira conta através do cadastro
- ✅ **Primeira conta** = Administrador
- ✅ **Use** email e senha fortes
- ✅ **Guarde** as credenciais com segurança

## 🆘 Ainda Não Funciona?

Se após seguir todos os passos ainda não conseguir criar conta:

1. **Verifique os logs completos** do serviço `server`
2. **Verifique se o MongoDB está acessível**
3. **Teste a API diretamente** no navegador
4. **Verifique todas as variáveis de ambiente** obrigatórias

## 📞 Checklist Antes de Criar Conta

- [ ] Interface está acessível (sem Bad Gateway)
- [ ] Serviço `server` está rodando
- [ ] Serviço `mongo` está rodando
- [ ] `DATABASE_URI` está correto
- [ ] `REACT_APP_SERVERURL` está correto
- [ ] API responde quando acessada diretamente
