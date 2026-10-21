# Portfolio — Bernardo Fernando

Portfólio pessoal de desenvolvedor back-end (C# e ASP.NET Core), construído em Angular estático (Standalone Components e Signals), vanilla CSS com Design Tokens e suporte a dois idiomas (Português e Inglês).

## 🚀 Tecnologias

- **Front-end:** Angular (Standalone Components, Signals)
- **Estilização:** CSS puro com Design System baseado em tokens (`--bg`, `--surface`, `--accent`, etc.)
- **Tipografia:** IBM Plex Sans & IBM Plex Mono
- **Testes Unitários:** Vitest
- **Sincronização de Projetos:** Utilitário C# / .NET 8 (`tools/projects-sync`) automatizado via GitHub Actions para listar repositórios públicos com o tópico `portfolio`

## 🛠️ Como Executar

### Instalar dependências
```bash
npm install
```

### Iniciar servidor de desenvolvimento
```bash
npm start
```
Acesse `http://localhost:4200/` no navegador.

### Executar testes unitários
```bash
npm test
```

### Testar robô de sincronização (.NET)
```bash
dotnet test tools/projects-sync/ProjectsSync.sln --nologo
```

### Gerar build de produção (Vercel)
```bash
npm run build
```
Os arquivos gerados para hospedagem estática são salvos em `dist/portfolio/browser`.
