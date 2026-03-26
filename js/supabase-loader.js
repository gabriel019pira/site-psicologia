// ============================================
// supabase-loader.js
// Arquivo responsável APENAS por carregar Supabase
// ============================================

window.supabaseLoaded = false;
window.supabaseLoadingPromise = (async () => {
    console.log('🔄 Iniciando carregamento de Supabase...');
    
    try {
        // Usar URL com +esm para forçar formato ESM do Supabase
        console.log('📦 Importando de: https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm');
        const supabaseModule = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm');
        
        console.log('✓ Módulo carregado, exports:', Object.keys(supabaseModule));
        
        // Expor globalmente
        window.supabase = supabaseModule;
        window.supabaseLoaded = true;
        
        console.log('✓ Supabase disponível em window.supabase');
        console.log('✓ createClient disponível:', typeof window.supabase.createClient === 'function');
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao carregar Supabase:', error.message);
        console.error('Stack:', error.stack);
        window.supabaseLoaded = false;
        throw error;
    }
})();
