# 🚀 Guia Completo de SEO - Site de Psicologia

## ✅ Melhorias Já Implementadas no index.html

### 1. **Meta Tags e Title Otimizados**
- **Title:** "Psicóloga em Piracicaba | Terapia Online | Ansiedade e Autoestima - Dra. Franciele Silva"
- **Meta Description:** Completa e atrativa com palavras-chave
- **Keywords:** psicóloga piracicaba, terapia, ansiedade, autoestima, TCC, TDAH, etc.

### 2. **Schema.org Estruturado**
- Implementado LocalBusiness schema
- Inclui endereço (Piracicaba, SP), telefone, áreas de atuação
- Ajuda Google a entender melhor seu negócio

### 3. **Open Graph Tags**
- Tags para compartilhamento no Facebook, WhatsApp, Instagram
- Melhora a aparência em redes sociais

### 4. **Estrutura Semântica Correta**
- H1: "Psicóloga Especializada em Terapia Online em Piracicaba" (único H1)
- H2: "Sobre a Psicóloga", "Especialidades de Atendimento em Piracicaba e Online"
- H3: Cada especialidade agora é H3
- Usadas tags semânticas: `<header>`, `<section>`, `<footer>`

### 5. **Conteúdo Otimizado**
- Adicionada seção introdutória com palavras-chave relevantes
- Descrições expandidas com termos de busca (ansiedade, autoestima, terapia online)
- Localização (Piracicaba) mencionada em vários pontos

---

## 📋 Próximas Ações Recomendadas

### 1. **Atualizar o `<script>` Schema.org com Dados Reais**
Na seção `<head>` do seu arquivo, procure por `schema.org` e atualize:

```json
{
  "address": {
    "streetAddress": "Rua/Avenida [insira seu endereço]",
    "addressLocality": "Piracicaba",
    "addressRegion": "SP",
    "postalCode": "[seu CEP]",
    "addressCountry": "BR"
  },
  "telephone": "[seu telefone com código: +55 19 XXXXX-XXXX]",
  "url": "https://www.seu-dominio.com/",
  "sameAs": [
    "https://www.instagram.com/[seu-instagram]",
    "https://www.facebook.com/[sua-pagina]"
  ]
}
```

### 2. **Atualizar Canonical URL**
```html
<link rel="canonical" href="https://www.seu-dominio-real.com/">
```
- Altere para o domínio real do seu site

### 3. **Criar/Otimizar Páginas Internas**

#### A) **pages/sobre.html**
- **Title:** "Sobre Dra. Franciele Silva - Psicóloga em Piracicaba | TCC"
- **Meta Description:** "Conheça a história e especialização da Dra. Franciele Silva, psicóloga em Piracicaba com experiência em TCC, RH e terapia online."
- Incluir foto profissional com alt text descritivo
- Schema.org: `Person` schema

#### B) **pages/agendamento.html**
- **Title:** "Agendar Consulta com Psicóloga em Piracicaba | Terapia Online"
- **Meta Description:** "Agende sua consulta com a Dra. Franciele Silva. Atendimento online e presencial em Piracicaba."
- Adicionar formulário bem estruturado com atributos acessíveis

#### C) **pages/contatos.html**
- **Title:** "Contato - Psicóloga em Piracicaba | Dra. Franciele Silva"
- **Meta Description:** "Entre em contato com o consultório de psicologia em Piracicaba. Atendimento telefônico, email e formulário de contato."
- Schema.org: `ContactPoint` schema

---

## 🎯 Estratégia de Palavras-Chave por Página

### **Página Principal (index.html)** - Já otimizada
- Focus Keywords: "psicóloga piracicaba", "terapia online"
- Long-tail: "psicóloga em piracicaba sp", "terapia cognitivo comportamental piracicaba"

### **Página de Ansiedade (sugestão: criar pages/ansiedade.html)**
- Focus Keywords: "tratamento de ansiedade", "ansiedade em piracicaba"
- Conteúdo: 600-800 palavras sobre sintomas, tratamento com TCC, como agendar

### **Página de Autoestima (sugestão: criar pages/autoestima.html)**
- Focus Keywords: "aumentar autoestima", "terapia para autoestima"
- Conteúdo: Dicas práticas, abordagem terapêutica, depoimentos

### **Página TDAH**
- Focus Keywords: "TDAH em adultos piracicaba", "diagnóstico TDAH"
- Conteúdo: Sintomas, impacto na vida, tratamento

---

## 📝 Textos Sugeridos com Palavras-Chave para Piracicaba

