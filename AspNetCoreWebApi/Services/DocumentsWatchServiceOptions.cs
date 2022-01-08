namespace Net6MarkdownWebEngine.Backend.Services;

public class DocumentsWatchServiceOptions
{
    public const string DocumentsWatchService = "DocumentsWatchService";
    public string? InputDir { get; set; }
    public string? OutputDir { get; set; }
    public string? IndexDir { get; set; }
}

