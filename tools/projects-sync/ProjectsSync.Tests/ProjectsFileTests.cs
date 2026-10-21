using ProjectsSync;
using Xunit;

namespace ProjectsSync.Tests;

public class ProjectsFileTests
{
    private static readonly GeneratedProject Sample =
        new("conexao", "Conexão", "Descrição com acentuação.", "https://github.com/u/conexao",
            new[] { "C#" }, new[] { "api" }, "2026-10-01T12:00:00Z");

    [Fact]
    public void Serializa_com_acentos_legiveis_e_camelCase()
    {
        var json = ProjectsFile.Serialize(new[] { Sample });
        Assert.Contains("Conexão", json);
        Assert.Contains("\"pushedAt\"", json);
        Assert.EndsWith("\n", json);
    }

    [Fact]
    public void So_grava_quando_o_conteudo_muda()
    {
        var path = Path.Combine(Path.GetTempPath(), $"projects-{Guid.NewGuid():N}.json");
        try
        {
            var content = ProjectsFile.Serialize(new[] { Sample });
            Assert.True(ProjectsFile.WriteIfChanged(path, content));
            Assert.False(ProjectsFile.WriteIfChanged(path, content));
        }
        finally { File.Delete(path); }
    }
}
