namespace ProjectsSync;

public sealed record GeneratedProject(
    string Slug,
    string Title,
    string Summary,
    string Url,
    IReadOnlyList<string> Languages,
    IReadOnlyList<string> Topics,
    string PushedAt);

public sealed record ReadmeInfo(string? Title, string? Summary);
