namespace ProjectsSync;

/// <summary>Regras de seleção e montagem dos itens de projects.generated.json.</summary>
public static class ProjectBuilder
{
    /// <summary>Tópico que marca um repositório para entrar no portfólio.</summary>
    public const string DefaultTopic = "portfolio";

    public static bool IsSelected(RepoSummary repo, string topic) =>
        !repo.Fork && !repo.Archived &&
        repo.Topics.Contains(topic, StringComparer.OrdinalIgnoreCase);

    public static GeneratedProject Build(
        RepoSummary repo, ReadmeInfo readme, IReadOnlyList<string> languages, string topic)
    {
        var title = !string.IsNullOrWhiteSpace(readme.Title) ? readme.Title! : Humanize(repo.Name);

        // Plano B do resumo: descrição do campo "About" do GitHub.
        var summary = !string.IsNullOrWhiteSpace(readme.Summary)
            ? readme.Summary!
            : (repo.Description is { } d ? ReadmeParser.Truncate(ReadmeParser.CleanInline(d), ReadmeParser.MaxSummaryLength) : "");

        var topics = repo.Topics
            .Where(t => !t.Equals(topic, StringComparison.OrdinalIgnoreCase))
            .OrderBy(t => t, StringComparer.Ordinal)
            .ToList();

        return new GeneratedProject(repo.Name, title, summary, repo.HtmlUrl, languages, topics, repo.PushedAt);
    }

    /// <summary>"api-pedidos_v2" vira "Api pedidos v2".</summary>
    public static string Humanize(string slug)
    {
        var s = slug.Replace('-', ' ').Replace('_', ' ').Trim();
        return s.Length == 0 ? slug : char.ToUpperInvariant(s[0]) + s[1..];
    }

    /// <summary>Ordem estável: mais recente primeiro; empate resolvido pelo slug.</summary>
    public static List<GeneratedProject> Sort(IEnumerable<GeneratedProject> items) =>
        items.OrderByDescending(p => p.PushedAt, StringComparer.Ordinal)
             .ThenBy(p => p.Slug, StringComparer.Ordinal)
             .ToList();
}
