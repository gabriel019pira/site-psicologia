-- Adicionar coluna CPF à tabela agendamentos
-- Execute esta query no Supabase SQL Editor

ALTER TABLE agendamentos ADD COLUMN cpf TEXT;

-- Criar índice no CPF para queries rápidas
CREATE INDEX idx_agendamentos_cpf ON agendamentos(cpf);

-- Adicionar CPF à tabela pacientes também
ALTER TABLE pacientes ADD COLUMN cpf TEXT UNIQUE;

-- Criar índice no CPF dos pacientes
CREATE INDEX idx_pacientes_cpf ON pacientes(cpf);
