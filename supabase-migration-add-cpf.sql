-- Migration: Adicionar suporte a autenticação por CPF
-- Execute esta query no Supabase SQL Editor

-- Criar índice no CPF da tabela agendamentos (se não existir)
CREATE INDEX IF NOT EXISTS idx_agendamentos_cpf ON agendamentos(cpf);

-- Adicionar CPF à tabela pacientes (se não existir)
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS cpf TEXT UNIQUE;

-- Criar índice no CPF dos pacientes (se não existir)
CREATE INDEX IF NOT EXISTS idx_pacientes_cpf ON pacientes(cpf);
