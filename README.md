Este projeto é uma API backend desenvolvida como parte de um teste técnico para a Conéctar. O objetivo é fornecer uma base sólida, escalável e de fácil manutenção, seguindo boas práticas de desenvolvimento.

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Projeto](#configuração-do-projeto)
- [Execução da Aplicação](#execução-da-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Decisões de Design e Arquitetura](#decisões-de-design-e-arquitetura)
- [Testes](#testes)
- [Considerações Finais](#considerações-finais)

---

## Tecnologias Utilizadas

- Node.js (versão 22.11.0)
- Express.js
- TypeScript
- PostgreSQL
- Prisma (ORM)
- Jest
- Docker
- Swagger

## Pré-requisitos

- Node.js
- Gerenciador de pacotes de sua preferencia (recomendo bun ou npm)
- Banco de dados PostgreSQL em execução
- Docker (opcional, para ambiente isolado e/ou caso não possua o postgreSQL na máquina)

## Configuração do Projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/Luzin7/users-management.git
cd users-management
```

2. **Instale as dependências:**

```bash
bun i
# ou
npm i
```

3. **Configure as variáveis de ambiente:**

- Copie o arquivo `.env.example` para `.env` e substitua da forma que achar melhor os valores. Deixei os valores padrões para que seja mais fácil a experiência de teste local.

4. **Execute as migrations do banco de dados:**

```bash
bunx prisma migrate dev
# ou
npx prisma migrate dev
```

Caso não possua o driver do postgres na sua máquina, tenha o docker presente e execute:

```bash
docker compose up -d
# ou
sudo docker compose up -d
```

e em seguida execute os comandos de migrations acima.

## Execução da Aplicação

- **Modo desenvolvimento:**

  ```bash
  bun run dev
  # ou
  npm run dev
  ```

- **Modo produção:**

  ```bash
  bun run build
  bun run start
  # ou
  npm run build
  npm start
  ```

A API estará disponível em `http://localhost:8080` (ou na porta que você substituiu no seu `.env`).

## Estrutura do Projeto

```
src/
├─ infra/
│  ├─ databases/      # Configuração e conexão com bancos de dados
│  ├─ env/            # Gerenciamento de variáveis de ambiente
│  ├─ http/           # Configuração do servidor HTTP (Express, middlewares globais)
│  └─ presenters/     # Adaptadores para apresentação de dados (ex: serialização)
├─ modules/
│  └─ user/
│     ├─ controllers/   # Lógica das rotas e manipulação das requisições do usuário
│     ├─ dto/           # Objetos de transferência de dados (Data Transfer Objects)
│     ├─ entities/      # Entidades de domínio do usuário
│     ├─ errors/        # Erros específicos do domínio de usuário
│     ├─ gateways/      # Interfaces para integração com serviços externos
│     ├─ presenters/    # Adaptadores de apresentação específicos do módulo
│     ├─ repositories/  # Implementação dos repositórios de persistência
│     ├─ services/      # Regras de negócio do usuário
│     └─ User.module.ts # Arquivo de configuração do módulo
├─ providers/
│  ├─ auth/           # Provedores de autenticação e autorização
│  ├─ cryptography/   # Provedores de criptografia e hash
│  └─ date/           # Provedores utilitários para manipulação de datas
├─ shared/
│  ├─ core/
│  │  ├─ contracts/   # Contratos e interfaces compartilhadas
│  │  ├─ Entities/    # Entidades genéricas reutilizáveis
│  │  ├─ errors/      # Erros genéricos reutilizáveis
│  │  └─ types/       # Tipos e utilitários de tipagem
│  ├─ errors/         # Erros compartilhados entre módulos
│  └─ pipes/          # Pipes de validação e transformação de dados
└─ utils/             # Funções utilitárias gerais
```

**Principais pastas e responsabilidades:**

- **infra/**: Infraestrutura da aplicação (banco de dados, ambiente, servidor HTTP).
- **modules/**: Módulos de domínio, organizados por contexto (ex: user).
- **providers/**: Serviços de apoio como autenticação, criptografia e datas.
- **shared/**: Código compartilhado entre módulos, incluindo entidades, contratos e erros.
- **utils/**: Funções utilitárias genéricas.
  A estrutura segue o padrão modular, facilitando a escalabilidade, manutenção e testes. Cada módulo possui suas próprias camadas (controllers, services, repositories, etc.), promovendo separação de responsabilidades e baixo acoplamento.

## Decisões de Design e Arquitetura

- **TypeScript**: Escolhido para maior segurança e produtividade no desenvolvimento.
- **Express.js**: Framework minimalista, flexível e amplamente utilizado.
- **Prisma**: ORM moderna para facilitar a manipulação do banco de dados, desenvolvimento e garantir portabilidade.
- **Separação de camadas**: Controllers, services e models para melhor organização, manutenção e escalabilidade.
- **Variáveis de ambiente**: Uso do dotenv para facilitar a configuração em diferentes ambientes.
- **Testes automatizados**: Estrutura pronta para testes unitários e de integração com Jest.
- **Swagger**: Utilizado para documentar a API e facilitar a compreensão e o consumo por outros desenvolvedores.

## Testes

- Para rodar os testes:
  ```bash
  bun run test
  bun run test:e2e
  # ou
  npm run test
  npm run test:e2e
  ```

## Considerações Finais

Este projeto foi desenvolvido com foco em clareza, organização e boas práticas. Pode lhe servir como base para algo ainda maior.

---
