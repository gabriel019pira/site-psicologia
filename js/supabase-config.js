// Configuração do Supabase
const SUPABASE_URL = 'https://dpobhypdzgorabjlkppv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7-rieCzisyK5_WDG5oJ91g_cG4xHvJs';

// Variável global para o cliente Supabase
let supabaseClient = null;

// Função para aguardar e inicializar o cliente Supabase
function initSupabaseClient() {
    if (supabaseClient) return supabaseClient; // Já inicializado
    
    // Aguardar que a biblioteca Supabase esteja disponível
    if (typeof window.supabase === 'undefined') {
        console.warn('Biblioteca Supabase ainda não carregou. Aguardando...');
        return null;
    }
    
    const { createClient } = window.supabase;
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
    return supabaseClient;
}

// Aguardar carregamento da biblioteca Supabase
function ensureSupabaseLoaded() {
    return new Promise((resolve) => {
        if (typeof window.supabase !== 'undefined') {
            resolve();
        } else {
            // Tentar novamente a cada 100ms até 5 segundos
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (typeof window.supabase !== 'undefined' || attempts > 50) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        }
    });
}

// Função para registrar agendamento no Supabase
async function registrarAgendamentoSupabase(dados) {
    try {
        // Garantir que o Supabase está carregado
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não carregou corretamente');
        }

        // Inserir paciente (se não existir)
        const { data: pacienteExistente } = await client
            .from('pacientes')
            .select('id')
            .eq('telefone', dados.telefone)
            .single();

        if (!pacienteExistente) {
            await client
                .from('pacientes')
                .insert([{
                    nome: dados.nome,
                    email: dados.email,
                    telefone: dados.telefone
                }]);
        }

        // Inserir agendamento
        const { data, error } = await client
            .from('agendamentos')
            .insert([{
                nome: dados.nome,
                email: dados.email,
                telefone: dados.telefone,
                data: dados.data,
                hora: dados.hora,
                motivo: dados.motivo,
                status: 'pendente'
            }])
            .select();

        if (error) throw error;
        return data[0]; // Retornar o primeiro agendamento inserido
    } catch (error) {
        console.error('Erro ao registrar agendamento:', error);
        throw error;
    }
}

// Função para obter agendamentos de um paciente
async function obterAgendamentosPaciente(telefone) {
    try {
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não carregou corretamente');
        }

        const { data, error } = await client
            .from('agendamentos')
            .select('*')
            .eq('telefone', telefone)
            .order('data', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao obter agendamentos:', error);
        throw error;
    }
}

// Função para obter TODOS os agendamentos (admin)
async function obterTodosAgendamentos() {
    try {
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não carregou corretamente');
        }

        const { data, error } = await client
            .from('agendamentos')
            .select('*')
            .order('data', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao obter agendamentos:', error);
        throw error;
    }
}

// Função para atualizar status de agendamento
async function atualizarStatusAgendamento(id, novoStatus) {
    try {
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não carregou corretamente');
        }

        const { error } = await client
            .from('agendamentos')
            .update({ status: novoStatus })
            .eq('id', id);

        if (error) throw error;
        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        throw error;
    }
}

// Função para deletar agendamento
async function deletarAgendamento(id) {
    try {
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não carregou corretamente');
        }

        const { error } = await client
            .from('agendamentos')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        throw error;
    }
}

// Função para limpar todos os agendamentos
async function limparTodosAgendamentosSupabase() {
    try {
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não carregou corretamente');
        }

        const { error } = await client
            .from('agendamentos')
            .delete()
            .not('id', 'is', null); // Deleta todos

        if (error) throw error;
        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao limpar agendamentos:', error);
        throw error;
    }
}
