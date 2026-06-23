# 🍔 YumyLand V1 - SaaS para Restaurantes

**A plataforma completa para gestão de lanchonetes, restaurantes, cafés e pastelarias em Moçambique.**

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4)
![PWA](https://img.shields.io/badge/PWA-Ready-purple)

## 📋 Funcionalidades

### Landing Page
- Hero section com CTA
- Seção de funcionalidades
- Planos e preços (Básico 499, Profissional 999, Premium 1.999 MZN/mês)
- Primeiro mês grátis

### Autenticação
- Login
- Cadastro de empresa (7 tipos de negócio)

### Painel da Empresa (Dashboard)
- Vendas hoje
- Reservas hoje
- Clientes ativos
- Receita mensal
- Pedidos recentes
- Próximas reservas

### Gestão de Produtos
- CRUD completo
- Fotos, preços, estoque
- Promoções e combos
- Filtro por categoria

### Gestão de Categorias
- Cards com ícones
- Contagem de produtos

### Reservas
- Lista com filtros de status
- Confirmar / Cancelar / Concluir
- Pagamento antecipado

### Clientes & Programa de Fidelidade
- Tabela de clientes
- Cartão digital
- Acúmulo de pontos (100 MZN = 1 ponto)
- Níveis: 🥉 Bronze → 🥈 Prata → 🥇 Ouro → 💎 Diamante
- 100 pontos = 100 MZN de desconto

### Área do Cliente (Público)
- Cardápio digital com fotos e preços
- Promoções e combos
- Reserva de mesa (wizard 3 passos)
- Pagamento antecipado (M-Pesa, e-Mola, Visa, Mastercard)
- Modal "Quero Ser Cliente Fixo"

### Painel Master (Admin)
- Estatísticas gerais
- Gestão de empresas
- Gestão de assinaturas (Ativar/Suspender/Renovar)
- Cobranças e histórico de pagamentos
- Distribuição de planos
- Receita por método de pagamento

### Internacionalização
- 🇲🇿 Português (padrão)
- 🇬🇧 Inglês

### PWA (Progressive Web App)
- Funciona como app nativo
- Android, iPhone, Tablet, Computador
- Offline page
- Service Worker com cache

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| i18n | next-intl |
| PWA | Service Worker + Manifest |
| Icons | SVG inline (Heroicons style) |

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   └── [locale]/
│       ├── page.tsx              # Landing Page
│       ├── (auth)/
│       │   ├── login/            # Login
│       │   └── register/         # Cadastro
│       ├── (dashboard)/
│       │   ├── dashboard/        # Dashboard
│       │   ├── products/         # Produtos
│       │   ├── categories/       # Categorias
│       │   ├── reservations/     # Reservas
│       │   └── customers/        # Clientes
│       ├── (public)/
│       │   ├── menu/[slug]/      # Cardápio público
│       │   └── reserve/[slug]/   # Reserva de mesa
│       └── (master)/
│           └── master/           # Painel Master
│               ├── companies/
│               ├── subscriptions/
│               └── billing/
├── components/
│   ├── ui/                       # Componentes reutilizáveis
│   ├── layout/                   # Sidebar, Header, Navbar
│   └── landing/                  # Componentes da Landing
├── i18n/                         # Configuração i18n
├── lib/                          # Utilitários
└── types/                        # Tipos TypeScript
messages/
├── pt.json                       # Traduções Português
└── en.json                       # Traduções Inglês
public/
├── manifest.json                 # PWA Manifest
├── sw.js                         # Service Worker
├── offline.html                  # Página offline
└── icons/                        # Ícones PWA
```

## 💳 Integrações de Pagamento (Planejadas)

- **M-Pesa** - API Vodacom Moçambique
- **e-Mola** - API Movitel
- **Visa/Mastercard** - Gateway de pagamento

## 📊 Planos de Assinatura

| Plano | Preço | Recursos |
|-------|-------|----------|
| Básico | 499 MZN/mês | Cardápio digital, 50 produtos, Reservas, Email |
| Profissional | 999 MZN/mês | + Ilimitado, Fidelidade, Pagamentos, Prioritário |
| Premium | 1.999 MZN/mês | + Multi-filiais, API, Relatórios, Gerente dedicado |

## 🎯 Próximos Passos (V2)

- [ ] Backend com NestJS ou Laravel
- [ ] PostgreSQL database
- [ ] Integração real M-Pesa / e-Mola
- [ ] Notificações push
- [ ] Dashboard analytics avançado
- [ ] App publicado na Play Store / App Store
- [ ] Suporte a mais tipos de negócio (Hotéis, Food Trucks)
- [ ] QR Code para cardápio

## 📄 Licença

Proprietary - YumyLand © 2024

---

**Desenvolvido com ❤️ para o mercado moçambicano**
