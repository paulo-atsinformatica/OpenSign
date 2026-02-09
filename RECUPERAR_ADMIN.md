# 🔐 Recuperar Credenciais do Administrador

Se você está vendo a mensagem "Admin already exists", significa que já existe um administrador no banco de dados, mas você não sabe as credenciais.

## 🔍 Opções para Resolver

### Opção 1: Consultar o Banco de Dados (Recomendado)

Você pode consultar o MongoDB diretamente para ver quais usuários existem:

#### Via MongoDB Shell (se tiver acesso SSH)

```bash
# Conectar ao MongoDB
docker exec -it mongo-container mongosh

# Ou se estiver usando MongoDB do Coolify
# Acesse o container do MongoDB e execute mongosh

# Listar todos os usuários
use opensign
db._User.find().pretty()

# Listar apenas admins
db.contracts_Users.find({UserRole: "contracts_Admin"}).pretty()
```

Isso mostrará:
- Email do admin
- Nome
- Mas **NÃO** mostrará a senha (ela está criptografada)

#### Via Interface do MongoDB (se disponível)

1. Acesse a interface do MongoDB (se configurada)
2. Conecte ao banco `opensign`
3. Veja a collection `_User` para emails
4. Veja a collection `contracts_Users` para roles

### Opção 2: Resetar Senha do Admin via Script

Crie um script Node.js para resetar a senha do admin:

```javascript
// reset-admin-password.js
const Parse = require('parse/node');

Parse.initialize('atssign', 'YOUR_MASTER_KEY');
Parse.serverURL = 'http://atssign.163.176.255.228.sslip.io/api/app';

async function resetAdminPassword() {
  try {
    // Encontrar o admin
    const AdminQuery = new Parse.Query('contracts_Users');
    AdminQuery.equalTo('UserRole', 'contracts_Admin');
    const admin = await AdminQuery.first({ useMasterKey: true });
    
    if (!admin) {
      console.log('Nenhum admin encontrado');
      return;
    }
    
    const userId = admin.get('UserId').id;
    console.log('Admin encontrado:', admin.get('Email'));
    
    // Resetar senha
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });
    
    const newPassword = 'NovaSenha123!'; // Altere para uma senha segura
    user.set('password', newPassword);
    await user.save(null, { useMasterKey: true });
    
    console.log('Senha resetada com sucesso!');
    console.log('Email:', admin.get('Email'));
    console.log('Nova senha:', newPassword);
  } catch (error) {
    console.error('Erro:', error);
  }
}

resetAdminPassword();
```

**Para executar:**
1. No servidor do Coolify, acesse o container do server
2. Execute o script com Node.js

### Opção 3: Limpar Banco de Dados e Começar do Zero

⚠️ **ATENÇÃO**: Isso apagará TODOS os dados!

Se você não precisa dos dados existentes:

```bash
# Conectar ao MongoDB
docker exec -it mongo-container mongosh

# Deletar todas as collections
use opensign
db._User.deleteMany({})
db.contracts_Users.deleteMany({})
db.partners_Tenant.deleteMany({})
# ... outras collections conforme necessário
```

Depois, acesse `/addadmin` novamente para criar um novo admin.

### Opção 4: Usar Master Key para Criar Novo Admin

Se você tem acesso ao `MASTER_KEY`, pode criar um script para adicionar um novo admin ou resetar a senha.

## 🚀 Solução Rápida: Verificar Email do Admin

### Passo 1: Acessar MongoDB

No Coolify ou via SSH:

```bash
# Se usar docker-compose
docker exec -it mongo-container mongosh opensign

# Ou se usar MongoDB do Coolify
# Acesse o container e execute mongosh
```

### Passo 2: Listar Usuários Admin

```javascript
// No mongosh
db.contracts_Users.find({UserRole: "contracts_Admin"}).pretty()
```

Isso mostrará o email do admin.

### Passo 3: Tentar Recuperar Senha

1. **Na tela de login**, clique em "Esqueci minha senha" ou "Forgot Password"
2. **Digite o email do admin** que você encontrou
3. **Verifique o email** (se SMTP estiver configurado)

## 🔧 Script Prático para Resetar Senha

Crie um arquivo `reset-admin.js` no servidor:

```javascript
const Parse = require('parse/node');

// Configure com suas credenciais
Parse.initialize('atssign', process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL || 'http://atssign.163.176.255.228.sslip.io/api/app';

async function resetAdmin() {
  try {
    // Encontrar admin
    const query = new Parse.Query('contracts_Users');
    query.equalTo('UserRole', 'contracts_Admin');
    const admin = await query.first({ useMasterKey: true });
    
    if (!admin) {
      console.log('❌ Nenhum admin encontrado');
      return;
    }
    
    const email = admin.get('Email');
    const userId = admin.get('UserId').id;
    
    console.log('✅ Admin encontrado:', email);
    
    // Resetar senha
    const user = await new Parse.Query(Parse.User).get(userId, { useMasterKey: true });
    const newPassword = 'Admin123!@#'; // Mude para uma senha segura
    user.set('password', newPassword);
    await user.save(null, { useMasterKey: true });
    
    console.log('✅ Senha resetada!');
    console.log('📧 Email:', email);
    console.log('🔑 Nova senha:', newPassword);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

resetAdmin();
```

**Executar no container do server:**

```bash
# No Coolify, acesse o container do server
docker exec -it OpenSignServer-container node reset-admin.js
```

## 📋 Checklist de Verificação

- [ ] Verificar se consegue acessar o MongoDB
- [ ] Listar usuários existentes
- [ ] Identificar email do admin
- [ ] Tentar recuperar senha via "Esqueci minha senha"
- [ ] Se necessário, resetar senha via script
- [ ] Ou limpar banco e começar do zero

## 🆘 Se Nada Funcionar

### Última Opção: Limpar e Recriar

1. **Pare todos os serviços no Coolify**
2. **Acesse o MongoDB e delete as collections:**
   ```javascript
   db._User.deleteMany({})
   db.contracts_Users.deleteMany({})
   db.partners_Tenant.deleteMany({})
   ```
3. **Reinicie os serviços**
4. **Acesse `/addadmin` e crie um novo admin**

## 💡 Dica

**Para evitar isso no futuro:**
- Anote o email e senha do primeiro admin criado
- Use um gerenciador de senhas
- Configure recuperação de senha por email (SMTP)
