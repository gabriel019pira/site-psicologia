// Configuração do Supabase
const SUPABASE_URL = 'https://dpobhypdzgorabjlkppv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7-rieCzisyK5_WDG5oJ91g_cG4xHvJs';

// Função para normalizar telefone (remove formatação para comparação)
function normalizarTelefone(telefone) {
    return telefone.replace(/\D/g, ''); // Remove tudo que não seja dígito
}

// Função para normalizar CPF (remove formatação para comparação)
function normalizarCPF(cpf) {
    return cpf.replace(/\D/g, ''); // Remove tudo que não seja dígito
}

// Variável global para o cliente Supabase
let supabaseClient = null;

// Função para aguardar e inicializar o cliente Supabase
function initSupabaseClient() {
    if (supabaseClient) return supabaseClient; // Já inicializado
    
    // Aguardar que a biblioteca Supabase esteja disponível
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Biblioteca Supabase não está disponível!');
        return null;
    }
    
    try {
        const { createClient } = window.supabase;
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✓ Cliente Supabase inicializado com sucesso');
        return supabaseClient;
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
        return null;
    }
}

// Aguardar carregamento da biblioteca Supabase (com retry mais agressivo)
function ensureSupabaseLoaded() {
    return new Promise((resolve, reject) => {
        // Se já está marcado como carregado, resolver imediatamente
        if (window.supabaseLoaded && typeof window.supabase !== 'undefined') {
            resolve();
            return;
        }
        
        // Se Supabase já está disponível mas flag ainda não foi setada
        if (typeof window.supabase !== 'undefined') {
            window.supabaseLoaded = true;
            resolve();
            return;
        }
        
        let attempts = 0;
        const maxAttempts = 100; // 10 segundos
        
        const interval = setInterval(() => {
            attempts++;
            
            // Verificar se Supabase carregou
            if (window.supabaseLoaded || typeof window.supabase !== 'undefined') {
                clearInterval(interval);
                window.supabaseLoaded = true;
                console.log('✓ Supabase finalmente carregou após', attempts, 'tentativas');
                resolve();
                return;
            }
            
            // Timeout: se passou de 10 segundos, falhar
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                const erro = 'Supabase não carregou após 10 segundos. Verifique sua conexão de internet.';
                console.error('❌', erro);
                reject(new Error(erro));
            }
        }, 100);
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
        // Normalizar CPF antes de salvar (remover formatação)
        const cpfNormalizado = normalizarCPF(dados.cpf);
        console.log('✓ CPF normalizado para gravação:', cpfNormalizado);
        
        const { data, error } = await client
            .from('agendamentos')
            .insert([{
                nome: dados.nome,
                email: dados.email,
                telefone: dados.telefone,
                cpf: cpfNormalizado,
                data: dados.data,
                hora: dados.hora,
                motivo: dados.motivo,
                status: 'confirmado'
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

        // Normalizar telefone para comparação (remove formatação)
        const telefonNormalizado = normalizarTelefone(telefone);
        console.log('📞 Telefone normalizado:', telefonNormalizado);

        // Buscar todos os agendamentos e filtrar localmente
        // Isso permite comparação flexível de telefones com diferentes formatações
        const { data, error } = await client
            .from('agendamentos')
            .select('*')
            .order('data', { ascending: false });

        if (error) {
            console.error('❌ Erro Supabase ao buscar:', error);
            throw error;
        }
        
        // Filtrar localmente por telefone normalizado
        const agendamentosFiltrados = data.filter(a => 
            normalizarTelefone(a.telefone) === telefonNormalizado
        );
        
        console.log(`✓ Encontrados ${agendamentosFiltrados.length} agendamentos`);
        return agendamentosFiltrados || [];
    } catch (error) {
        console.error('❌ Erro ao obter agendamentos:', error);
        throw error;
    }
}

// Função para obter agendamentos por data e hora
async function obterAgendamentosPorDataHora(data, hora) {
    try {
        console.log('🔍 Buscando agendamentos para data:', data, 'hora:', hora);
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não inicializou. Verifique sua conexão de internet.');
        }

        // Buscar todos os agendamentos e filtrar localmente
        const { data: allData, error } = await client
            .from('agendamentos')
            .select('*')
            .order('data', { ascending: false });

        if (error) {
            console.error('❌ Erro Supabase ao buscar:', error);
            throw error;
        }
        
        // Filtrar por data e hora
        const agendamentosFiltrados = (allData || []).filter(a => 
            a.data === data && a.hora === hora
        );
        
        console.log(`✓ Encontrados ${agendamentosFiltrados.length} agendamentos para essa data/hora`);
        return agendamentosFiltrados || [];
    } catch (error) {
        console.error('❌ Erro ao obter agendamentos por data/hora:', error);
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

        console.log('🔄 Fazendo query ao banco de dados...');
        const { data, error } = await client
            .from('agendamentos')
            .select('*')
            .order('data', { ascending: false });

        if (error) {
            console.error('❌ Erro Supabase ao buscar todos:', error);
            console.error('Detalhes do erro:', error.message, error.code, error.details);
            throw error;
        }
        
        console.log(`✓ Carregados ${data?.length || 0} agendamentos`);
        if (data && data.length > 0) {
            console.log('📋 Primeiros dados:', data[0]);
        }
        return data || [];
    } catch (error) {
        console.error('❌ Erro ao obter agendamentos:', error);
        throw error;
    }
}

// Função para obter agendamentos por CPF do paciente
async function obterAgendamentosPorCPF(cpf) {
    try {
        console.log('🔐 Buscando agendamentos para CPF:', cpf);
        await ensureSupabaseLoaded();
        const client = initSupabaseClient();
        
        if (!client) {
            throw new Error('Supabase não inicializou. Verifique sua conexão de internet.');
        }

        // Normalizar CPF removendo pontuação
        const cpfNormalizado = cpf.replace(/\D/g, '');
        console.log('📌 CPF normalizado para busca:', cpfNormalizado);
        
        if (cpfNormalizado.length !== 11) {
            throw new Error('CPF deve conter 11 dígitos');
        }

        console.log('🔄 Buscando TODOS os agendamentos do banco...');
        
        // Buscar TODOS os agendamentos
        const { data: todosDados, error } = await client
            .from('agendamentos')
            .select('*')
            .order('data', { ascending: false });

        if (error) {
            console.error('❌ Erro Supabase ao buscar:', error);
            console.error('Detalhes do erro:', error.message, error.code, error.details);
            throw error;
        }
        
        console.log(`📊 Total de agendamentos no banco: ${todosDados?.length || 0}`);
        
        // Filtrar localmente normalizando AMBOS os lados
        const agendamentosFiltrados = (todosDados || []).filter(a => {
            const cpfDoBanco = (a.cpf || '').replace(/\D/g, '');
            const encontrou = cpfDoBanco === cpfNormalizado;
            
            if (encontrou) {
                console.log(`✓ ENCONTRADO: ID ${a.id}, CPF banco="${a.cpf}" vs busca="${cpfNormalizado}"`);
            }
            
            return encontrou;
        });
        
        console.log(`✅ Encontrados ${agendamentosFiltrados.length} agendamentos para CPF ${cpfNormalizado}`);
        if (agendamentosFiltrados.length > 0) {
            agendamentosFiltrados.forEach((a, i) => {
                console.log(`  [${i}] ${a.nome} - ${a.data} ${a.hora} - ID: ${a.id}`);
            });
        } else {
            console.warn('⚠️ Nenhum agendamento encontrado para este CPF');
        }
        
        return agendamentosFiltrados || [];
    } catch (error) {
        console.error('❌ Erro ao obter agendamentos por CPF:', error);
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

        // Converter ID para número (vem como string do onclick do HTML)
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new Error(`ID inválido: ${id}`);
        }

        const { error } = await client
            .from('agendamentos')
            .update({ status: novoStatus })
            .eq('id', idNum);

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

        // Converter ID para número (vem como string do onclick do HTML)
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new Error(`ID inválido: ${id}`);
        }

        const { error } = await client
            .from('agendamentos')
            .delete()
            .eq('id', idNum);

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
