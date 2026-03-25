// Configuração do Supabase
const SUPABASE_URL = 'https://dpobhypdzgorabjlkppv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7-rieCzisyK5_WDG5oJ91g_cG4xHvJs';

// Importar biblioteca do Supabase
const { createClient } = supabase;

// Criar cliente Supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Função para registrar agendamento no Supabase
async function registrarAgendamentoSupabase(dados) {
    try {
        // Inserir paciente (se não existir)
        const { data: pacienteExistente } = await supabaseClient
            .from('pacientes')
            .select('id')
            .eq('telefone', dados.telefone)
            .single();

        if (!pacienteExistente) {
            await supabaseClient
                .from('pacientes')
                .insert([{
                    nome: dados.paciente,
                    email: dados.email,
                    telefone: dados.telefone
                }]);
        }

        // Inserir agendamento
        const { data, error } = await supabaseClient
            .from('agendamentos')
            .insert([{
                paciente: dados.paciente,
                email: dados.email,
                telefone: dados.telefone,
                data: dados.data,
                hora: dados.hora,
                motivo: dados.motivo,
                status: 'pendente'
            }])
            .select();

        if (error) throw error;
        return { sucesso: true, dados: data };
    } catch (error) {
        console.error('Erro ao registrar agendamento:', error);
        return { sucesso: false, erro: error.message };
    }
}

// Função para obter agendamentos de um paciente
async function obterAgendamentosPaciente(telefone) {
    try {
        const { data, error } = await supabaseClient
            .from('agendamentos')
            .select('*')
            .eq('telefone', telefone)
            .order('data', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao obter agendamentos:', error);
        return [];
    }
}

// Função para obter TODOS os agendamentos (admin)
async function obterTodosAgendamentos() {
    try {
        const { data, error } = await supabaseClient
            .from('agendamentos')
            .select('*')
            .order('data', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao obter agendamentos:', error);
        return [];
    }
}

// Função para atualizar status de agendamento
async function atualizarStatusAgendamento(id, novoStatus) {
    try {
        const { error } = await supabaseClient
            .from('agendamentos')
            .update({ status: novoStatus })
            .eq('id', id);

        if (error) throw error;
        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        return { sucesso: false, erro: error.message };
    }
}

// Função para deletar agendamento
async function deletarAgendamento(id) {
    try {
        const { error } = await supabaseClient
            .from('agendamentos')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        return { sucesso: false, erro: error.message };
    }
}

// Função para limpar todos os agendamentos
async function limparTodosAgendamentosSupabase() {
    try {
        const { error } = await supabaseClient
            .from('agendamentos')
            .delete()
            .not('id', 'is', null); // Deleta todos

        if (error) throw error;
        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao limpar agendamentos:', error);
        return { sucesso: false, erro: error.message };
    }
}
