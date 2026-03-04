# Customizações deste fork

Este documento lista alterações feitas no fork em relação ao repositório original (OpenSignLabs/OpenSign), para facilitar a reaplicação após sincronizações (`git merge upstream/main`).

## Equipes (Settings → Teams)

Funcionalidade de gestão de equipes em **Configurações → Equipes**, visível apenas para admins (contracts_Admin / contracts_OrgAdmin).

### Arquivos novos (não existem no original)

- **`apps/OpenSign/src/pages/TeamList.jsx`** – Página de listagem, criação, edição e ativação/desativação de equipes.
- **`apps/OpenSignServer/cloud/parsefunction/saveTeam.js`** – Cloud function para criar/atualizar equipes (respeitando organização do usuário).

### Alterações em arquivos existentes

Em caso de conflito no merge, reaplique o seguinte:

1. **`apps/OpenSign/src/json/menuJson.js`**  
   Em `userssetting`, adicione o item Teams após Users:
   ```js
   {
     icon: "fa-light fa-user-group fa-fw",
     title: "Teams",
     target: "_self",
     pageType: "",
     description: "",
     objectId: "teams"
   }
   ```

2. **`apps/OpenSign/src/App.jsx`**  
   - Import: `const TeamList = lazyWithRetry(() => import("./pages/TeamList"));`
   - Rota (junto às rotas do HomeLayout): `<Route path="/teams" element={<Lazy Page={TeamList} />} />`

3. **`apps/OpenSignServer/cloud/main.js`**  
   - Import: `import saveTeam from './parsefunction/saveTeam.js';`
   - Define: `Parse.Cloud.define('saveteam', saveTeam);`

4. **Traduções** (opcional, se as chaves forem sobrescritas):  
   Em `report-heading`: `"Team status": "..."`, `"Edit": "..."` (en e pt-BR já possuem equivalentes).

O menu **Settings** já monta os itens de `subSetting` para admins no `Sidebar.jsx`; ao incluir Teams em `userssetting`, ele passa a aparecer automaticamente em Configurações para usuários admin.
