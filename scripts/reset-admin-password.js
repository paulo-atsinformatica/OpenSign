#!/usr/bin/env node
/**
 * Script para resetar senha do administrador
 * 
 * Uso:
 *   node reset-admin-password.js <nova-senha>
 * 
 * Ou configure as variáveis de ambiente:
 *   MASTER_KEY=sua-chave
 *   SERVER_URL=http://seu-servidor/api/app
 *   APP_ID=atssign
 */

const Parse = require('parse/node');

// Configuração
const APP_ID = process.env.APP_ID || 'atssign';
const MASTER_KEY = process.env.MASTER_KEY;
const SERVER_URL = process.env.SERVER_URL || 'http://atssign.163.176.255.228.sslip.io/api/app';
const NEW_PASSWORD = process.argv[2] || 'Admin123!@#';

if (!MASTER_KEY) {
  console.error('❌ Erro: MASTER_KEY não definida');
  console.log('Defina a variável de ambiente MASTER_KEY ou passe como argumento');
  process.exit(1);
}

Parse.initialize(APP_ID);
Parse.serverURL = SERVER_URL;
Parse.masterKey = MASTER_KEY;

async function resetAdminPassword() {
  try {
    console.log('🔍 Procurando administrador...');
    
    // Encontrar o admin
    const AdminQuery = new Parse.Query('contracts_Users');
    AdminQuery.equalTo('UserRole', 'contracts_Admin');
    AdminQuery.notEqualTo('IsDisabled', true);
    const admin = await AdminQuery.first({ useMasterKey: true });
    
    if (!admin) {
      console.log('❌ Nenhum administrador encontrado');
      console.log('💡 Você pode criar um novo admin acessando /addadmin');
      return;
    }
    
    const email = admin.get('Email');
    const name = admin.get('Name');
    const userId = admin.get('UserId').id;
    
    console.log('✅ Administrador encontrado:');
    console.log('   Nome:', name);
    console.log('   Email:', email);
    
    // Resetar senha
    console.log('\n🔐 Resetando senha...');
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });
    
    user.set('password', NEW_PASSWORD);
    await user.save(null, { useMasterKey: true });
    
    console.log('\n✅ Senha resetada com sucesso!');
    console.log('\n📋 Credenciais:');
    console.log('   Email:', email);
    console.log('   Nova senha:', NEW_PASSWORD);
    console.log('\n⚠️  IMPORTANTE: Altere esta senha após fazer login!');
    
  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error.message);
    if (error.code) {
      console.error('   Código:', error.code);
    }
    process.exit(1);
  }
}

resetAdminPassword();