### **Parágrafo para Index (já adicionado)**
```
"Bem-vindo ao consultório de psicologia em Piracicaba! Sou Dra. Franciele Silva, 
psicóloga especializada em Terapia Cognitivo-Comportamental (TCC), oferecendo 
atendimento profissional presencialmente em Piracicaba-SP e online. 
Especializada em ansiedade, autoestima, TDAH..."
```

### **Para Seção de Localização**
```
"Consultório em Piracicaba - SP
Além do atendimento presencial em Piracicaba, oferecemos terapia online 
para pacientes em todo o Brasil. Localizada na região de Piracicaba, 
em São Paulo, nossa clínica oferece um ambiente acolhedor e profissional 
para tratar seus desafios de saúde mental."
```

---

## 🔧 Melhorias Técnicas de SEO

### 1. **Favicon**
Adicione no `<head>`:
```html
<link rel="icon" type="image/png" href="favicon.png">
```

### 2. **Sitemap XML**
Crie arquivo `sitemap.xml` na raiz:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seu-dominio.com/</loc>
    <lastmod>2026-04-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://seu-dominio.com/pages/sobre.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://seu-dominio.com/pages/agendamento.html</loc>
    <priority>0.9</priority>
  </url>
  <!-- Adicione mais URLs -->
</urlset>
```

### 3. **Robots.txt**
Crie arquivo `robots.txt` na raiz:
```
User-agent: *
Allow: /
Sitemap: https://seu-dominio.com/sitemap.xml
```

### 4. **Otimização de Imagens**
- Comprima imagens (use TinyPNG ou similar)
- Adicione `alt text` descritivo em todas as imagens
- Exemplo: `alt="Dra. Franciele Silva - Psicóloga em Piracicaba"`

### 5. **Performance**
- Comprima CSS e JavaScript
- Use lazy loading para imagens
- Teste em Google PageSpeed Insights

---

## 📊 Ferramentas Essenciais para Monitorar SEO

1. **Google Search Console** (grátis)
   - Registre seu site
   - Envie sitemap.xml
   - Monitore palavras-chave

2. **Google Analytics 4** (grátis)
   - Adicione ID de rastreamento
   - Monitore tráfego e comportamento

3. **Google My Business** (grátis)
   - Essencial para "Psicóloga Piracicaba"
   - Adicione informações completas do consultório
   - Fotos, horários, contato

4. **Ubersuggest** (paga)
   - Pesquisa de palavras-chave
   - Análise de concorrência

5. **SEMrush** (paga)
   - Auditoria SEO completa
   - Recomendações de otimização

---

## 💡 Dicas Prioritárias

### **Curto Prazo (Próximos 7 dias)**
- ✅ Atualizar dados do schema.org com informações reais
- ✅ Registrar no Google Search Console
- ✅ Registrar em Google My Business (local)
- ✅ Otimizar imagens

### **Médio Prazo (2-4 semanas)**
- ✅ Criar páginas para ansiedade e autoestima
- ✅ Criar blog com posts sobre temas relevantes
- ✅ Implementar sitemap e robots.txt
- ✅ Adicionar schema.org nas outras páginas

### **Longo Prazo (1-3 meses)**
- ✅ Gerar backlinks (artigos em blogs parceiros)
- ✅ Criar conteúdo de alta qualidade com +1000 palavras
- ✅ Implementar estratégia de redes sociais
- ✅ Monitorar rankings e ajustar

---

## 🚀 Checklist de SEO

- [ ] Title otimizado com palavras-chave
- [ ] Meta description completa (150-160 caracteres)
- [ ] Meta keywords incluídas
- [ ] Schema.org LocalBusiness implementado
- [ ] Dados reais no schema (endereço, telefone)
- [ ] Estrutura Hn correta (H1, H2, H3)
- [ ] Imagens com alt text
- [ ] Canonical URL definida
- [ ] Open Graph tags adicionadas
- [ ] Favicon adicionado
- [ ] Sitemap XML criado
- [ ] Robots.txt criado
- [ ] Google Search Console registrado
- [ ] Google My Business configurado
- [ ] Google Analytics 4 configurado
- [ ] Páginas internas otimizadas
- [ ] Links internos estratégicos
- [ ] Site mobile-friendly (responsive)

---

## 📞 Próximos Passos

1. **Atualize o schema.org** com seus dados reais
2. **Registre em Google My Business** (muito importante para "em Piracicaba")
3. **Envie sitemap para Google Search Console**
4. **Crie conteúdo** sobre ansiedade e autoestima
5. **Otimize as imagens** (tamanho e alt text)

Boa sorte com seu site! 🎯
