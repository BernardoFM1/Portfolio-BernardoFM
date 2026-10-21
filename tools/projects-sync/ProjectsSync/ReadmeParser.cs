using System.Net;
using System.Text.RegularExpressions;

namespace ProjectsSync;

public static class ReadmeParser
{
    public const int MaxSummaryLength = 240;
    private const int MinSummaryWords = 3;

    private static readonly Regex HtmlComment = new(@"<!--.*?-->", RegexOptions.Singleline | RegexOptions.Compiled);
    private static readonly Regex AtxH1 = new(@"^\s{0,3}#\s+(.+?)\s*#*\s*$", RegexOptions.Compiled);
    private static readonly Regex AnyAtxHeading = new(@"^\s{0,3}#{1,6}(\s|$)", RegexOptions.Compiled);
    private static readonly Regex HtmlH1 = new(@"<h1[^>]*>(.*?)</h1>", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Compiled);
    private static readonly Regex HtmlAnyHeading = new(@"^\s*<h[1-6][^>]*>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static readonly Regex SetextH1 = new(@"^\s{0,3}=+\s*$", RegexOptions.Compiled);
    private static readonly Regex SetextH2 = new(@"^\s{0,3}-+\s*$", RegexOptions.Compiled);
    private static readonly Regex Fence = new(@"^\s{0,3}(```|~~~)", RegexOptions.Compiled);
    private static readonly Regex ListItem = new(@"^\s{0,3}([-*+]|\d+[.)])\s+", RegexOptions.Compiled);
    private static readonly Regex Rule = new(@"^\s{0,3}([-*_])(\s*\1){2,}\s*$", RegexOptions.Compiled);

    private static readonly Regex Image = new(@"!\[[^\]]*\]\([^)]*\)|!\[[^\]]*\]\[[^\]]*\]", RegexOptions.Compiled);
    private static readonly Regex Link = new(@"\[([^\]]*)\]\([^)]*\)|\[([^\]]+)\]\[[^\]]*\]", RegexOptions.Compiled);
    private static readonly Regex HtmlTag = new(@"<[^>]+>", RegexOptions.Compiled);
    private static readonly Regex Bold = new(@"(\*\*|__)(.+?)\1", RegexOptions.Compiled);
    private static readonly Regex ItalicStar = new(@"\*(.+?)\*", RegexOptions.Compiled);
    private static readonly Regex ItalicUnderscore = new(@"(?<!\w)_(.+?)_(?!\w)", RegexOptions.Compiled);
    private static readonly Regex Code = new(@"`([^`]*)`", RegexOptions.Compiled);
    private static readonly Regex Spaces = new(@"\s+", RegexOptions.Compiled);

    public static ReadmeInfo Parse(string? markdown)
    {
        if (string.IsNullOrWhiteSpace(markdown))
            return new ReadmeInfo(null, null);

        var text = HtmlComment.Replace(markdown.Replace("\r\n", "\n").Replace('\r', '\n'), "");
        var lines = text.Split('\n');

        var (title, titleEnd) = FindTitle(lines);
        var summary = FindSummary(lines, titleEnd + 1);
        return new ReadmeInfo(title, summary);
    }

    private static (string? Title, int EndIndex) FindTitle(string[] lines)
    {
        var inFence = false;
        for (var i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            if (Fence.IsMatch(line)) { inFence = !inFence; continue; }
            if (inFence) continue;

            var atx = AtxH1.Match(line);
            if (atx.Success)
            {
                var t = CleanInline(atx.Groups[1].Value);
                if (t.Length > 0) return (t, i);
                continue;
            }

            var html = HtmlH1.Match(line);
            if (html.Success)
            {
                var t = CleanInline(html.Groups[1].Value);
                if (t.Length > 0) return (t, i);
                continue;
            }

            if (i + 1 < lines.Length && SetextH1.IsMatch(lines[i + 1]) && !string.IsNullOrWhiteSpace(line))
            {
                var t = CleanInline(line);
                if (t.Length > 0) return (t, i + 1);
            }
        }
        return (null, -1);
    }

    private static string? FindSummary(string[] lines, int start)
    {
        var inFence = false;
        var paragraph = new List<string>();

        for (var i = Math.Max(start, 0); i <= lines.Length; i++)
        {
            var line = i < lines.Length ? lines[i] : "";

            if (i < lines.Length && Fence.IsMatch(line))
            {
                inFence = !inFence;
                paragraph.Clear();
                continue;
            }
            if (inFence) continue;

            var isBlank = string.IsNullOrWhiteSpace(line);
            var isHeading = AnyAtxHeading.IsMatch(line) || HtmlAnyHeading.IsMatch(line);
            var isSetextUnderline = paragraph.Count > 0 && (SetextH1.IsMatch(line) || SetextH2.IsMatch(line));

            if (isHeading || isSetextUnderline)
            {
                if (!TryBuild(paragraph, out var pending) || isSetextUnderline) return null;
                return pending;
            }

            if (!isBlank && !Rule.IsMatch(line))
            {
                paragraph.Add(line);
                continue;
            }

            if (paragraph.Count > 0)
            {
                if (TryBuild(paragraph, out var result)) return result;
                paragraph.Clear();
            }
        }
        return null;
    }

    private static bool TryBuild(List<string> block, out string? summary)
    {
        summary = null;
        if (block.Count == 0) return false;

        var first = block[0].TrimStart();
        if (ListItem.IsMatch(block[0]) || first.StartsWith('|')) { block.Clear(); return false; }

        var cleaned = CleanInline(string.Join(' ', block.Select(StripQuote)));
        block.Clear();

        var words = cleaned.Split(' ', StringSplitOptions.RemoveEmptyEntries)
                           .Count(w => w.Any(char.IsLetter));
        if (words < MinSummaryWords) return false;

        summary = Truncate(cleaned, MaxSummaryLength);
        return true;
    }

    private static string StripQuote(string line) =>
        line.TrimStart().StartsWith('>') ? line.TrimStart().TrimStart('>').Trim() : line;

    public static string CleanInline(string input)
    {
        var s = Image.Replace(input, "");
        s = Link.Replace(s, m => m.Groups[1].Success ? m.Groups[1].Value : m.Groups[2].Value);
        s = HtmlTag.Replace(s, "");
        s = Bold.Replace(s, "$2");
        s = ItalicStar.Replace(s, "$1");
        s = ItalicUnderscore.Replace(s, "$1");
        s = Code.Replace(s, "$1");
        s = WebUtility.HtmlDecode(s);
        return Spaces.Replace(s, " ").Trim();
    }

    public static string Truncate(string text, int max)
    {
        if (text.Length <= max) return text;
        var cut = text.LastIndexOf(' ', max - 1);
        if (cut < max / 2) cut = max - 1;
        return text[..cut].TrimEnd(' ', ',', ';', ':', '.', '-') + "…";
    }
}
