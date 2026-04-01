// Horários disponíveis
const HORARIOS_DISPONIVEIS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

// NOTA: Funções de agendamento migraram para Supabase (supabase-config.js)
// Mantendo apenas funções de formatação e utilidades simples

// Data mínima (próximo dia útil a partir de hoje)
function obterDataMinima() {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + 1);
    return formatarData(hoje);
}

// Data máxima (90 dias a partir de hoje)
function obterDataMaxima() {
    const maxData = new Date();
    maxData.setDate(maxData.getDate() + 90);
    return formatarData(maxData);
}

// Formatar data para YYYY-MM-DD
function formatarData(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// Converter data de input para formato brasileiro
function converterDataParaBrasileiro(dataISO) {
    // Validar se é uma string válida
    if (!dataISO || typeof dataISO !== 'string') {
        console.warn('Data inválida:', dataISO);
        return 'Data inválida';
    }
    
    // Se for um objeto Date, converter para string
    if (dataISO instanceof Date) {
        dataISO = formatarData(dataISO);
    }
    
    const partes = dataISO.split('-');
    if (partes.length !== 3) {
        console.warn('Formato de data inválido:', dataISO);
        return dataISO; // Retornar como está se não for formato esperado
    }
    
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
}

// Converter data brasileira para ISO
function converterDataParaISO(dataBrasileira) {
    // Validar se é uma string válida
    if (!dataBrasileira || typeof dataBrasileira !== 'string') {
        console.warn('Data inválida:', dataBrasileira);
        return '';
    }
    
    const partes = dataBrasileira.split('/');
    if (partes.length !== 3) {
        console.warn('Formato de data inválido:', dataBrasileira);
        return dataBrasileira;
    }
    
    const [dia, mes, ano] = partes;
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

// Formatar hora
function formatarHora(hora) {
    return hora;
}

// Obter dia da semana em português
function obterDiaSemana(dataISO) {
    // Validar entrada
    if (!dataISO || typeof dataISO !== 'string') {
        return 'Data inválida';
    }
    
    try {
        const data = new Date(dataISO + 'T00:00:00');
        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const dia = data.getDay();
        return diasSemana[dia] || 'Data inválida';
    } catch (e) {
        console.error('Erro ao obter dia da semana:', e);
        return 'Data inválida';
    }
}

// Verificar se é fim de semana
function ehFimDeSemana(dataISO) {
    // Validar entrada
    if (!dataISO || typeof dataISO !== 'string') {
        return false;
    }
    
    try {
        const data = new Date(dataISO + 'T00:00:00');
        const dia = data.getDay();
        return dia === 0 || dia === 6;
    } catch (e) {
        console.error('Erro ao verificar fim de semana:', e);
        return false;
    }
}

// Obter horários disponíveis para uma data
function obterHorariosDisponiveis(data) {
    try {
        // Retornar todos os horários disponíveis (sem filtrar por agendamentos)
        // Pois a restrição deve ser feita no backend
        return HORARIOS_DISPONIVEIS.slice(); // Retornar cópia do array
    } catch (error) {
        console.error('Erro ao obter horários disponíveis:', error);
        return HORARIOS_DISPONIVEIS.slice(); // Retornar padrão em caso de erro
    }
}

// ============================================
// INICIALIZAÇÃO DA PÁGINA DE AGENDAMENTO
// ============================================
function inicializarPaginaAgendamento() {
    console.log('🔄 Inicializando página de agendamento...');
    
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) {
        console.error('❌ Elementos do menu não encontrados');
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

    // Formulário de agendamento
    const inputData = document.getElementById('data');
    const inputHora = document.getElementById('hora');
    const formAgendamento = document.getElementById('formAgendamento');
    const alertaDiv = document.getElementById('alertaAgendamento');

    if (!inputData || !inputHora || !formAgendamento) {
        console.error('❌ Elementos do formulário não encontrados');
        return;
    }

    // Configurar data mínima e máxima
    inputData.min = obterDataMinima();
    inputData.max = obterDataMaxima();
    console.log('✓ Datas configuradas:', inputData.min, 'a', inputData.max);

    // Atualizar horários quando data é selecionada
    inputData.addEventListener('change', function() {
        const data = this.value;
        
        if (!data) {
            inputHora.innerHTML = '<option value="">Selecione uma data primeiro</option>';
            inputHora.disabled = true;
            return;
        }

        // Verificar se é fim de semana
        if (ehFimDeSemana(data)) {
            alertaDiv.innerHTML = '<div class="alert alert-info">⚠️ O consultório não funciona aos fins de semana. Por favor, escolha uma data entre segunda e sexta.</div>';
            inputHora.innerHTML = '<option value="">Selecione um horário</option>';
            inputHora.disabled = true;
            return;
        } else {
            alertaDiv.innerHTML = '';
        }

        const horariosDisponiveis = obterHorariosDisponiveis(data);
        console.log('✓ Horários disponíveis:', horariosDisponiveis.length);
        
        if (horariosDisponiveis.length === 0) {
            inputHora.innerHTML = '<option value="">Nenhum horário disponível nesta data</option>';
            inputHora.disabled = true;
            alertaDiv.innerHTML = '<div class="alert alert-info">Todos os horários desta data estão reservados. Escolha outra data.</div>';
        } else {
            let html = '<option value="">Selecione um horário</option>';
            horariosDisponiveis.forEach(hora => {
                html += `<option value="${hora}">${hora}</option>`;
            });
            inputHora.innerHTML = html;
            inputHora.disabled = false;
        }
    });

    // Enviar formulário
    formAgendamento.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar checkbox RGPD
        const checkboxRGPD = document.getElementById('rgpd');
        if (!checkboxRGPD.checked) {
            alertaDiv.innerHTML = '<div class="alert alert-error">⚠️ Você deve concordar com a Política de Privacidade para agendar a consulta.</div>';
            checkboxRGPD.focus();
            return;
        }
        
        // Verificar se Supabase carregou
        if (!window.supabase || typeof window.supabase.createClient !== 'function') {
            alertaDiv.innerHTML = '<div class="alert alert-error">❌ ERRO: Conexão com servidor não foi carregada. Recarregue a página (F5).</div>';
            return;
        }

        const dados = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cpf: document.getElementById('cpf').value,
            data: document.getElementById('data').value,
            hora: document.getElementById('hora').value,
            motivo: document.getElementById('motivo').value,
            consentimento_rgpd: true,
            data_consentimento: new Date().toISOString()
        };

        try {
            alertaDiv.innerHTML = '<div class="alert alert-info">Verificando disponibilidade do agendamento...</div>';
            const agendamentosExistentes = await obterAgendamentosPorCPF(dados.cpf);
            
            const agendamentoAtivo = agendamentosExistentes.find(a => a.status === 'confirmado');
            
            if (agendamentoAtivo) {
                alertaDiv.innerHTML = `
                    <div class="alert alert-error">
                        ⚠️ Você já possui um agendamento confirmado!<br>
                        <strong>Data:</strong> ${converterDataParaBrasileiro(agendamentoAtivo.data)} às ${agendamentoAtivo.hora}<br>
                        <br>
                        Para agendar uma nova consulta, primeiro cancele o agendamento anterior.<br>
                        <a href="meus-agendamentos.html">Gerenciar meus agendamentos</a>
                    </div>
                `;
                alertaDiv.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            const agendamento = await registrarAgendamentoSupabase(dados);
            
            alertaDiv.innerHTML = `
                <div class="alert alert-success">
                    ✓ Agendamento realizado e confirmado com sucesso!<br>
                    <strong>ID do Agendamento:</strong> ${agendamento.id}<br>
                    <strong>Data:</strong> ${converterDataParaBrasileiro(agendamento.data)} às ${agendamento.hora}<br>
                    <strong>Status:</strong> Confirmado<br>
                    <br>
                    Você receberá um email de confirmação em breve. 
                    <a href="meus-agendamentos.html">Acompanhe aqui</a>
                </div>
            `;

            formAgendamento.reset();
            inputHora.innerHTML = '<option value="">Selecione um horário</option>';
            inputHora.disabled = true;

            alertaDiv.scrollIntoView({ behavior: 'smooth' });
        } catch (erro) {
            console.error('❌ Erro ao agendar:', erro);
            alertaDiv.innerHTML = `<div class="alert alert-error">Erro ao agendar: ${erro.message}</div>`;
        }
    });

    console.log('✓ Página de agendamento inicializada com sucesso');
}

