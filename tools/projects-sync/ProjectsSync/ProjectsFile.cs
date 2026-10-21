using System.Text.Encodings.Web;
using System.Text.Json;

namespace ProjectsSync;

public static class ProjectsFile
{
    private static readonly JsonSerializerOptions Options = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
    };

    public static string Serialize(IReadOnlyList<GeneratedProject> projects) =>
        JsonSerializer.Serialize(projects, Options).Replace("\r\n", "\n") + "\n";

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
