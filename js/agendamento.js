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


