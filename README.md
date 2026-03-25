# 🧠 Site Consultório Psicologia - Franciele Silva

Site profissional para consultório de psicologia com sistema de agendamento online integrado com **Supabase** para sincronização em tempo real.

## ✨ Características

✅ **Página Inicial** - Apresentação elegante do consultório com foto e serviços  
✅ **Sistema de Agendamento** - Marcação de consultas com horários disponíveis  
✅ **Sincronização em Tempo Real** - Supabase sincroniza agendamentos entre dispositivos  
✅ **Acompanhamento de Agendamentos** - Pacientes consultam seus agendamentos por telefone  
✅ **Painel Administrativo** - Gerenciamento completo (confirmar, cancelar, limpar)  
✅ **Design Responsivo** - Mobile-first, funciona em todos os dispositivos  
✅ **Base de Dados na Nuvem** - Supabase PostgreSQL para persistência de dados  

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Banco de Dados**: Supabase (PostgreSQL)
- **Hosting**: GitHub Pages
- **Tema**: Cores profissionais #5B9FBF (azul céu)

## 📂 Estrutura do Projeto

```
site-psicologa/
├── index.html                    # Página inicial
├── css/
│   └── style.css                # Estilos globais (responsivos)
├── js/
│   ├── agendamento.js           # Funções de negócio
│   └── supabase-config.js       # Cliente Supabase + CRUD
├── pages/
│   ├── agendamento.html         # Formulário de agendamento
│   ├── meus-agendamentos.html   # Consulta agendamentos
│   ├── admin.html               # Painel administrativo
│   ├── sobre.html               # Informações da psicóloga
│   └── contatos.html            # Formulário de contato
└── README.md
```

## 🚀 Como Usar

### 1. **Agendar Consulta**
- Acesse a página "Agendamento"
- Preencha formulário com dados pessoais
- Escolha data (segunda a sexta) e horário
- Agendamento é salvo no Supabase em tempo real

### 2. **Consultar Meus Agendamentos**
- Acesse "Meus Agendamentos"
- Digite seu telefone
- Visualize todos os seus agendamentos
- Cancele agendamentos futuros se necessário

### 3. **Painel do Admin**
- Acesse "Administrador"
- Digite senha: **admin123**
- Veja estatísticas e lista de agendamentos
- Confirme ou cancele agendamentos
- Limpe todos os agendamentos (com confirmação)

## 🔧 Configuração Supabase

O projeto já está configurado com Supabase. Os dados estão em:
- **Projeto**: dpobhypdzgorabjlkppv
- **Tabelas**: `agendamentos` e `pacientes`

As credenciais estão em `js/supabase-config.js`

## 📱 Responsividade

- **Desktop**: Layout em grid com sidebar
- **Tablet**: Layout adaptado
- **Mobile**: menu hamburger, stack vertical

## 🔐 Segurança

⚠️ **Importante**: 
- A senha do admin ("admin123") está no código - mude em produção!
- Use variáveis de ambiente para credenciais sensíveis
- Implemente autenticação real antes de colocar em produção

## 🌐 GitHub Pages Setup

Para fazer deploy no GitHub Pages:

```bash
# 1. Crie repositório vazio no GitHub: site-psicologia
# 2. Adicione remote
git remote add origin https://github.com/SEU_USUARIO/site-psicologia.git

# 3. Faça push
git branch -M main
git push -u origin main

# 4. Ative GitHub Pages
# Vá em: Settings > Pages > Source: Deploy from branch (main)

# 5. Acesse seu site em:
# https://SEU_USUARIO.github.io/site-psicologia
```

## 📝 Licença

© 2026 Franciele Silva - Consultório de Psicologia
├── css/
│   └── style.css          # Estilos globais
├── js/
│   └── agendamento.js     # Sistema de agendamento (localStorage)
└── pages/
    ├── sobre.html         # Sobre a psicóloga
    ├── agendamento.html   # Formulário de agendamento
    ├── meus-agendamentos.html  # Consultas dos pacientes
    ├── admin.html         # Painel administrativo
    └── contatos.html      # Página de contatos
```

## 🚀 Como Usar

### Abrir o Site
1. Abra o arquivo `index.html` em seu navegador
2. Navegue pelas páginas usando o menu de navegação

### Agendar uma Consulta
1. Clique em "Agendamento" no menu
2. Preencha seus dados (nome, email, telefone)
3. Selecione a data e horário disponível
4. Informe o motivo da consulta
5. Clique em "Agendar Consulta"

### Acompanhar Seus Agendamentos
1. Clique em "Meus Agendamentos"
2. Digite seu email
3. Clique em "Buscar Agendamentos"
4. Veja todos seus agendamentos passados e futuros
5. Pode cancelar agendamentos futuros

### Acessar o Painel de Admin
1. Clique em "Admin" no menu
2. Digite a senha: `123456` (altere em produção!)
3. Visualize estatísticas e lista de agendamentos
4. Confirme ou cancele agendamentos
5. Filtre por status, data ou paciente

## ⚙️ Configurações

### Alterar Senha do Admin
No arquivo `pages/admin.html`, procure por:
```javascript
const SENHA_ADMIN = '123456';
```
Substitua `123456` pela senha desejada.

### Personalizar Horários
No arquivo `js/agendamento.js`, procure por:
```javascript
const HORARIOS_DISPONIVEIS = [
    '08:00', '08:30', '09:00', // ... adicione ou remova horários
];
```

### Modifica Informações da Psicóloga
- **Página Sobre**: Edite `pages/sobre.html`
- **Contatos**: Edite `pages/contatos.html`, seção "Informações de Contato"

## 💾 Armazenamento de Dados

O site usa `localStorage` do navegador para armazenar dados:
- **Agendamentos**: Armazenados com ID único, data, hora, status
- **Pacientes**: Informações básicas (nome, email, telefone)
- **Mensagens de Contato**: Mensagens enviadas via formulário

⚠️ **Importante**: Os dados são armazenados apenas no navegador. Limpar o cache/histórico do navegador apagará os dados!

## 🎨 Personalização de Cores

As cores principais estão definidas em `css/style.css`:
```css
:root {
    --primary-color: #2c3e50;      /* Azul escuro */
    --secondary-color: #3498db;    /* Azul claro */
    --accent-color: #e74c3c;       /* Vermelho */
    --light-bg: #ecf0f1;           /* Cinza claro */
}
```

## 📱 Responsividade

O site é totalmente responsivo e se adapta a:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (até 768px)

## 🔒 Segurança

⚠️ **Notas Importantes para Produção**:

1. **Senha Admin**: A senha padrão é `123456`. Em produção:
   - Mude para uma senha forte
   - Implemente autenticação real no backend

2. **Dados**: O localStorage não é seguro. Para produção:
   - Use um backend (Node.js, PHP, Python, etc.)
   - Implemente banco de dados (MySQL, MongoDB, etc.)
   - Use HTTPS

3. **Validação**: Implemente validação de servidor
4. **LGPD**: Respeite a Lei Geral de Proteção de Dados (LGPD)

## 📞 Suporte

Para dúvidas ou problemas com o site, entre em contato através da página "Contatos".

## 📝 Licença

Este projeto é de uso livre para consultórios de psicologia.

---

**Desenvolvido com ❤️ para saúde mental**
