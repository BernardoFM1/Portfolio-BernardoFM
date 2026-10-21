using ProjectsSync;
using Xunit;

namespace ProjectsSync.Tests;

public class ProjectBuilderTests
{
    private static RepoSummary Repo(
        string name = "api-pedidos", string? description = null, bool fork = false,
        bool archived = false, params string[] topics) =>
        new(name, description, $"https://github.com/u/{name}", fork, archived, topics, "2026-10-01T12:00:00Z");

    [Fact]
    public void Seleciona_so_repos_com_o_topico()
    {
        Assert.True(ProjectBuilder.IsSelected(Repo(topics: new[] { "portfolio" }), "portfolio"));
        Assert.True(ProjectBuilder.IsSelected(Repo(topics: new[] { "Portfolio" }), "portfolio"));
        Assert.False(ProjectBuilder.IsSelected(Repo(topics: new[] { "csharp" }), "portfolio"));
    }

    [Fact]
    public void Descarta_forks_e_arquivados()
    {
        Assert.False(ProjectBuilder.IsSelected(Repo(fork: true, topics: new[] { "portfolio" }), "portfolio"));
        Assert.False(ProjectBuilder.IsSelected(Repo(archived: true, topics: new[] { "portfolio" }), "portfolio"));
    }

    [Fact]
    public void Sem_titulo_no_readme_usa_o_nome_do_repo()
    {
        var p = ProjectBuilder.Build(Repo(), new ReadmeInfo(null, "Resumo."), new[] { "C#" }, "portfolio");
        Assert.Equal("Api pedidos", p.Title);
    }

    [Fact]
    public void Sem_resumo_no_readme_usa_a_descricao_about()
    {
        var p = ProjectBuilder.Build(Repo(description: "Descrição do **GitHub**"), new ReadmeInfo("T", null), new string[0], "portfolio");
        Assert.Equal("Descrição do GitHub", p.Summary);
    }

    [Fact]
    public void Sem_nenhuma_fonte_o_resumo_fica_vazio()
    {
        var p = ProjectBuilder.Build(Repo(), new ReadmeInfo("T", null), new string[0], "portfolio");
        Assert.Equal("", p.Summary);
    }

    [Fact]
    public void Topicos_nao_incluem_o_marcador()
    {
        var p = ProjectBuilder.Build(Repo(topics: new[] { "portfolio", "csharp", "api" }), new ReadmeInfo("T", "R"), new string[0], "portfolio");
        Assert.Equal("api,csharp", string.Join(",", p.Topics));
    }

    [Fact]
    public void Ordena_do_mais_recente_para_o_mais_antigo()
    {
        var a = new GeneratedProject("a", "A", "", "u", new string[0], new string[0], "2026-01-01T00:00:00Z");
        var b = new GeneratedProject("b", "B", "", "u", new string[0], new string[0], "2026-06-01T00:00:00Z");
        var sorted = ProjectBuilder.Sort(new[] { a, b });
        Assert.Equal("b", sorted[0].Slug);
    }
}
