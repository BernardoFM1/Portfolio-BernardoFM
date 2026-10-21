namespace ProjectsSync;

/// <summary>Um item de projects.generated.json. Nunca editado à mão.</summary>
public sealed record GeneratedProject(
    string Slug,
    string Title,
    string Summary,
    string Url,
    IReadOnlyList<string> Languages,
    IReadOnlyList<string> Topics,
    string PushedAt);

/// <summary>Título e resumo extraídos de um README. Null = não encontrado.</summary>
public sealed record ReadmeInfo(string? Title, string? Summary);
