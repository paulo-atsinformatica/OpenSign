# 🐳 Configuração do GitHub Container Registry (GHCR)

Este guia explica como as imagens Docker são construídas e enviadas para o GitHub Container Registry.

## 📋 O que foi configurado

### 1. GitHub Actions Workflow

Foi criado o arquivo `.github/workflows/ghcr.yml` que:

- **Dispara automaticamente** quando há push nas branches `main` ou `staging`
- **Constrói 2 imagens**:
  - `ghcr.io/paulo-atsinformatica/opensign` (frontend)
  - `ghcr.io/paulo-atsinformatica/opensignserver` (backend)
- **Suporta múltiplas arquiteturas**: AMD64 e ARM64
- **Usa cache** para builds mais rápidos

### 2. Docker Compose Atualizado

O `docker-compose.coolify.yml` foi atualizado para usar as imagens do GHCR:

```yaml
server:
  image: ghcr.io/paulo-atsinformatica/opensignserver:staging

client:
  image: ghcr.io/paulo-atsinformatica/opensign:staging
```

## 🚀 Como funciona

### Build Automático

1. **Quando você faz push** para `staging` ou `main`:
   - O GitHub Actions detecta automaticamente
   - Inicia o workflow de build
   - Constrói as imagens Docker
   - Faz push para `ghcr.io/paulo-atsinformatica/`

2. **Tags das imagens**:
   - `staging` - para a branch staging
   - `main` ou `latest` - para a branch main
   - `staging-<sha>` - commit específico

### Visualizar as Imagens

Acesse: `https://github.com/paulo-atsinformatica/OpenSign/pkgs/container/opensign`

Ou:
- `https://github.com/paulo-atsinformatica/OpenSign/pkgs/container/opensignserver`

## 🔧 Configuração no Coolify

### Opção 1: Usar Imagens do GHCR (Recomendado)

1. **No Coolify, configure a aplicação:**
   - **Docker Compose File**: `docker-compose.coolify.yml`
   - As imagens serão puxadas do GHCR automaticamente

2. **Autenticação no GHCR** (se necessário):
   - No Coolify, adicione um secret:
     - **Name**: `GHCR_TOKEN`
     - **Value**: Seu Personal Access Token do GitHub com permissão `read:packages`

3. **No docker-compose, adicione** (se necessário):
   ```yaml
   server:
     image: ghcr.io/paulo-atsinformatica/opensignserver:staging
     # Se precisar de autenticação:
     # registry: ghcr.io
     # username: paulo-atsinformatica
     # password: ${GHCR_TOKEN}
   ```

### Opção 2: Build Local no Coolify

Se preferir construir localmente:

1. **Use o arquivo alternativo:**
   - **Docker Compose File**: `docker-compose.coolify.build.yml`
   - Isso construirá as imagens no próprio Coolify

## 🔐 Permissões e Segurança

### Permissões do Workflow

O workflow usa:
- `GITHUB_TOKEN` - Token automático do GitHub Actions
- Permissões: `contents: read`, `packages: write`

### Visibilidade das Imagens

Por padrão, as imagens no GHCR são **privadas**. Para torná-las públicas:

1. Acesse: `https://github.com/paulo-atsinformatica/OpenSign/pkgs/container/opensign`
2. Clique em **Package settings**
3. Em **Danger Zone**, clique em **Change visibility** → **Public**

## 📝 Atualizar Imagens

### Atualização Automática

- **Push para staging**: Imagens são atualizadas automaticamente
- **Push para main**: Imagens são atualizadas automaticamente

### Atualização Manual

Você pode disparar o workflow manualmente:

1. Vá em **Actions** no GitHub
2. Selecione **Build and Push to GHCR**
3. Clique em **Run workflow**
4. Selecione a branch e clique em **Run workflow**

## 🐛 Troubleshooting

### Erro: "unauthorized: authentication required"

**Solução**: Verifique se o `GITHUB_TOKEN` tem permissões corretas. O token automático do GitHub Actions já tem as permissões necessárias.

### Erro: "pull access denied"

**Solução**: 
1. Se as imagens são privadas, configure autenticação no Coolify
2. Ou torne as imagens públicas no GitHub

### Build não está sendo disparado

**Solução**:
1. Verifique se o workflow está na branch correta
2. Verifique se há push na branch `staging` ou `main`
3. Veja os logs em **Actions** no GitHub

## 📚 Recursos

- [GitHub Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Coolify Docker Compose Docs](https://coolify.io/docs/docker-compose)

## ✅ Checklist

- [x] Workflow criado (`.github/workflows/ghcr.yml`)
- [x] Docker Compose atualizado para usar imagens do GHCR
- [x] Documentação criada
- [ ] Fazer push para disparar o primeiro build
- [ ] Verificar se as imagens foram criadas no GHCR
- [ ] Configurar visibilidade (pública ou privada)
- [ ] Testar pull das imagens no Coolify
