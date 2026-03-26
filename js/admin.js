// ============================================
// INICIALIZAÇÃO E FUNÇÕES DA PÁGINA ADMIN
// ============================================

const SENHA_ADMIN = 'admin123'; // Mude essa senha em produção!
let usuarioLogado = false;

function inicializarPaginaAdmin() {
    console.log('🔄 Inicializando página Admin...');
    
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) {
        console.log('ⓘ Página Admin não detectada - pulando inicialização');
        return;
    }
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        menuToggle.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰ Menu';
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            sidebar.classList.remove('active');
            menuToggle.innerHTML = '☰ Menu';
        });
    });

    // Elementos da página Admin
    const btnEntrar = document.getElementById('btnEntrar');
    const senhaInput = document.getElementById('senhaAdmin');
    const alertaLogin = document.getElementById('alertaLogin');
    const btnSair = document.getElementById('btnSair');

    if (!btnEntrar || !senhaInput) {
        console.log('ⓘ Elementos Admin não localizados - pulando inicialização');
        return;
    }

    // Verificar se está em localStorage (simular sessão)
    if (localStorage.getItem('adminLogado')) {
        acessoAdmin();
    }

    btnEntrar.addEventListener('click', function() {
        if (senhaInput.value === SENHA_ADMIN) {
            localStorage.setItem('adminLogado', 'true');
            acessoAdmin();
        } else {
            alertaLogin.innerHTML = '<div class="alert alert-error">Senha incorreta!</div>';
            senhaInput.value = '';
        }
    });

    senhaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') btnEntrar.click();
    });

    btnSair.addEventListener('click', function() {
        localStorage.removeItem('adminLogado');
        usuarioLogado = false;
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('adminContainer').style.display = 'none';
        senhaInput.value = '';
    });

    console.log('✓ Página Admin inicializada com sucesso');
}

function acessoAdmin() {
    usuarioLogado = true;
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';

    // Mostrar mensagem de carregamento
    document.getElementById('tabelaCorpo').innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">⏳ Conectando ao servidor...</td></tr>';
    
    // Garantir que Supabase está carregado
    ensureSupabaseLoaded().then(() => {
        carregarDados();
        configurarEventos();
    }).catch(erro => {
        console.error('Erro completo:', erro);
        const mensagem = (erro.message || erro.toString()).substring(0, 200);
        showError('⚠️ ERRO: A conexão com o servidor Supabase não foi carregada.\n\n' +
                 'Possíveis causas:\n' +
                 '- Sem conexão de internet\n' +
                 '- Extensão de navegador está bloqueando\n' +
                 '- Problema com CDN\n\n' +
                 'Detalhes: ' + mensagem + '\n\n' +
                 'Tente: Recarregar a página (F5)');
        document.getElementById('tabelaCorpo').innerHTML = '<tr><td colspan="7" style="text-align: center; color: #d32f2f; padding: 2rem;">❌ Erro ao conectar</td></tr>';
    });
}

function showError(msg) {
    alert(msg);
}

// FUNÇÃO ASYNC PARA CARREGAR DADOS DO SUPABASE
async function carregarDados() {
    try {
        console.log('📊 Iniciando carregamento de dados...');
        const agendamentos = await obterTodosAgendamentos();
        console.log('✓ Agendamentos carregados:', agendamentos.length);
        
        const stats = obterEstatisticas(agendamentos);

        document.getElementById('totalAgendamentos').textContent = stats.total;
        document.getElementById('totalConfirmados').textContent = stats.confirmado;
        document.getElementById('totalPacientes').textContent = stats.pacientes;
        
        exibirTabelaAgendamentos(agendamentos);
        console.log('✓ Tabela exibida com sucesso');
    } catch (erro) {
        console.error('❌ Erro ao carregar agendamentos:', erro);
        alert('Erro ao carregar agendamentos: ' + erro.message);
        document.getElementById('tabelaCorpo').innerHTML = '<tr><td colspan="7" style="text-align: center; color: #d32f2f;">❌ Erro: ' + erro.message + '</td></tr>';
    }
}

