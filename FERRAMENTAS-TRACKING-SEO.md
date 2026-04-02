# 📊 Configuração de Ferramentas de Tracking e Análise

## 1. Google Search Console (GSC)

### O que é?
Ferramenta gratuita do Google que ajuda a monitorar a presença do seu site nos resultados de pesquisa.

### Como configurar:

1. Acesse: https://search.google.com/search-console
2. Clique em "Adicionar propriedade"
3. Escolha "Domínio" e insira seu domínio
4. Escolha um método de verificação:
   - **Recomendado:** Meta tag HTML
   - Copie a meta tag fornecida
   - Cole no `<head>` do seu `index.html`

### Meta tag a adicionar (substituir com código do GSC):
```html
<meta name="google-site-verification" content="CÓDIGO_QUE_GOOGLE_FORNECERÁ">
```

### Após verificação:
1. Envie seu `sitemap.xml`: Clique em "Sitemaps" → "Adicionar sitemap"
2. Insira: `seu-dominio.com/sitemap.xml`
3. Monitore: Em "Desempenho", veja quais palavras-chave buscam seu site

---

## 2. Google Analytics 4 (GA4)

### O que é?
Ferramenta de análise gratuita que rastreia visitantes, comportamento e conversões.

### Como configurar:

1. Acesse: https://analytics.google.com
2. Crie uma conta nova ou use a existente
3. Configure uma propriedade **GA4**
4. Crie um **Web Stream** com seu domínio
5. Copie o **ID de Medição** (formato: G-XXXXXXXXXX)

### Adicione no `<head>` do seu HTML:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Substitua `G-XXXXXXXXXX` com seu ID real**

### O que monitorar no GA4:
- **Overview:** Resumo de visitas, usuários, taxa de rejeição
- **Acquisition:** De onde vêm seus visitantes (Google, direto, redes sociais)
- **Engagement:** Páginas mais visitadas, tempo de permanência
- **Conversions:** Agendamentos realizados (quando integrar com sistema)

---

## 3. Google My Business (GMB)

### O que é?
**ESSENCIAL para "psicóloga em Piracicaba"** - aparecer no Google Maps e resultados locais.

### Como configurar:

1. Acesse: https://www.google.com/business
2. Clique em "Gerenciar meu negócio"
3. Procure seu consultório ou **crie novo negócio**
4. Preencha fielmente:
   - **Nome:** Dra. Franciele Silva - Psicóloga
   - **Categoria:** Psicólogo / Consultório de Psicologia
   - **Endereço:** Seu endereço em Piracicaba
   - **Telefone:** Seu número (com WhatsApp se possível)
   - **Website:** https://seu-dominio.com
   - **Horários:** Dias e horários de funcionamento
   - **Sobre:** Descrição com palavras-chave (ansiedade, autoestima, TCC, online)
   - **Fotos:** Adicionar fotos profissionais do consultório
   - **Atribuição de posts:** Posts regulares sobre temas de saúde mental

### Por que é importante:
- Melhora ranking para buscas locais ("psicóloga piracicaba")
- Aumenta confiança (verificação do Google)
- Aparece no Google Maps
- Clientes veem avaliações e horários direto no Google

---

## 4. Facebook Pixel (Opcional - para anúncios)

### Se pretender fazer publicidade no Facebook:

```html
<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'SEU_PIXEL_ID_AQUI');
  fbq('track', 'PageView');
</script>
```

---

## 5. Hotjar (Opcional - para analytics do comportamento)

Ferramenta que mostra **heat maps** (cliques do usuário) e gravações de sessões.

Acesse: https://www.hotjar.com/
- Registre-se grátis
- Copie o código de tracking fornecido
- Adicione ao `<head>` do seu site

---

## 📋 Checklist de Implementação

### Imediato (Esta semana):
- [ ] Meta tag do Google Search Console adicionada
- [ ] Google Search Console verificado
- [ ] Sitemap.xml enviado ao GSC
- [ ] Google Analytics 4 implementado
- [ ] Google My Business criado e completo

### Próxima semana:
- [ ] Primeiras conversões rastreadas (agendamentos)
- [ ] Monitorar dados no GA4
- [ ] Monitorar rankings no GSC
- [ ] Responder a avaliações no GMB

### Próximo mês:
- [ ] Análise de dados de tráfego
- [ ] Otimizações baseadas em dados
- [ ] Criar mais conteúdo sobre palavras-chave que trazem tráfego

---

## 🔗 Links Importantes

| Ferramenta | URL |
|-----------|-----|
| **Google Search Console** | https://search.google.com/search-console |
| **Google Analytics 4** | https://analytics.google.com |
| **Google My Business** | https://www.google.com/business |
| **Google PageSpeed Insights** | https://pagespeed.web.dev |
| **Google Mobile-Friendly** | https://search.google.com/test/mobile-friendly |
| **Google Rich Results Test** | https://search.google.com/test/rich-results |

---

## 📝 Código Pronto para Copiar e Colar

### No `<head>` do seu index.html, adicione TUDO isto (após as tags meta existentes):

```html
<!-- Google Site Verification -->
<meta name="google-site-verification" content="INSIRA_AQUI_VERIFICAÇÃO_GSC">

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-INSIRA_AQUI"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-INSIRA_AQUI');
</script>

<!-- Hotjar (opcional) -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:INSIRA_AQUI,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## 💡 Dicas de Otimização com Base em Dados

Após 2-4 semanas com GA4 e GSC ativo:

1. **Palavras-chave que trazem mais tráfego:** Crie mais conteúdo sobre essas
2. **Páginas com alta taxa de rejeição:** Melhore o conteúdo ou CTA
3. **Dispositivos mais usados:** Otimize para mobile (já está responsivo?)
4. **Horários de pico:** Agende postagens para essas horas nas redes sociais

---

## 🚀 Próximas Ações

1. ✅ **Hoje:** Registre no Google Search Console
2. ✅ **Hoje:** Registre no Google My Business
3. ✅ Implemente Google Analytics 4
4. ✅ Envie sitemap ao GSC
5. ✅ Validar tags de SEO nos Rich Results Test
6. Aguarde 2-4 semanas para dados no GSC
7. Comece a criar conteúdo baseado em dados

Bom trabalho! 🎯
