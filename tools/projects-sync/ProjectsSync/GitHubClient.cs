using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace ProjectsSync;

public sealed record RepoSummary(
    string Name,
    string? Description,
    string HtmlUrl,
    bool Fork,
    bool Archived,
    IReadOnlyList<string> Topics,
    string PushedAt);

/// <summary>Cliente mínimo da API REST do GitHub (só o que o robô usa).</summary>
public sealed class GitHubClient : IDisposable
{
    private readonly HttpClient _http;

    public GitHubClient(string? token)
    {
        _http = new HttpClient { BaseAddress = new Uri("https://api.github.com/") };
        _http.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("projects-sync", "1.0"));
        _http.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2022-11-28");
        if (!string.IsNullOrWhiteSpace(token))
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    /// <summary>Lista os repositórios públicos do usuário, com paginação.</summary>
    public async Task<List<RepoSummary>> ListPublicReposAsync(string user, CancellationToken ct)
    {
        const int perPage = 100;
        var all = new List<RepoSummary>();

        for (var page = 1; ; page++)
        {
            var url = $"users/{Uri.EscapeDataString(user)}/repos?type=owner&per_page={perPage}&page={page}";
            using var doc = await GetJsonAsync(url, ct) ?? throw new InvalidOperationException($"Usuário não encontrado: {user}");

            var count = 0;
            foreach (var r in doc.RootElement.EnumerateArray())
            {
                count++;
                all.Add(new RepoSummary(
                    Name: r.GetProperty("name").GetString()!,
                    Description: r.TryGetProperty("description", out var d) ? d.GetString() : null,
                    HtmlUrl: r.GetProperty("html_url").GetString()!,
                    Fork: r.GetProperty("fork").GetBoolean(),
                    Archived: r.GetProperty("archived").GetBoolean(),
                    Topics: r.TryGetProperty("topics", out var t)
                        ? t.EnumerateArray().Select(x => x.GetString()!).ToList()
                        : new List<string>(),
                    PushedAt: r.TryGetProperty("pushed_at", out var p) && p.ValueKind == JsonValueKind.String
                        ? p.GetString()! : ""));
            }
            if (count < perPage) break;
        }
        return all;
    }

    /// <summary>Linguagens do repositório, da mais usada para a menos usada.</summary>
    public async Task<List<string>> GetLanguagesAsync(string owner, string repo, CancellationToken ct)
    {
        using var doc = await GetJsonAsync($"repos/{owner}/{repo}/languages", ct);
        if (doc is null) return new List<string>();
        return doc.RootElement.EnumerateObject()
            .OrderByDescending(p => p.Value.GetInt64())
            .ThenBy(p => p.Name, StringComparer.Ordinal)
            .Select(p => p.Name)
            .ToList();
    }

    /// <summary>README em texto puro, ou null se o repositório não tem README.</summary>
    public async Task<string?> GetReadmeAsync(string owner, string repo, CancellationToken ct)
    {
        using var req = new HttpRequestMessage(HttpMethod.Get, $"repos/{owner}/{repo}/readme");
        req.Headers.Accept.ParseAdd("application/vnd.github.raw+json");
        using var res = await _http.SendAsync(req, ct);
        if (res.StatusCode == HttpStatusCode.NotFound) return null;
        await EnsureSuccessAsync(res, ct);
        return await res.Content.ReadAsStringAsync(ct);
    }

    private async Task<JsonDocument?> GetJsonAsync(string url, CancellationToken ct)
    {
        using var req = new HttpRequestMessage(HttpMethod.Get, url);
        req.Headers.Accept.ParseAdd("application/vnd.github+json");
        using var res = await _http.SendAsync(req, ct);
        if (res.StatusCode == HttpStatusCode.NotFound) return null;
        await EnsureSuccessAsync(res, ct);
        return await JsonDocument.ParseAsync(await res.Content.ReadAsStreamAsync(ct), cancellationToken: ct);
    }

    private static async Task EnsureSuccessAsync(HttpResponseMessage res, CancellationToken ct)
    {
        if (res.IsSuccessStatusCode) return;
        var body = await res.Content.ReadAsStringAsync(ct);
        var hint = res.StatusCode is HttpStatusCode.Forbidden or HttpStatusCode.TooManyRequests
            ? " (limite de requisições? defina GITHUB_TOKEN)"
            : "";
        throw new HttpRequestException($"GitHub respondeu {(int)res.StatusCode} em {res.RequestMessage?.RequestUri}{hint}: {body}");
    }

    public void Dispose() => _http.Dispose();
}
