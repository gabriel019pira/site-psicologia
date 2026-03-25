# Testar URLs IIFE que funcionam no browser
$urls = @(
    'https://iife.esm.sh/@supabase/supabase-js',
    'https://cdn.skypack.dev/@supabase/supabase-js',
    'https://esm.sh/@supabase/supabase-js?bundle',
    'https://unpkg.com/@supabase/supabase-js'
)

foreach ($url in $urls) {
    try {
        $resp = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "OK: $url (Size: $($resp.Content.Length))"
    } catch {
        Write-Host "FAIL: $url"
    }
}



