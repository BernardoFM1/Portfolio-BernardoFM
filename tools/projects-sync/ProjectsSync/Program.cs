using ProjectsSync;

var options = ParseArgs(args);
if (!options.TryGetValue("user", out var user) || !options.TryGetValue("out", out var outPath))
{
    Console.Error.WriteLine("Uso: --user <usuario-github> --out <caminho/projects.generated.json> [--topic portfolio]");
    return 2;
}
var topic = options.GetValueOrDefault("topic", ProjectBuilder.DefaultTopic);
var token = Environment.GetEnvironmentVariable("GITHUB_TOKEN");

using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(5));
using var github = new GitHubClient(token);

try
{
    var repos = await github.ListPublicReposAsync(user, cts.Token);
    var selected = repos.Where(r => ProjectBuilder.IsSelected(r, topic)).ToList();
    Console.WriteLine($"{repos.Count} repositórios públicos, {selected.Count} com o tópico '{topic}'.");

    var projects = new List<GeneratedProject>();
    foreach (var repo in selected)
    {
        var readmeText = await github.GetReadmeAsync(user, repo.Name, cts.Token);
        var readme = ReadmeParser.Parse(readmeText);
        var languages = await github.GetLanguagesAsync(user, repo.Name, cts.Token);
        var project = ProjectBuilder.Build(repo, readme, languages, topic);
        projects.Add(project);

        if (string.IsNullOrWhiteSpace(project.Summary))
            Console.WriteLine($"  aviso: '{repo.Name}' ficou sem resumo (README sem parágrafo e sem descrição About).");
    }

    var content = ProjectsFile.Serialize(ProjectBuilder.Sort(projects));
    var changed = ProjectsFile.WriteIfChanged(outPath, content);
    Console.WriteLine(changed ? $"Atualizado: {outPath}" : "Sem mudanças.");
    return 0;
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Erro: {ex.Message}");
    return 1;
}

static Dictionary<string, string> ParseArgs(string[] args)
{
    var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
    for (var i = 0; i < args.Length - 1; i++)
        if (args[i].StartsWith("--")) map[args[i][2..]] = args[++i];
    return map;
}
