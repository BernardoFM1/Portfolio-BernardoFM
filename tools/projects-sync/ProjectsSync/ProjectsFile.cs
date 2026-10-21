using System.Text.Encodings.Web;
using System.Text.Json;

namespace ProjectsSync;

/// <summary>Serialização estável do JSON, para o diff do PR só mostrar mudanças reais.</summary>
public static class ProjectsFile
{
    private static readonly JsonSerializerOptions Options = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        // Mantém acentos legíveis (ç, ã) em vez de \u00E7.
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
    };

    public static string Serialize(IReadOnlyList<GeneratedProject> projects) =>
        JsonSerializer.Serialize(projects, Options).Replace("\r\n", "\n") + "\n";

    /// <summary>Grava só se o conteúdo mudou. Devolve true se gravou.</summary>
    public static bool WriteIfChanged(string path, string content)
    {
        if (File.Exists(path) && File.ReadAllText(path).Replace("\r\n", "\n") == content)
            return false;

        var dir = Path.GetDirectoryName(Path.GetFullPath(path));
        if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);
        File.WriteAllText(path, content);
        return true;
    }
}