function obterEstatisticas(agendamentos) {
    const pacientes = new Set(agendamentos.map(a => a.email)).size;
    return {
        total: agendamentos.length,
        confirmado: agendamentos.filter(a => a.status === 'confirmado').length,
        pendente: agendamentos.filter(a => a.status === 'pendente').length,
        cancelado: agendamentos.filter(a => a.status === 'cancelado').length,
        pacientes: pacientes
    };
}

function configurarEventos() {
    document.getElementById('btnFiltrar').addEventListener('click', aplicarFiltros);
    document.getElementById('btnLimparFiltros').addEventListener('click', limparFiltros);
    document.getElementById('btnLimparTodos').addEventListener('click', limparTodosAgendamentos);
}

function exibirTabelaAgendamentos(agendamentos) {
    const tbody = document.getElementById('tabelaCorpo');

    if (agendamentos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Nenhum agendamento registrado</td></tr>';
        return;
    }

    tbody.innerHTML = agendamentos.map(a => `
        <tr>
            <td>${a.nome}</td>
            <td>${a.email || '-'}</td>
            <td>${a.telefone}</td>
            <td>${converterDataParaBrasileiro(a.data)}</td>
            <td>${a.hora}</td>
            <td>${(a.motivo || '').substring(0, 30)}...</td>
            <td>
                ${a.status !== 'cancelado' ? `<button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="cancelarAgendamentoAdmin('${a.id}', '${a.nome}')">Cancelar</button>` : '<span style="color: #999;">Cancelado</span>'}
            </td>
        </tr>
    `).join('');
}

// APLICAR FILTROS COM SUPABASE
async function aplicarFiltros() {
    try {
        const data = document.getElementById('filtroData').value;
        const paciente = document.getElementById('filtroPaciente').value.toLowerCase();
        let agendamentos = await obterTodosAgendamentos();

        if (data) {
            agendamentos = agendamentos.filter(a => a.data === data);
        }

        if (paciente) {
            agendamentos = agendamentos.filter(a =>
                a.nome.toLowerCase().includes(paciente) || 
                a.email.toLowerCase().includes(paciente)
            );
        }

        exibirTabelaAgendamentos(agendamentos);
    } catch (erro) {
        alert('Erro ao filtrar agendamentos: ' + erro.message);
    }
}

function limparFiltros() {
    document.getElementById('filtroData').value = '';
    document.getElementById('filtroPaciente').value = '';
    carregarDados();
}

async function limparTodosAgendamentos() {
    if (confirm('ATENÇÃO! Isso irá deletar TODOS os agendamentos registrados NO BANCO DE DADOS.\n\nDeseja continuar?')) {
        const senha = prompt('Digite a senha do administrador para prosseguir com a limpeza de todos os agendamentos:');
        if (senha === SENHA_ADMIN) {
            try {
                await limparTodosAgendamentosSupabase();
                alert('✓ Todos os agendamentos foram removidos com sucesso!');
                carregarDados();
            } catch (erro) {
                alert('✗ Erro ao limpar agendamentos: ' + erro.message);
            }
        } else {
            alert('✗ Senha incorreta! Operação cancelada.');
        }
    }
}

// Função para cancelar agendamento individual
window.cancelarAgendamentoAdmin = async function(id, nome) {
    if (confirm('Tem certeza que deseja cancelar o agendamento de ' + nome + '?')) {
        try {
            console.log('Cancelando agendamento ID:', id);
            await atualizarStatusAgendamento(id, 'cancelado');
            alert('Agendamento cancelado com sucesso!');
            carregarDados(); // Recarregar tabela
        } catch (erro) {
            alert('Erro ao cancelar agendamento: ' + erro.message);
        }
    }
};

// Inicializar quando DOM está pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarPaginaAdmin);
} else {
    inicializarPaginaAdmin();
}
