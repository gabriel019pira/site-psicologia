// Sistema de Agendamento
const AGENDAMENTOS_KEY = 'agendamentos_psicologa';
const PACIENTES_KEY = 'pacientes_psicologa';

// Horários disponíveis
const HORARIOS_DISPONIVEIS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

// Inicializar localStorage se não existir
function inicializarStorage() {
    if (!localStorage.getItem(AGENDAMENTOS_KEY)) {
        localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(PACIENTES_KEY)) {
        localStorage.setItem(PACIENTES_KEY, JSON.stringify([]));
    }
}

// Obter todos os agendamentos
function obterAgendamentos() {
    const agendamentos = localStorage.getItem(AGENDAMENTOS_KEY);
    return agendamentos ? JSON.parse(agendamentos) : [];
}

// Obter todos os pacientes
function obterPacientes() {
    const pacientes = localStorage.getItem(PACIENTES_KEY);
    return pacientes ? JSON.parse(pacientes) : [];
}

// Salvar agendamentos
function salvarAgendamentos(agendamentos) {
    localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(agendamentos));
}

// Salvar pacientes
function salvarPacientes(pacientes) {
    localStorage.setItem(PACIENTES_KEY, JSON.stringify(pacientes));
}

// Registrar novo agendamento
function registrarAgendamento(dados) {
    inicializarStorage();
    
    const agendamentos = obterAgendamentos();
    const pacientes = obterPacientes();
    
    // Criar ID único para o agendamento
    const id = Date.now().toString();
    
    // Verificar se paciente já existe, senão criar
    let paciente = pacientes.find(p => p.email === dados.email);
    if (!paciente) {
        paciente = {
            id: Date.now().toString() + Math.random(),
            nome: dados.nome,
            email: dados.email,
            telefone: dados.telefone,
            dataCadastro: new Date().toISOString()
        };
        pacientes.push(paciente);
        salvarPacientes(pacientes);
    }
    
    // Criar novo agendamento
    const novoAgendamento = {
        id: id,
        pacienteId: paciente.id,
        paciente: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        data: dados.data,
        hora: dados.hora,
        motivo: dados.motivo,
        status: 'pendente',
        dataCriacao: new Date().toISOString()
    };
    
    agendamentos.push(novoAgendamento);
    salvarAgendamentos(agendamentos);
    
    return novoAgendamento;
}

// Atualizar status do agendamento
function atualizarStatusAgendamento(id, novoStatus) {
    const agendamentos = obterAgendamentos();
    const agendamento = agendamentos.find(a => a.id === id);
    
    if (agendamento) {
        agendamento.status = novoStatus;
        agendamento.dataAtualizacao = new Date().toISOString();
        salvarAgendamentos(agendamentos);
        return agendamento;
    }
    return null;
}

// Cancelar agendamento
function cancelarAgendamento(id) {
    return atualizarStatusAgendamento(id, 'cancelado');
}

// Confirmar agendamento
function confirmarAgendamento(id) {
    return atualizarStatusAgendamento(id, 'confirmado');
}

// Obter agendamentos de um paciente pelo email
function obterAgendamentosPaciente(email) {
    const agendamentos = obterAgendamentos();
    return agendamentos.filter(a => a.email === email);
}

// Obter agendamentos em uma data específica
function obterAgendamentosData(data) {
    const agendamentos = obterAgendamentos();
    return agendamentos.filter(a => a.data === data && a.status !== 'cancelado');
}

// Verificar se horário está disponível
function verificarDisponibilidade(data, hora) {
    const agendamentosData = obterAgendamentosData(data);
    const horarioReservado = agendamentosData.some(a => a.hora === hora && a.status !== 'cancelado');
    return !horarioReservado;
}

// Obter horários disponíveis para uma data
function obterHorariosDisponiveis(data) {
    return HORARIOS_DISPONIVEIS.filter(hora => verificarDisponibilidade(data, hora));
}

// Obter horários indisponíveis para uma data
function obterHorariosIndisponiveis(data) {
    return HORARIOS_DISPONIVEIS.filter(hora => !verificarDisponibilidade(data, hora));
}

// Deletar agendamento
function deletarAgendamento(id) {
    const agendamentos = obterAgendamentos();
    const index = agendamentos.findIndex(a => a.id === id);
    
    if (index > -1) {
        agendamentos.splice(index, 1);
        salvarAgendamentos(agendamentos);
        return true;
    }
    return false;
}

// Obter estatísticas
function obterEstatisticas() {
    const agendamentos = obterAgendamentos();
    
    return {
        total: agendamentos.length,
        pendente: agendamentos.filter(a => a.status === 'pendente').length,
        confirmado: agendamentos.filter(a => a.status === 'confirmado').length,
        cancelado: agendamentos.filter(a => a.status === 'cancelado').length,
        pacientes: new Set(agendamentos.map(a => a.email)).size
    };
}

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
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Converter data brasileira para ISO
function converterDataParaISO(dataBrasileira) {
    const [dia, mes, ano] = dataBrasileira.split('/');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

// Formatar hora
function formatarHora(hora) {
    return hora;
}

// Obter dia da semana em português
function obterDiaSemana(dataISO) {
    const data = new Date(dataISO + 'T00:00:00');
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return diasSemana[data.getDay()];
}

// Verificar se é fim de semana
function ehFimDeSemana(dataISO) {
    const data = new Date(dataISO + 'T00:00:00');
    const dia = data.getDay();
    return dia === 0 || dia === 6;
}

// Inicializar ao carregar o script
inicializarStorage();
