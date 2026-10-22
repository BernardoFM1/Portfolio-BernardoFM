namespace ProjectsSync;

public static class ProjectBuilder
{
    public const string DefaultTopic = "portfolio";

    public static bool IsSelected(RepoSummary repo, string topic) =>
        !repo.Fork && !repo.Archived &&
        repo.Topics.Contains(topic, StringComparer.OrdinalIgnoreCase);

    public static GeneratedProject Build(
        RepoSummary repo, ReadmeInfo readme, IReadOnlyList<string> languages, string topic)
    {
        var title = !string.IsNullOrWhiteSpace(readme.Title) ? readme.Title! : Humanize(repo.Name);

        var summary = !string.IsNullOrWhiteSpace(readme.Summary)
            ? readme.Summary!
            : (repo.Description is { } d ? ReadmeParser.Truncate(ReadmeParser.CleanInline(d), ReadmeParser.MaxSummaryLength) : "");

        var topics = repo.Topics
            .Where(t => !t.Equals(topic, StringComparison.OrdinalIgnoreCase))
            .OrderBy(t => t, StringComparer.Ordinal)
            .ToList();

        var effectiveLanguages = languages.Count > 0
            ? languages
            : topics.Select(FormatTechnology).Where(t => !string.IsNullOrEmpty(t)).ToList();

        return new GeneratedProject(repo.Name, title, summary, repo.HtmlUrl, effectiveLanguages, topics, repo.PushedAt);
    }

    public static string Humanize(string slug)
    {
        var s = slug.Replace('-', ' ').Replace('_', ' ').Trim();
        return s.Length == 0 ? slug : char.ToUpperInvariant(s[0]) + s[1..];
    }

    public static List<GeneratedProject> Sort(IEnumerable<GeneratedProject> items) =>
        items.OrderByDescending(p => p.PushedAt, StringComparer.Ordinal)
             .ThenBy(p => p.Slug, StringComparer.Ordinal)
             .ToList();

    private static readonly Dictionary<string, string> KnownTechnologies = new(StringComparer.OrdinalIgnoreCase)
    {
        ["csharp"] = "C#",
        ["cs"] = "C#",
        ["dotnet"] = ".NET",
        ["dotnetcore"] = ".NET",
        ["dotnet-core"] = ".NET",
        ["aspnet"] = "ASP.NET",
        ["aspnetcore"] = "ASP.NET Core",
        ["aspnet-core"] = "ASP.NET Core",
        ["efcore"] = "EF Core",
        ["entity-framework"] = "Entity Framework",
        ["blazor"] = "Blazor",
        ["maui"] = ".NET MAUI",
        ["wpf"] = "WPF",
        ["typescript"] = "TypeScript",
        ["ts"] = "TypeScript",
        ["javascript"] = "JavaScript",
        ["js"] = "JavaScript",
        ["node"] = "Node.js",
        ["nodejs"] = "Node.js",
        ["react"] = "React",
        ["reactjs"] = "React",
        ["angular"] = "Angular",
        ["vue"] = "Vue.js",
        ["vuejs"] = "Vue.js",
        ["nextjs"] = "Next.js",
        ["next"] = "Next.js",
        ["nestjs"] = "NestJS",
        ["express"] = "Express",
        ["expressjs"] = "Express",
        ["python"] = "Python",
        ["django"] = "Django",
        ["fastapi"] = "FastAPI",
        ["flask"] = "Flask",
        ["html"] = "HTML",
        ["html5"] = "HTML5",
        ["css"] = "CSS",
        ["css3"] = "CSS3",
        ["sass"] = "Sass",
        ["scss"] = "Sass",
        ["tailwind"] = "Tailwind CSS",
        ["tailwindcss"] = "Tailwind CSS",
        ["bootstrap"] = "Bootstrap",
        ["sql"] = "SQL",
        ["postgresql"] = "PostgreSQL",
        ["postgres"] = "PostgreSQL",
        ["mysql"] = "MySQL",
        ["sqlite"] = "SQLite",
        ["sqlserver"] = "SQL Server",
        ["sql-server"] = "SQL Server",
        ["mssql"] = "SQL Server",
        ["mongodb"] = "MongoDB",
        ["mongo"] = "MongoDB",
        ["redis"] = "Redis",
        ["graphql"] = "GraphQL",
        ["docker"] = "Docker",
        ["kubernetes"] = "Kubernetes",
        ["k8s"] = "Kubernetes",
        ["aws"] = "AWS",
        ["azure"] = "Azure",
        ["gcp"] = "GCP",
        ["linux"] = "Linux",
        ["rabbitmq"] = "RabbitMQ",
        ["kafka"] = "Kafka",
        ["git"] = "Git",
        ["github-actions"] = "GitHub Actions",
        ["api"] = "REST API",
        ["rest"] = "REST API",
        ["rest-api"] = "REST API",
        ["grpc"] = "gRPC",
        ["golang"] = "Go",
        ["go"] = "Go",
        ["rust"] = "Rust",
        ["java"] = "Java",
        ["kotlin"] = "Kotlin",
        ["swift"] = "Swift",
        ["php"] = "PHP",
        ["ruby"] = "Ruby",
        ["cpp"] = "C++",
        ["cplusplus"] = "C++",
        ["dart"] = "Dart",
        ["flutter"] = "Flutter"
    };

    public static string FormatTechnology(string topic)
    {
        if (string.IsNullOrWhiteSpace(topic)) return "";
        var trimmed = topic.Trim();
        if (KnownTechnologies.TryGetValue(trimmed, out var known))
            return known;

        var words = trimmed.Replace('-', ' ').Replace('_', ' ')
            .Split(' ', StringSplitOptions.RemoveEmptyEntries);

        return string.Join(" ", words.Select(w =>
            w.Length switch
            {
                0 => "",
                1 => char.ToUpperInvariant(w[0]).ToString(),
                _ => char.ToUpperInvariant(w[0]) + w[1..]
            }));
    }
}
