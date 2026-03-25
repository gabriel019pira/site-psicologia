# 🔧 Como Configurar o Banco de Dados Supabase

## ⚠️ IMPORTANTE: Você precisa fazer isso AGORA para que o site funcione!

### Passo 1: Acessar o Dashboard do Supabase
1. Entre em: https://app.supabase.com
2. Clique no seu projeto `site-psicologia`
3. No menu esquerdo, clique em **"SQL Editor"**

### Passo 2: Criar as Tabelas
1. Clique no botão **"+ New Query"** (ou "New SQL Query")
2. **Cole todo o código abaixo** na caixa de texto:

```sql
-- Limpar tabelas existentes (se houver)
DROP TABLE IF EXISTS agendamentos CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;

-- Criar tabela de pacientes
CREATE TABLE pacientes (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pacientes_telefone ON pacientes(telefone);

-- Criar tabela de agendamentos
CREATE TABLE agendamentos (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT NOT NULL,
    data DATE NOT NULL,
    hora TEXT NOT NULL,
    motivo TEXT,
    status TEXT DEFAULT 'pendente',
    paciente_id BIGINT REFERENCES pacientes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agendamentos_telefone ON agendamentos(telefone);
CREATE INDEX idx_agendamentos_data ON agendamentos(data);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);

-- Habilitar RLS (Row Level Security)
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (APENAS para desenvolvimento!)
CREATE POLICY "Allow anonymous to read pacientes"
    ON pacientes FOR SELECT USING (true);

CREATE POLICY "Allow anonymous to insert pacientes"
    ON pacientes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous to update pacientes"
    ON pacientes FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous to delete pacientes"
    ON pacientes FOR DELETE USING (true);

CREATE POLICY "Allow anonymous to read agendamentos"
    ON agendamentos FOR SELECT USING (true);

CREATE POLICY "Allow anonymous to insert agendamentos"
    ON agendamentos FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous to update agendamentos"
    ON agendamentos FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous to delete agendamentos"
    ON agendamentos FOR DELETE USING (true);
```

### Passo 3: Executar o SQL
1. Clique no botão **"▶ Run"** ou **"Execute"** (no canto superior direito)
2. Espere até que apareça a mensagem: **"Success ✓"**
3. Se houver erros, copie a mensagem de erro e me compartilhe

### Passo 4: Verificar se Funcionou
1. No menu esquerdo do Supabase, clique em **"Table Editor"**
2. Você deve ver duas tabelas:
   - ✅ `pacientes`
   - ✅ `agendamentos`

### Passo 5: Testar o Site
1. Volte para: https://gabriel019pira.github.io/site-psicologia
2. Limpe o cache do navegador (`Ctrl + Shift + Delete`)
3. Recarregue a página
4. Tente agendar uma consulta

---

## ⚠️ AVISO DE SEGURANÇA
O SQL acima **abre o banco para qualquer um inserir/ler/deletar dados**. Isso é APENAS para desenvolvimento/teste. **Em produção**, você precisa melhorar a segurança com autenticação real e políticas RLS mais restritivas.
