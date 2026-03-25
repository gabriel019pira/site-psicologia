// Configuração do Supabase
const SUPABASE_URL = 'https://dpobhypdzgorabjlkppv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7-rieCzisyK5_WDG5oJ91g_cG4xHvJs';

// Variável global para o cliente Supabase
let supabaseClient = null;
let supabaseLoaded = false;
let supabaseLoadPromise = null;

// Listener para quando o script Supabase carregar
window.addEventListener('load', function() {
    if (typeof window.supabase !== 'undefined') {
        supabaseLoaded = true;
        console.log('✓ Supabase carregado com sucesso');
        // Tentar inicializar se ainda não foi feito
        if (!supabaseClient) {
            initSupabaseClient();
        }
    }
});

// Função para aguardar e inicializar o cliente Supabase
function initSupabaseClient() {
    if (supabaseClient) return supabaseClient; // Já inicializado
    
    // Aguardar que a biblioteca Supabase esteja disponível
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Biblioteca Supabase não está disponível! Verifique a conexão de internet.');
        return null;
    }
    
    try {
        const { createClient } = window.supabase;
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
        supabaseLoaded = true;
        console.log('✓ Cliente Supabase inicializado');
        return supabaseClient;
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
        return null;
    }
}

// Aguardar carregamento da biblioteca Supabase (com retry mais agressivo)
function ensureSupabaseLoaded() {
    return new Promise((resolve, reject) => {
        if (typeof window.supabase !== 'undefined') {
            resolve();
            return;
        }
        
        // Se já está em processo de carregamento, reutilizar a promise
        if (supabaseLoadPromise) {
            supabaseLoadPromise.then(resolve).catch(reject);
            return;
        }
        
        let attempts = 0;
        const maxAttempts = 150; // 15 segundos em vez de 5
        
        const interval = setInterval(() => {
            attempts++;
            
            // Verificar se Supabase carregou
            if (typeof window.supabase !== 'undefined') {
                clearInterval(interval);
                supabaseLoaded = true;
                resolve();
                return;
            }
            
            // Timeout: se passou de 15 segundos, falhar
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                const erro = 'Supabase não carregou após 15 segundos. Verifique sua conexão de internet.';
                console.error('❌', erro);
                reject(new Error(erro));
            }
        }, 100);
        
        supabaseLoadPromise = new Promise((res, rej) => {
            setTimeout(() => {
                if (typeof window.supabase !== 'undefined') {
                    res();
                } else {
                    rej(new Error('Timeout aguardando Supabase'));
                }
            }, 15000);
        });
    });
}

// Função para registrar agendamento no Supabase
async function registrarAgendamentoSupabase(dados) {
    try {
        // Garantir que o Supabase está carregado
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não inicializou corretamente. Verifique sua conexão.');
        }

        console.log('📝 Registrando agendamento:', dados);

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
            console.log('✓ Paciente criado');
        } else {
            console.log('✓ Paciente já existe');
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

        if (error) {
            console.error('❌ Erro Supabase:', error);
            throw error;
        }
        
        console.log('✓ Agendamento registrado:', data[0]);
        return data[0]; // Retornar o primeiro agendamento inserido
    } catch (error) {
        console.error('❌ Erro ao registrar agendamento:', error);
        throw error;
    }
}

// Função para obter agendamentos de um paciente
async function obterAgendamentosPaciente(telefone) {
    try {
        console.log('🔍 Buscando agendamentos para telefone:', telefone);
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não inicializou. Verifique sua conexão de internet.');
        }

        const { data, error } = await client
            .from('agendamentos')
            .select('*')
            .eq('telefone', telefone)
            .order('data', { ascending: false });

        if (error) {
            console.error('❌ Erro Supabase ao buscar:', error);
            throw error;
        }
        
        console.log(`✓ Encontrados ${data?.length || 0} agendamentos`);
        return data || [];
    } catch (error) {
        console.error('❌ Erro ao obter agendamentos:', error);
        throw error;
    }
}

// Função para obter TODOS os agendamentos (admin)
async function obterTodosAgendamentos() {
    try {
        console.log('📊 Carregando todos os agendamentos (admin)...');
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não inicializou. Verifique sua conexão de internet.');
        }

        const { data, error } = await client
            .from('agendamentos')
            .select('*')
            .order('data', { ascending: false });

        if (error) {
            console.error('❌ Erro Supabase ao buscar todos:', error);
            throw error;
        }
        
        console.log(`✓ Carregados ${data?.length || 0} agendamentos`);
        return data || [];
    } catch (error) {
        console.error('❌ Erro ao obter agendamentos:', error);
        throw error;
    }
}

// Função para atualizar status de agendamento
async function atualizarStatusAgendamento(id, novoStatus) {
    try {
        console.log(`✏️ Atualizando agendamento ${id} para status: ${novoStatus}`);
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não inicializou. Verifique sua conexão de internet.');
        }

        const { error } = await client
            .from('agendamentos')
            .update({ status: novoStatus })
            .eq('id', id);

        if (error) {
            console.error('❌ Erro Supabase ao atualizar:', error);
            throw error;
        }
        
        console.log('✓ Agendamento atualizado');
        return { sucesso: true };
    } catch (error) {
        console.error('❌ Erro ao atualizar agendamento:', error);
        throw error;
    }
}

// Função para deletar agendamento
async function deletarAgendamento(id) {
    try {
        console.log(`🗑️ Deletando agendamento ${id}...`);
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não inicializou. Verifique sua conexão de internet.');
        }

        const { error } = await client
            .from('agendamentos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('❌ Erro Supabase ao deletar:', error);
            throw error;
        }
        
        console.log('✓ Agendamento deletado');
        return { sucesso: true };
    } catch (error) {
        console.error('❌ Erro ao deletar agendamento:', error);
        throw error;
    }
}

// Função para limpar todos os agendamentos
async function limparTodosAgendamentosSupabase() {
    try {
        console.log('⚠️ Limpando TODOS os agendamentos...');
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não inicializou. Verifique sua conexão de internet.');
        }

        const { error } = await client
            .from('agendamentos')
            .delete()
            .not('id', 'is', null); // Deleta todos

        if (error) {
            console.error('❌ Erro Supabase ao limpar:', error);
            throw error;
        }
        
        console.log('✓ Todos os agendamentos foram deletados');
        return { sucesso: true };
    } catch (error) {
        console.error('❌ Erro ao limpar agendamentos:', error);
        throw error;
    }
}
