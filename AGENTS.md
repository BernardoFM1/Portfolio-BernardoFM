Briefing do front-end — Portfólio
Contexto e regras para o agente que vai construir a interface. 20 de outubro de 2026.
1. O projeto
Portfólio pessoal de um desenvolvedor back-end (C# e ASP.NET Core). O dono não quer cuidar do front-end: ele dirige e revisa, e você implementa. O objetivo é um site autêntico, sem cara de template genérico de IA.
• Framework: Angular, na versão estável atual. Confira a documentação oficial antes de escolher padrões.
• Saída: site estático (sem SSR e sem funções de servidor). O build gera arquivos HTML, CSS e JS.
• Hospedagem: Vercel, plano Hobby, endereço *.vercel.app. Cada push na main publica e cada Pull Request gera uma prévia. Não é preciso criar workflow de deploy.
• Idiomas do site: português e inglês, apenas.
2. Referências visuais
Há duas telas desenhadas, anexas a este briefing: Home no computador (1280 px) e Home no celular (390 px). Elas definem layout, hierarquia e estados. Todo texto dentro de colchetes, como [Seu nome], é um espaço reservado e não deve virar texto fixo no código.
Estrutura da Home
1. Cabeçalho: nome à esquerda; no computador, links (Projetos, GitHub, Contato); seletor de idioma PT | EN.
2. Apresentação: foto de perfil em círculo, nome, uma linha com a stack e um parágrafo curto. No celular, a foto fica ao lado do nome e o texto abaixo.
3. Projetos: carrossel com um projeto em destaque ao centro. Os vizinhos (anterior e próximo) aparecem menores e em cinza. No celular, os vizinhos aparecem só como uma pontinha nas bordas.
4. Controles do carrossel: setas, pontinhos (só no computador) e contador, por exemplo 2 / 6.
3. Tokens de design
Token
Valor
Uso
--bg
#141517
Fundo da página
--surface
#1C1E21
Cards
--border
#2E3035
Borda dos cards vizinhos
--border-strong
#5A564D
Botões e foto reservada
--text
#ECE8DF
Títulos e links
--text-muted
#A8A399
Descrições e rótulos
--text-dim
#8F8A80
Texto dos cards vizinhos (cinza)
--accent
#E8A33D
Destaque, hover, borda do card ativo
Fonte de texto
IBM Plex Sans (400 e 600)
Corpo e títulos
Fonte técnica
IBM Plex Mono (400 e 500)
Rótulos, stack, contador
Raio
12 px (cards), 8 px (botões)

Implemente como variáveis CSS. Nenhuma cor fica solta nos componentes.
4. Componentes
• Header e LanguageToggle (dois botões com aria-pressed; muda o atributo lang do documento).
• ProfileHero: foto, nome, stack e apresentação.
• ProjectCarousel: controla o índice ativo e a navegação.
• ProjectCard em duas variantes: destaque (grande, borda --accent, título, resumo, stack, links "Ver no GitHub" e "Ler README") e vizinho (menor, cinza, só título e um trecho do resumo).
Comportamento do carrossel
• Navega pelas setas, pelo teclado (← e →) e clicando em um vizinho. No celular, também por gesto de arrastar.
• Sem loop: no primeiro projeto não há vizinho à esquerda, e no último não há à direita.
• Transição curta e discreta. Respeite prefers-reduced-motion.
• Com poucos projetos, os vizinhos que faltam simplesmente não aparecem.
5. Conteúdo e dados
O site não tem texto de projeto escrito à mão. Tudo vem de dois arquivos JSON na pasta de conteúdo, lidos em tempo de build. Não faça chamadas à API do GitHub no navegador.
• projects.generated.json: gerado por um robô do dono (fora do seu escopo). Cada item tem slug, title (primeiro título do README), summary (primeiro parágrafo do README), url, languages, topics e pushedAt. Nunca edite este arquivo.
• projects.overrides.json: mantido pelo dono. Cada item tem slug, priority (número, opcional) e hidden (booleano, opcional). Não contém texto.
Regra de ordenação: projetos com priority vêm primeiro, em ordem crescente. Os demais vêm depois, do pushedAt mais recente para o mais antigo. Itens com hidden: true não aparecem.
Crie arquivos de exemplo com poucos itens para desenvolver o carrossel. Os exemplos devem usar espaços reservados claros, como [Nome do projeto 1], e nunca texto inventado que pareça real.
Idiomas
• Os textos da interface (menus, rótulos, botões) ficam em dois arquivos de tradução, um para pt e outro para en.
• Os READMEs dos projetos estão majoritariamente em português. No site em inglês, o conteúdo dos projetos continua em português, com uma indicação discreta de que ele está em português.
6. Regras de autenticidade
• Nada de gradientes roxos, emojis em títulos, glassmorphism, sombras exageradas ou animações em tudo.
• Nada de lorem ipsum, estatísticas inventadas ou frases como "apaixonado por tecnologia".
• Não escreva textos de conteúdo. Se faltar um texto, deixe um espaço reservado entre colchetes e avise.
• Não adicione bibliotecas de UI ou de animação sem perguntar antes.
7. Acessibilidade
• Use elementos reais (button, a, nav, h1 a h3), nunca div com clique.
• Botões só com ícone têm aria-label.
• Contraste de texto mínimo de 4,5:1. O cinza dos cards vizinhos já foi escolhido para passar nesse limite.
• Alvos de toque de pelo menos 44 px.
• Todo o carrossel funciona só com teclado, e o foco visível usa --accent.
8. Como trabalhar
Trabalhe em fatias pequenas, uma por Pull Request, para o dono revisar com a prévia da Vercel:
1. Projeto Angular, tokens como variáveis CSS, fontes e esqueleto da página.
2. Cabeçalho, seletor de idioma e arquivos de tradução.
3. Apresentação (foto, nome, stack, texto).
4. Carrossel com dados de exemplo.
5. Responsividade (computador e celular, conforme as telas).
6. Leitura dos dois JSONs reais e regra de ordenação.
Explique brevemente cada decisão técnica relevante, porque o dono é desenvolvedor e vai revisar o código. Em caso de dúvida de design ou conteúdo, pergunte em vez de decidir sozinho.
9. Fora do seu escopo
• O robô que gera projects.generated.json (GitHub Actions) e a lógica de seleção por tópico portfolio.
• Qualquer configuração de infraestrutura, domínio ou servidor.
• A escrita dos textos do site, da apresentação e dos READMEs.