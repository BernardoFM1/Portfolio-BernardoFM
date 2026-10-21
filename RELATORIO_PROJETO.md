# Relatório de Estado e Contexto do Projeto — Portfólio Bernardo Fernando

> **Destinatário:** Este documento foi elaborado para fornecer a uma IA ou desenvolvedor parceiro um panorama completo, técnico e detalhado de tudo o que foi construído, das regras de design estabelecidas, da arquitetura adotada e do status atual do repositório.

---

## 1. Visão Geral do Projeto

- **Proprietário:** Bernardo Fernando ([@BernardoFM1](https://github.com/BernardoFM1))
- **Perfil profissional:** Desenvolvedor back-end focado em **C# e ASP.NET Core**.
- **Objetivo do projeto:** Portfólio pessoal autêntico, limpo e direto ao ponto, com foco na experiência do usuário, tipografia técnica e acessibilidade, evitando estética genérica de templates de IA (sem gradientes roxos, sem glassmorphism, sem animações pesadas, sem clichês).
- **Hospedagem de destino:** Vercel (plano Hobby, site estático compilado sem SSR).
- **Idiomas suportados:** Português (PT) e Inglês (EN).

---

## 2. Stack Tecnológica e Decisões de Arquitetura

- **Framework:** **Angular 22+** (versão estável mais recente).
- **Paradigma de Componentes:** Componentes Standalone (`standalone: true`) sem `NgModule`.
- **Reatividade e Estado:** **Angular Signals** (`signal`, `computed`) para reatividade leve e granular em todos os serviços e componentes.
- **CSS / Estilização:** **Vanilla CSS puro** baseado em variáveis/tokens no `:root`. Sem TailwindCSS, sem bibliotecas pesadas de UI (Material, Bootstrap, etc.).
- **Compilação e Saída:** Saída estática (`ng build` gera arquivos HTML, CSS e JS puros na pasta `dist/`).
- **Testes Unitários:** **Vitest** (com `@angular/build` e `jsdom`).
- **Acessibilidade (a11y):** Elementos semânticos nativos (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`), contraste de texto mínimo de 4,5:1 (WCAG AA), foco visível realçado com `--accent`, e alvos de toque mínimos de 44px.

---

## 3. Design System e Tokens (definidos em `AGENTS.md`)

Todas as cores e tipografias são centralizadas em `src/styles.css`:

```css
:root {
  /* Cores de Fundo e Superfície */
  --bg: #141517;              /* Fundo da página */
  --surface: #1C1E21;         /* Cards e superfícies */
  
  /* Bordas */
  --border: #2E3035;          /* Borda dos cards vizinhos */
  --border-strong: #5A564D;   /* Botões secundários e avatar reservado */
  
  /* Tipografia */
  --text: #ECE8DF;            /* Títulos, botões e texto principal */
  --text-muted: #A8A399;      /* Descrições, resumos e rótulos */
  --text-dim: #8F8A80;        /* Texto dos cards vizinhos (cinza com contraste >= 4.5:1) */
  
  /* Cor de Destaque */
  --accent: #E8A33D;          /* Destaque âmbar, hover, foco e borda ativa */

  /* Fontes (Google Fonts) */
  --font-text: 'IBM Plex Sans', -apple-system, sans-serif; /* Títulos e corpo */
  --font-mono: 'IBM Plex Mono', monospace;                 /* Stack, tags, contadores */

  /* Raios de Arredondamento */
  --radius-card: 12px;
  --radius-btn: 8px;

  /* Layout */
  --container-max-width: 1280px;
}
```

---

## 4. O que Já Foi Construído (Slices 1 a 5)

O desenvolvimento seguiu a divisão de fatias (slices) recomendada no briefing:

### Slice 1 — Setup, Tokens CSS, Fontes e Esqueleto
- Configuração inicial do Angular com Vite/Vitest.
- Declaração dos tokens CSS em `src/styles.css` e importação das fontes `IBM Plex Sans` (400, 600) e `IBM Plex Mono` (400, 500).
- Reset CSS, estilos globais para `:focus-visible` usando `--accent`, e suporte obrigatório a `@media (prefers-reduced-motion: reduce)`.
- Estrutura base da página (`src/app/app.html`).

### Slice 2 — Cabeçalho, Seletor de Idioma e Internacionalização (i18n)
- **`TranslationService` (`src/app/services/translation.service.ts`):**
  - Armazena o idioma ativo (`signal<'pt' | 'en'>('pt')`).
  - Carrega dicionários em memória de `src/app/i18n/pt.json` e `src/app/i18n/en.json`.
  - Atualiza o atributo global `document.documentElement.lang` automaticamente a cada troca.
- **`LanguageToggle` (`src/app/components/language-toggle/`):**
  - Botões `PT` | `EN` com `role="group"` e `aria-pressed` informando o estado acessível.
- **`Header` (`src/app/components/header/`):**
  - Identificação de marca ("Bernardo Fernando") à esquerda.
  - Links de navegação para `#projetos`, link externo seguro para o GitHub (`https://github.com/BernardoFM1`) e `#contato`.
  - No mobile, os links de texto do cabeçalho ocultam-se para dar espaço ao seletor de idioma, migrando links rápidos para o Hero.

### Slice 3 — Apresentação (`ProfileHero`)
- **`ProfileHero` (`src/app/components/profile-hero/`):**
  - Foto em círculo perfeito (176×176px no desktop, 88×88px no mobile).
  - Suporte a avatar real via GitHub (`https://github.com/BernardoFM1.png`) com fallback automático para placeholder reservado estilizado `[sua foto]`.
  - Título H1 ("Bernardo Fernando"), subtítulo de stack em fonte técnica (`IBM Plex Mono`) e parágrafo de bio traduzido.
  - Links rápidos para GitHub e Contato visíveis na versão mobile.

### Slice 4 — Carrossel de Projetos e Cartões (`ProjectCarousel` e `ProjectCard`)
- **`ProjectCard` (`src/app/components/project-card/`):**
  - **Variante `featured` (destaque central):** Card expandido, borda `--accent`, título, resumo do projeto, badges das linguagens/tecnologias em `IBM Plex Mono`, botões com links "Ver no GitHub →" e "Ler README". Exibe aviso discreto *"Conteúdo em português"* quando a interface está em inglês.
  - **Variante `neighbor` (vizinho lateral):** Card menor, visual em tons de cinza (`--text-dim`), clicável com `role="button"` e `tabindex="0"`, navegando o carrossel ao clicar ou pressionar Enter/Espaço.
- **`ProjectCarousel` (`src/app/components/project-carousel/`):**
  - Exibe 3 slots: Vizinho Anterior, Destaque Central, Próximo Vizinho.
  - **Sem loop infinito:** No primeiro projeto não há vizinho à esquerda; no último não há à direita.
  - **Navegação acessível múltipla:**
    1. Setas de anterior/próximo (`<` e `>`).
    2. Teclado global: setas `←` (`ArrowLeft`) e `→` (`ArrowRight`), ignorando se o usuário estiver digitando em formulários.
    3. Clique direto no cartão vizinho.
    4. Gestos touch de arrastar (swipe com tolerância de 45px) no mobile.
  - Pontinhos (`dots`) indicadores de posição (visíveis no desktop).
  - Contador textual (`X / Y`) em fonte mono com `aria-live="polite"`.

### Slice 5 — Responsividade Fina (Desktop 1280px e Mobile 390px)
- **Desktop (1280px):** Layout centralizado, cabeçalho espaçoso, carrossel exibindo o projeto central e os vizinhos laterais com proporção e espaçamento equilibrados.
- **Mobile (390px):**
  - Apresentação exibe a foto menor ao lado do nome/stack, com a bio ocupando a largura total logo abaixo.
  - Carrossel exibe o card ativo em largura quase total com os vizinhos aparecendo apenas como uma pequena pontinha nas bordas (*peeking effect*).
  - Ocultação dos dots no mobile, preservando setas, contador e suporte a swipe por toque.
- **Telas intermediárias / tablets:** Flexibilidade com `max-width` e media queries fluidas.

---

## 5. Leitura de Dados e Lógica de Ordenação

Implementado em `src/app/services/projects.service.ts`:
- **Fontes de dados (build time):**
  - `src/content/projects.generated.json`: Lista de projetos contendo `slug`, `title`, `summary`, `url`, `languages`, `topics` e `pushedAt`. (Arquivo nunca editado manualmente).
  - `src/content/projects.overrides.json`: Configurações manuais do proprietário contendo `slug`, `priority` (número opcional) e `hidden` (booleano opcional).
- **Regra de Ordenação estrita:**
  1. Itens com `hidden: true` são removidos.
  2. Projetos que possuem `priority` vêm primeiro, em ordem crescente de prioridade (`priority: 1`, depois `2`, etc.).
  3. Demais projetos vêm em seguida, ordenados do `pushedAt` mais recente para o mais antigo.

---

## 6. Estrutura de Arquivos do Projeto

```
PortifolioBernardoFM/
├── AGENTS.md                          # Regras, briefing e tokens originais
├── RELATORIO_PROJETO.md               # Este relatório de handover
├── package.json                       # Angular 22, Vitest, TypeScript
├── angular.json                       # Configurações do Angular CLI
├── tsconfig.json                      # Configuração TypeScript
├── public/                            # Favicon e arquivos estáticos
├── src/
│   ├── index.html                     # HTML base com fontes IBM Plex e lang dinâmico
│   ├── main.ts                        # Bootstrap standalone do Angular
│   ├── styles.css                     # Tokens globais CSS e estilos base
│   ├── content/
│   │   ├── projects.generated.json    # JSON simulando saída do robô
│   │   └── projects.overrides.json    # JSON com prioridades/hidden do usuário
│   └── app/
│       ├── app.ts / app.html / app.css
│       ├── app.spec.ts
│       ├── app.config.ts
│       ├── i18n/
│       │   ├── pt.json                # Textos da UI em português
│       │   └── en.json                # Textos da UI em inglês
│       ├── models/
│       │   └── project.model.ts       # Interfaces TypeScript para projetos
│       ├── services/
│       │   ├── translation.service.ts # Gerenciador de idioma reativo
│       │   ├── translation.service.spec.ts
│       │   ├── projects.service.ts    # Fusão dos JSONs e ordenação
│       │   └── projects.service.spec.ts
│       └── components/
│           ├── header/                # Barra de navegação e marca
│           ├── language-toggle/       # Chaveador PT / EN
│           ├── profile-hero/          # Apresentação pessoal e avatar
│           ├── project-card/          # Card individual (featured e neighbor)
│           └── project-carousel/      # Carrossel com navegação e gestos
```

---

## 7. Status de Testes e Qualidade

Todos os testes unitários foram implementados com Vitest e estão passando com 100% de sucesso:

```bash
$ ng test --watch=false

✓ src/app/services/projects.service.spec.ts (3 tests)
✓ src/app/services/translation.service.spec.ts (3 tests)
✓ src/app/components/language-toggle/language-toggle.spec.ts (3 tests)
✓ src/app/components/project-card/project-card.spec.ts (3 tests)
✓ src/app/components/profile-hero/profile-hero.spec.ts (3 tests)
✓ src/app/components/header/header.spec.ts (4 tests)
✓ src/app/components/project-carousel/project-carousel.spec.ts (5 tests)
✓ src/app/app.spec.ts (5 tests)

Test Files  8 passed (8)
Tests       29 passed (29)
```

---

## 8. Próximos Passos e Oportunidades Futuras

1. **GitHub Actions (Robô de Projetos - fora do escopo da UI):**
   - Configurar o robô que consome a API do GitHub para preencher automaticamente o arquivo `src/content/projects.generated.json` a partir dos repositórios reais com o tópico `portfolio`.
2. **Conteúdo Definitivo do Dono:**
   - Preencher a bio pessoal em `src/app/i18n/pt.json` e `src/app/i18n/en.json` (atualmente com texto reservado `[Sua apresentação...]`).
   - Definir os projetos reais e suas prioridades no `projects.overrides.json`.
3. **Deploy Contínuo na Vercel:**
   - Conectar o repositório à Vercel. O comando de build é `npm run build` e a pasta de saída é `dist/portfolio/browser`.

---
*Documento gerado em 21 de outubro de 2026 para alinhamento entre IAs e desenvolvimento contínuo.*
