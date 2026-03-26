# 🔧 Guia de Troubleshooting - Site Psicologia

## ⚠️ Problema: "Painel do Administrador não está interativo" ou "Agendamentos não carregam"

### Solução Rápida
1. **Recarregue a página** (pressione `F5`)
2. Se continuar, **limpe o cache** (pressione `Ctrl+Shift+Delete` ou `Cmd+Shift+Delete`)
3. **Desative extensões** do navegador que bloqueiam requisições (ex: uBlock Origin em modo rigoroso)

### Passos de Diagnóstico

#### 1️⃣ Verificar se a página está carregando
- Abra o Console do Navegador: pressione `F12`
- Vá para a aba **Console**
- Procure por mensagens com ✓ ou ❌

**Procure por:**
- ✓ "Supabase carregou com sucesso" → **Tudo bem!**
- ❌ "Falha ao carregar" → **Problema com CDN**
- "Supabase não carregou após 15s" → **Timeout**

#### 2️⃣ Verificar se há erros de CORS
Na aba **Console**, procure por "CORS" ou mensagens de erro vermelhas.

Se ver algo como:
```
Access to XMLHttpRequest at '...' blocked by CORS policy
```

**Solução:**
- Este é um problema de segurança do navegador
- Teste em outro navegador ou modo privado
- Aguarde e tente novamente (o CDN pode estar restaurando)

#### 3️⃣ Verificar Conexão de Internet
- Verifique se está conectado à internet
- Teste em outro website (ex: google.com)
- Se o internet está ok, o problema é com o CDN Supabase

### 🚀 Como o Sistema de Carregamento Funciona

O site tenta carregar Supabase de 3 CDNs diferentes (em ordem):
1. **jsdelivr.net** (mais confiável, recomendado)
2. **skypack.dev** (fallback)
3. **esm.sh** (último fallback)

Se todos falharem após 15 segundos, você verá uma mensagem de erro.

---

## 📱 Problema: "Não consigo agendar no site online mas funciona localmente"

### Causas Possíveis

| Causa | Sintoma | Solução |
|-------|--------|--------|
| **Internet lenta** | Carregamento muito demorado | Aguarde mais tempo ou tente novamente |
| **CDN bloqueado** | Mensagem de erro após 15s | Desative bloqueadores, use outro navegador |
| **Chaves Supabase inválidas** | Erro de autenticação | Contate o desenvolvedor |
| **Banco de dados offline** | Erro ao conectar | Aguarde (problema do servidor) |

### ✅ Checklist

- [ ] Página carrega sem erros?
- [ ] Console mostra "✓ Supabase carregou com sucesso"?
- [ ] Pode clicar nos botões?
- [ ] Mensagens de erro são mostradas?

---

## 🗂️ Estrutura de Carregamento

```
HTML (admin.html, agendamento.html, meus-agendamentos.html)
  ↓
ESM Module Script carrega Supabase do CDN
  ↓
supabase-config.js carrega com o cliente Supabase
  ↓
agendamento.js carrega com funções auxiliares
  ↓
DOMContentLoaded → inicializa formulário/painel
```

---

## 💡 Dicas de Developer

### Para ver logs detalhados:
```javascript
// No Console do Navegador (F12), execute:
console.log('Supabase carregado?', window.supabase ? 'SIM' : 'NÃO');
console.log('Createclient disponível?', typeof window.supabase?.createClient);
```

### Para testar conexão Supabase:
```javascript
// No Console, execute:
window.initSupabaseClient();
console.log('Cliente Supabase:', supabaseClient ? 'OK' : 'ERRO');
```

### URLs dos CDNs:
- jQuery: https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
- Skypack: https://cdn.skypack.dev/@supabase/supabase-js
- esm.sh: https://esm.sh/@supabase/supabase-js@2

---

## 📞 Precisa de Ajuda?

1. **Verifique o Console (F12)** e copie a mensagem de erro exata
2. **Teste em outro navegador** para confirmar se é navegador
3. **Limpe cache** e tente novamente
4. **Procure por "CORS" nos logs** - indica problema de segurança

Se nada funcionar, provide:
- ✓ Print do erro no Console
- ✓ Qual navegador está usando
- ✓ Se funciona localmente (file://)
- ✓ Se funciona online (github pages)
