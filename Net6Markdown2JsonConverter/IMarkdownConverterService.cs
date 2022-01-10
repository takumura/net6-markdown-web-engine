namespace Net6MarkdownWebEngine.Converter;

public interface IMarkdownConverterService
{
    ValueTask RunAsync(CommandLineOptions options);
    ValueTask ConvertAsync(string? input, string? output, string? indexDir, DateTime? dateFrom = null);
}

