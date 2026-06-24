# 🍔 YumyLand V1 - SaaS para Restaurantes

**A plataforma completa para gestão de lanchonetes, restaurantes, cafés e pastelarias em Moçambique.**

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![PWA](https://img.shields.io/badge/PWA-Ready-purple)

## 🚀 Quick Start

```bash
# 1. Clone e instale
git clone https://github.com/Jaylowkey/YUMYLAND.git
cd YUMYLAND
npm install

# 2. Suba o PostgreSQL
docker compose up -d

# 3. Configure as variáveis
cp .env.example .env

# 4. Crie as tabelas e popule
npx prisma migrate dev --name init
npx prisma db seed

# 5. Rode!
npm run dev
```

Acesse: **http://localhost:3000**

## 👤 Contas de Teste

| Email | Senha | Acesso |
|-------|-------|--------|
| `master@yumyland.co.mz` | `master123` | Painel Master (Admin) |
| `carlos@tropical.co.mz` | `owner123` | Dashboard Empresa |
| `ana@cafemaputo.co.mz` | `owner123` | Dashboard Empresa |

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilização | Tailwind CSS |
| Backend | Next.js API Routes |
| Banco de Dados | PostgreSQL + Prisma ORM |
| Autenticação | NextAuth.js (JWT) |
| Pagamentos Mobile | PaySuite (M-Pesa + e-Mola) |
| Pagamentos Cartão | Stripe (Visa + Mastercard) |
| i18n | next-intl (PT/EN) |
| PWA | Service Worker + Manifest |
| Deploy | Vercel / Railway / Docker |

## 📋 Funcionalidades Completas

### Frontend
- ✅ Landing Page com hero, features, pricing
- ✅ Login & Cadastro de Empresa
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gestão de Produtos (CRUD completo)
- ✅ Gestão de Categorias
- ✅ Gestão de Reservas (confirmar/cancelar/concluir)
- ✅ Gestão de Clientes + Programa de Fidelidade
- ✅ Cardápio Digital Público
- ✅ Reserva de Mesa (3 passos + pagamento)
- ✅ Painel Master (empresas, assinaturas, cobranças)
- ✅ PWA (funciona como app)
- ✅ Bilíngue (Português/Inglês)

### Backend
- ✅ 25+ API Routes com autenticação
- ✅ PostgreSQL com Prisma ORM (12 modelos)
- ✅ NextAuth.js com JWT e roles (MASTER/OWNER/CUSTOMER)
- ✅ Middleware de proteção de rotas
- ✅ Integração Stripe completa (PaymentIntent + Webhooks)
- ✅ Integração PaySuite completa (STK Push + Webhooks)
- ✅ Seed data para desenvolvimento
- ✅ Pronto para deploy

### Pagamentos
- ✅ M-Pesa (via PaySuite)
- ✅ e-Mola (via PaySuite)
- ✅ Visa (via Stripe)
- ✅ Mastercard (via Stripe)
- ✅ Webhooks para confirmação automática
- ✅ Status tracking de pagamentos

### Programa de Fidelidade
- 🥉 Bronze (0+ pontos)
- 🥈 Prata (200+ pontos)
- 🥇 Ouro (500+ pontos)
- 💎 Diamante (1000+ pontos)
- 100 MZN gasto = 1 ponto
- 100 pontos = 100 MZN de desconto

## 💳 Planos de Assinatura

| Plano | Preço | Recursos |
|-------|-------|----------|
| Básico | 499 MZN/mês | Cardápio, 50 produtos, Reservas |
| Profissional | 999 MZN/mês | + Ilimitado, Fidelidade, Pagamentos |
| Premium | 1.999 MZN/mês | + Multi-filiais, API, Relatórios |

**Primeiro mês grátis para todas as empresas!**

## 📖 Documentação

- 📘 [Guia de Deploy](./DEPLOY.md) - Setup local, produção, pagamentos
- 📗 [Variáveis de Ambiente](./.env.example) - Todas as configurações

## 📄 Licença

Proprietary - YumyLand © 2024

---

**Desenvolvido com ❤️ para o mercado moçambicano**
