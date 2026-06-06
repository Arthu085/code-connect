# Plano — Página de Login (Code Connect)

## Context

Queremos construir a página de **Login** do Code Connect a partir do layout anexado:
um card centralizado em fundo escuro, com o **banner** à esquerda e o **formulário**
à direita (heading "Login", subtítulo, campos "Email ou usuário" e "Senha", linha
"Lembrar-me / Esqueci a senha", botão verde "Login →", divisor "ou entre com outras
contas", logins sociais Github/Gmail e o rodapé "Crie seu cadastro!").

O CLAUDE.md exige componentes em **Atomic Design** como `index.tsx`, **Tailwind** para
estilo e **testes co-localizados** (`*.test.tsx`). Porém o `apps/web` hoje é
**TypeScript puro + Vite**, sem React, Tailwind ou test runner. Logo, antes de criar a
página precisamos **bootstrapar React + Tailwind + Vitest** no `apps/web`.

Decisões confirmadas com o usuário:
- **Stack:** React + Tailwind + Vitest (+ Testing Library).
- **Escopo do form:** UI + estado local + **validação básica** (campos obrigatórios,
  formato de email quando aplicável). **Sem chamada à API** ainda — submit válido só
  faz placeholder/`console`.
- A página de **Cadastro** não será implementada agora, mas o layout base deve ser
  **reutilizável** (mesmo card/template, banner diferente, campos diferentes).

## 1. Bootstrap do stack (`apps/web`)

Dependências (via `pnpm --filter web add ...`):
- runtime: `react`, `react-dom`
- dev: `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `tailwindcss`,
  `@tailwindcss/vite`, `vitest`, `jsdom`, `@testing-library/react`,
  `@testing-library/jest-dom`, `@testing-library/user-event`

Arquivos de config:
- **`apps/web/vite.config.ts`** (novo): plugins `react()` e `tailwindcss()`; bloco
  `test` do Vitest (`environment: 'jsdom'`, `globals: true`,
  `setupFiles: './src/test/setup.ts'`).
- **`apps/web/tsconfig.json`**: adicionar `"jsx": "react-jsx"` e
  `"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]`.
  Manter `verbatimModuleSyntax`/`erasableSyntaxOnly` → usar `import type {...}` para
  imports de tipo (ex.: `ReactNode`); o TSX não usará enums/namespaces.
- **`apps/web/src/test/setup.ts`** (novo): `import '@testing-library/jest-dom'`.
- **`apps/web/package.json`** scripts: adicionar `"test": "vitest"` e
  `"test:run": "vitest run"`. `build` permanece `tsc && vite build`.

Entrada da app:
- **`apps/web/src/styles.css`** (novo): `@import "tailwindcss";` + bloco `@theme`
  com tokens de cor da marca (aprox. do layout): verde `--color-brand` (~`#5bf67b`),
  fundo da página (~`#0a0d0e`), card (~`#17191b`), input (~`#6b6f70`). Tailwind v4
  usa o plugin Vite, sem `tailwind.config`/`postcss.config`.
- **`apps/web/src/main.tsx`** (substitui `main.ts`): cria root React e renderiza
  `<LoginPage />`, importando `./styles.css`.
- **`apps/web/index.html`**: `src="/src/main.tsx"` e `<title>Code Connect</title>`.
- Remover `apps/web/src/main.ts`, `apps/web/src/counter.ts`, `apps/web/src/style.css`
  (lixo do template Vite). Manter `public/` (banner-login.png, github.png, gmail.png).

## 2. Componentes (Atomic Design)

Cada componente em seu diretório com `index.tsx` + `*.test.tsx`, sob
`apps/web/src/components/`.

**atoms/**
- `Input` — input estilizado (text/password), repassa props nativas, suporta estado
  de erro (`aria-invalid`/borda).
- `Label` — label de formulário associada via `htmlFor`.
- `Button` — variante primária (verde, full-width, texto escuro, negrito), aceita
  ícone à direita (a seta "→") e `disabled`.
- `Checkbox` — checkbox estilizado com label ("Lembrar-me").
- `Link` — âncora estilizada (variantes: sublinhada / verde de destaque).

**molecules/**
- `FormField` — `Label` + `Input` + mensagem de erro. **Peça-chave de reuso**:
  serve a qualquer campo do login e do futuro cadastro.
- `Divider` — linha + texto centralizado + linha ("ou entre com outras contas").
- `SocialButton` — `<img>` (github.png / gmail.png) sobre um label, clicável
  (`alt` correto para acessibilidade/teste).

**organisms/**
- `LoginForm` — compõe os `FormField`s (Email/usuário, Senha), a linha
  Checkbox + Link "Esqueci a senha", `Button` de submit, `Divider`, os
  `SocialButton`s (Github/Gmail) e o rodapé com `Link` "Crie seu cadastro!".
  Mantém estado local (`useState`: emailOuUsuario, senha, lembrar) e **validação**:
  campos obrigatórios; se o valor contém `@`, validar formato de email; senha mínima.
  Em submit válido: `preventDefault` + placeholder (`console.log`), sem fetch.

**templates/**
- `AuthLayout` — fundo escuro da página + card centralizado em 2 colunas
  (empilha no mobile). Props: `banner` (src/alt da imagem à esquerda) e `children`
  (o formulário à direita). **Base reutilizável** para Login e Cadastro.

**pages/**
- `LoginPage` — usa `AuthLayout` com `banner="/banner-login.png"` e, à direita, o
  bloco de título ("Login" + "Boas-vindas! Faça seu login.") seguido de `<LoginForm />`.

> Reuso para Cadastro (futuro, não agora): `CadastroPage` reaproveita `AuthLayout`
> (outro banner) + um `CadastroForm` montado com os mesmos `FormField`/`Button`/
> `Divider`/`SocialButton`.

## 3. Testes (Vitest + Testing Library)

Um `*.test.tsx` por componente cobrindo render + interação essencial, por exemplo:
- `Input`/`Button`/`Checkbox`: render, valor/onChange, click/onClick, `disabled`.
- `FormField`: renderiza label e exibe mensagem de erro quando passada.
- `Divider`/`SocialButton`: render do texto/label e `alt` da imagem; click.
- `LoginForm`: mostra erros ao submeter vazio; chama o handler quando válido.
- `LoginPage`: renderiza o heading "Login" e o banner.

## Verificação

1. `pnpm --filter web test:run` — todos os testes passam.
2. `pnpm --filter web build` — `tsc` (com `jsx`) + `vite build` sem erros.
3. `pnpm web:dev` e abrir no navegador: conferir que o layout bate com o anexo
   (card centralizado, banner à esquerda, form à direita, botão verde, divisor,
   logins sociais, rodapé) e que a validação dispara ao enviar campos vazios e
   some ao preencher corretamente.
