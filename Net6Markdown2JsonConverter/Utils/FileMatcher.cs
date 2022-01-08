using Microsoft.Extensions.FileSystemGlobbing;

namespace Net6MarkdownWebEngine.Converter;

public class FileMatcher
{
    readonly Matcher matcher = new();

    public IEnumerable<string> GetResultsInFullPath(string dirPath, string[] includePatterns, string[] excludePattersn)
    {
        // use new file globbing library
        // see https://docs.microsoft.com/ja-jp/dotnet/core/extensions/file-globbing        
        matcher.AddIncludePatterns(includePatterns);
        matcher.AddExcludePatterns(excludePattersn);
        var matchingFiles = matcher.GetResultsInFullPath(dirPath);
        return matchingFiles;
    }
}

