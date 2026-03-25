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

-- Criar índice no telefone para queries rápidas
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

-- Criar índices para melhor performance
CREATE INDEX idx_agendamentos_telefone ON agendamentos(telefone);
CREATE INDEX idx_agendamentos_data ON agendamentos(data);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);

-- IMPORTANTE: Habilitarcriteria de acesso (RLS - Row Level Security)
-- Para desenvolvimento, enable SELECT/INSERT/UPDATE/DELETE para anônimos

-- Habilitar RLS
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas para desenvolvimento
-- ADVERTÊNCIA: Isso é INSEGURO em produção! Apenas para desenvolvimento.

CREATE POLICY "Allow anonymous to read pacientes"
    ON pacientes FOR SELECT
    USING (true);

CREATE POLICY "Allow anonymous to insert pacientes"
    ON pacientes FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous to update pacientes"
    ON pacientes FOR UPDATE
    USING (true);

CREATE POLICY "Allow anonymous to delete pacientes"
    ON pacientes FOR DELETE
    USING (true);

CREATE POLICY "Allow anonymous to read agendamentos"
    ON agendamentos FOR SELECT
    USING (true);

CREATE POLICY "Allow anonymous to insert agendamentos"
    ON agendamentos FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous to update agendamentos"
    ON agendamentos FOR UPDATE
    USING (true);

CREATE POLICY "Allow anonymous to delete agendamentos"
    ON agendamentos FOR DELETE
    USING (true);
