using ProjectsSync;
using Xunit;

namespace ProjectsSync.Tests;

public class ReadmeParserTests
{
    [Fact]
    public void Titulo_e_primeiro_paragrafo()
    {
        var r = ReadmeParser.Parse("# Minha API\n\nAPI REST para gerenciar pedidos de uma loja.\n\n## Instalação\n");
        Assert.Equal("Minha API", r.Title);
        Assert.Equal("API REST para gerenciar pedidos de uma loja.", r.Summary);
    }

    [Fact]
    public void Ignora_badges_antes_do_resumo()
    {
        var md = "# Projeto X\n\n[![Build](https://img.shields.io/x.svg)](https://ci)\n![License](https://img.shields.io/l.svg)\n\nServiço de filas para processar tarefas em segundo plano.\n";
        var r = ReadmeParser.Parse(md);
        Assert.Equal("Projeto X", r.Title);
        Assert.Equal("Serviço de filas para processar tarefas em segundo plano.", r.Summary);
    }

    [Fact]
    public void Cabecalho_em_html_centralizado()
    {
        var md = "<h1 align=\"center\">Meu Projeto</h1>\n\n<p align=\"center\">\n  <img src=\"logo.png\" width=\"120\">\n</p>\n\nUm gerador de relatórios simples e rápido.\n";
        var r = ReadmeParser.Parse(md);
        Assert.Equal("Meu Projeto", r.Title);
        Assert.Equal("Um gerador de relatórios simples e rápido.", r.Summary);
    }

    [Fact]
    public void Sem_titulo_ainda_acha_o_resumo()
    {
        var r = ReadmeParser.Parse("Apenas um parágrafo descrevendo o projeto.\n");
        Assert.Null(r.Title);
        Assert.Equal("Apenas um parágrafo descrevendo o projeto.", r.Summary);
    }

    [Fact]
    public void Outro_titulo_antes_de_paragrafo_nao_gera_resumo()
    {
        var r = ReadmeParser.Parse("# Título\n\n## Funcionalidades\n\n- item um\n");
        Assert.Equal("Título", r.Title);
        Assert.Null(r.Summary);
    }

    [Fact]
    public void Titulo_dentro_de_bloco_de_codigo_nao_conta()
    {
        var md = "```bash\n# isso não é título\nnpm install\n```\n\n# Título Real\n\nTexto de resumo com várias palavras aqui.\n";
        var r = ReadmeParser.Parse(md);
        Assert.Equal("Título Real", r.Title);
        Assert.Equal("Texto de resumo com várias palavras aqui.", r.Summary);
    }

    [Fact]
    public void Resumo_longo_e_cortado_com_reticencias()
    {
        var longo = string.Join(' ', Enumerable.Repeat("palavra", 60));
        var r = ReadmeParser.Parse($"# T\n\n{longo}\n");
        Assert.NotNull(r.Summary);
        Assert.True(r.Summary!.Length <= ReadmeParser.MaxSummaryLength);
        Assert.EndsWith("…", r.Summary);
    }

    [Fact]
    public void Remove_links_enfase_e_codigo_inline()
    {
        var r = ReadmeParser.Parse("# T\n\nUma **ferramenta** de [linha de comando](https://x.dev) para `converter` arquivos.\n");
        Assert.Equal("Uma ferramenta de linha de comando para converter arquivos.", r.Summary);
    }

    [Fact]
    public void Aceita_citacao_como_resumo()
    {
        var r = ReadmeParser.Parse("# T\n\n> Biblioteca para validar CPF e CNPJ.\n");
        Assert.Equal("Biblioteca para validar CPF e CNPJ.", r.Summary);
    }

    [Fact]
    public void Titulo_setext_e_paragrafo_de_varias_linhas()
    {
        var md = "Meu Projeto\n===========\n\nDescrição curta do projeto em duas linhas\npara testar a junção.\n";
        var r = ReadmeParser.Parse(md);
        Assert.Equal("Meu Projeto", r.Title);
        Assert.Equal("Descrição curta do projeto em duas linhas para testar a junção.", r.Summary);
    }

    [Fact]
    public void Ignora_linha_de_navegacao_entre_idiomas()
    {
        var md = "# App\n\n[English](README.en.md) | [Português](README.pt.md)\n\nAplicativo para controlar gastos mensais.\n";
        var r = ReadmeParser.Parse(md);
        Assert.Equal("Aplicativo para controlar gastos mensais.", r.Summary);
    }

    [Fact]
    public void Pula_lista_e_usa_o_paragrafo_seguinte()
    {
        var r = ReadmeParser.Parse("# T\n\n- a\n- b\n\nTexto depois da lista com várias palavras.\n");
        Assert.Equal("Texto depois da lista com várias palavras.", r.Summary);
    }

    [Fact]
    public void Ignora_comentarios_html()
    {
        var r = ReadmeParser.Parse("<!-- comentário -->\n# T\n\nResumo com palavras suficientes aqui.\n");
        Assert.Equal("T", r.Title);
        Assert.Equal("Resumo com palavras suficientes aqui.", r.Summary);
    }

    [Fact]
    public void Readme_vazio_ou_nulo()
    {
        Assert.Null(ReadmeParser.Parse(null).Title);
        Assert.Null(ReadmeParser.Parse("   \n").Summary);
    }
}
