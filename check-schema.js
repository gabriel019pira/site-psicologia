// Script para verificar o schema do Supabase
const SUPABASE_URL = 'https://dpobhypdzgorabjlkppv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7-rieCzisyK5_WDG5oJ91g_cG4xHvJs';

async function checkSchema() {
    try {
        // Import Supabase (usando unpkg que retorna mais KB mas é mais confiável)
        const module = await import('https://unpkg.com/@supabase/supabase-js@2.39.0/dist/module.umd.js');
        const { createClient } = module;
        
        const client = createClient(SUPABASE_URL, SUPABASE_KEY);
        
        console.log('Conectado ao Supabase!');
        
        // Tentar listar todas as tabelas
        console.log('\n=== VERIFICANDO TABELA: agendamentos ===');
        const { data: agendamentos, error: errorAgendamentos } = await client
            .from('agendamentos')
            .select('*')
            .limit(1);
        
        if (errorAgendamentos) {
            console.log('Erro ao consultar agendamentos:', errorAgendamentos);
        } else {
            console.log('Dados da tabela agendamentos:', agendamentos);
        }
        
        console.log('\n=== VERIFICANDO TABELA: pacientes ===');
        const { data: pacientes, error: errorPacientes } = await client
            .from('pacientes')
            .select('*')
            .limit(1);
        
        if (errorPacientes) {
            console.log('Erro ao consultar pacientes:', errorPacientes);
        } else {
            console.log('Dados da tabela pacientes:', pacientes);
        }
        
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

// Executar se rodando no Node
if (typeof window === 'undefined') {
    checkSchema();
}
