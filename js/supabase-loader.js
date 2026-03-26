// ============================================
// supabase-loader.js
// Carrega Supabase de forma confiável
// ============================================

window.supabaseLoaded = false;

// Promise que aguarda Supabase carregar
window.supabaseLoadingPromise = (async () => {
    console.log('🔄 Iniciando carregamento de Supabase...');
    
    // Se já carregou, retornar imediatamente
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        console.log('✓ Supabase já estava carregado');
        window.supabaseLoaded = true;
        return true;
    }
    
    // Tentar importação ESM
    try {
        console.log('📦 Teste 1: Importando ESM de https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm');
        const supabaseModule = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm');
        
        window.supabase = supabaseModule;
        window.supabaseLoaded = true;
        console.log('✓ Supabase carregou via ESM');
        return true;
    } catch (error) {
        console.warn('⚠️ Falha ao carregar ESM:', error.message);
    }
    
    // Fallback: Injetar script IIFE
    console.log('📦 Teste 2: Tentando IIFE de https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0');
    
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0';
        script.async = true;
        
        const timeout = setTimeout(() => {
            console.error('❌ Timeout ao carregar Supabase IIFE');
            window.supabaseLoaded = false;
            resolve(false);
        }, 5000);
        
        script.onload = () => {
            clearTimeout(timeout);
            // Aguardar um pouco para garantir que window.supabase foi criado
            setTimeout(() => {
                if (window.supabase && typeof window.supabase.createClient === 'function') {
                    window.supabaseLoaded = true;
                    console.log('✓ Supabase carregou via IIFE');
                    resolve(true);
                } else if (window.supabase) {
                    // Pode estar em um namespace diferente
                    console.warn('supabase carregou mas createClient não está em window.supabase');
                    console.log('window.supabase:', window.supabase);
                    resolve(false);
                } else {
                    console.error('❌ Supabase não foi exposido globalmente');
                    resolve(false);
                }
            }, 100);
        };
        
        script.onerror = () => {
            clearTimeout(timeout);
            console.error('❌ Erro ao carregar script Supabase');
            window.supabaseLoaded = false;
            resolve(false);
        };
        
        document.head.appendChild(script);
    });
})();
