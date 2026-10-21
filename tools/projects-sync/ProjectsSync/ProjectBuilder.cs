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

        return new GeneratedProject(repo.Name, title, summary, repo.HtmlUrl, languages, topics, repo.PushedAt);
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
}