// ============================================
// INICIALIZAÇÃO DA PÁGINA "MEUS AGENDAMENTOS"
// ============================================
function inicializarPaginaMeusAgendamentos() {
    console.log('🔄 Inicializando página "Meus Agendamentos"...');
    
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) {
        console.log('ⓘ Página "Meus Agendamentos" não detectada - pulando inicialização');
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
    
    // Elementos da página
    const btnBuscar = document.getElementById('btnBuscar');
    const cpfInput = document.getElementById('cpfPaciente');
    const alertaBusca = document.getElementById('alertaBusca');
    const conteudoPrincipal = document.getElementById('conteudoPrincipal');
    const containerAgendamentos = document.getElementById('containerAgendamentos');
    const btnVoltar = document.getElementById('btnVoltar');
    const btnNovo = document.getElementById('btnNovo');

    if (!btnBuscar || !cpfInput) {
        console.log('ⓘ Elementos "Meus Agendamentos" não localizados - pulando inicialização');
        return;
    }

    btnBuscar.addEventListener('click', buscarAgendamentos);
    cpfInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') buscarAgendamentos();
    });

    btnVoltar.addEventListener('click', function() {
        containerAgendamentos.style.display = 'none';
        conteudoPrincipal.style.display = 'block';
        cpfInput.value = '';
        alertaBusca.innerHTML = '';
    });

    btnNovo.addEventListener('click', function() {
        window.location.href = 'agendamento.html';
    });

    // FUNÇÃO PARA BUSCAR AGENDAMENTOS POR CPF
    async function buscarAgendamentos() {
        const cpf = cpfInput.value.trim();

        if (!cpf) {
            alertaBusca.innerHTML = '<div class="alert alert-error">Por favor, insira um CPF válido</div>';
            return;
        }
        
        // Verificar se Supabase carregou
        if (!window.supabase || typeof window.supabase.createClient !== 'function') {
            alertaBusca.innerHTML = '<div class="alert alert-error">❌ ERRO: Conexão com servidor não foi carregada. Recarregue a página (F5).</div>';
            return;
        }

        try {
            alertaBusca.innerHTML = '<div class="alert alert-info">Buscando agendamentos...</div>';
            
            // Buscar agendamentos do Supabase por CPF
            const agendamentos = await obterAgendamentosPorCPF(cpf);

            if (agendamentos.length === 0) {
                alertaBusca.innerHTML = '<div class="alert alert-info">Nenhum agendamento encontrado para este CPF.</div>';
                return;
            }

            alertaBusca.innerHTML = '';
            exibirAgendamentos(cpf, agendamentos);
        } catch (erro) {
            alertaBusca.innerHTML = `<div class="alert alert-error">Erro ao buscar agendamentos: ${erro.message}</div>`;
        }
    }

    function exibirAgendamentos(email, agendamentos) {
        conteudoPrincipal.style.display = 'none';
        containerAgendamentos.style.display = 'block';

        const pacienteNome = agendamentos[0].nome;
        document.getElementById('nomePaciente').textContent = `Agendamentos de ${pacienteNome}`;

        // Separar agendamentos futuros e passados
        const hoje = new Date().toISOString().split('T')[0];
        const futuros = agendamentos.filter(a => a.data >= hoje && a.status !== 'cancelado').sort((a, b) => new Date(a.data) - new Date(b.data));
        const passados = agendamentos.filter(a => a.data < hoje || a.status === 'cancelado').sort((a, b) => new Date(b.data) - new Date(a.data));

        // Resumo
        const resumoDiv = document.getElementById('resumoAgendamentos');
        resumoDiv.innerHTML = `
            <div class="card" style="text-align: center;">
                <strong style="color: var(--secondary-color); font-size: 1.5rem;">${agendamentos.length}</strong>
                <p>Total</p>
            </div>
            <div class="card" style="text-align: center;">
                <strong style="color: #27ae60; font-size: 1.5rem;">${futuros.length}</strong>
                <p>Próximas</p>
            </div>
            <div class="card" style="text-align: center;">
                <strong style="color: #f39c12; font-size: 1.5rem;">${agendamentos.filter(a => a.status === 'pendente').length}</strong>
                <p>Pendentes</p>
            </div>
            <div class="card" style="text-align: center;">
                <strong style="color: #e74c3c; font-size: 1.5rem;">${agendamentos.filter(a => a.status === 'cancelado').length}</strong>
                <p>Cancelados</p>
            </div>
        `;

        // Agendamentos futuros
        const futDiv = document.getElementById('agendamentosFuturos');
        if (futuros.length === 0) {
            futDiv.innerHTML = '<p style="color: #999;">Nenhum agendamento futuro.</p>';
        } else {
            futDiv.innerHTML = futuros.map(a => criarCardAgendamento(a)).join('');
        }

        // Agendamentos passados
        const passDiv = document.getElementById('agendamentosPassados');
        if (passados.length === 0) {
            passDiv.innerHTML = '<p style="color: #999;">Nenhum agendamento passado.</p>';
        } else {
            passDiv.innerHTML = passados.map(a => criarCardAgendamento(a, true)).join('');
        }
    }

    function criarCardAgendamento(agendamento, passado = false) {
        const dataBR = converterDataParaBrasileiro(agendamento.data);
        const diaSemana = obterDiaSemana(agendamento.data);
        
        let statusClass = '';
        let statusTexto = '';
        if (agendamento.status === 'confirmado') {
            statusClass = 'status-confirmado';
            statusTexto = 'Confirmado';
        } else if (agendamento.status === 'pendente') {
            statusClass = 'status-pendente';
            statusTexto = 'Pendente';
        } else if (agendamento.status === 'cancelado') {
            statusClass = 'status-cancelado';
            statusTexto = 'Cancelado';
        }

        return `
            <div class="card" style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--secondary-color); margin-bottom: 0.5rem;">${dataBR} - ${agendamento.hora}</h4>
                        <p style="color: #666; margin-bottom: 0.3rem;"><strong>${diaSemana}</strong></p>
                    </div>
                    <span class="status-badge ${statusClass}">${statusTexto}</span>
                </div>
                <p style="margin-bottom: 0.5rem;"><strong>Motivo:</strong> ${agendamento.motivo}</p>
                <p style="color: #999; font-size: 0.9rem;"><strong>ID:</strong> ${agendamento.id}</p>
                ${!passado && agendamento.status !== 'cancelado' ? `
                    <button class="btn btn-danger" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="cancelarAgendamentoUI('${agendamento.id}')">Cancelar Agendamento</button>
                ` : ''}
            </div>
        `;
    }

    window.cancelarAgendamentoUI = async function(id) {
        if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            try {
                await atualizarStatusAgendamento(id, 'cancelado');
                alert('Agendamento cancelado com sucesso!');
                buscarAgendamentos();
            } catch (erro) {
                alert('Erro ao cancelar agendamento: ' + erro.message);
            }
        }
    };

    console.log('✓ Página "Meus Agendamentos" inicializada com sucesso');
}

// Inicializar quando DOM está pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        inicializarPaginaAgendamento();
        inicializarPaginaMeusAgendamentos();
    });
} else {
    inicializarPaginaAgendamento();
    inicializarPaginaMeusAgendamentos();
}


