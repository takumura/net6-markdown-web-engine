using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Logging;

namespace Net6MarkdownWebEngine.Converter;

public class FileManager
{
    readonly MarkdownConverter converter;
    readonly FileMatcher matcher;
    readonly ILogger logger;
    readonly int fileStreamBufferSize = 4096;
    readonly int dop = 3;

    public FileManager(ILogger<MarkdownConverterService> _logger)
    {
        converter = new MarkdownConverter();
        matcher = new FileMatcher();
        logger = _logger;
    }

    public async ValueTask CreateAddedFilesAsync(IEnumerable<FileConversionModel> addFiles)
    {
        try
        {
            var fileCount = addFiles.Count();
            if (fileCount == 0)
            {
                logger.LogInformation("No target files found to add");
                return;
            }

            logger.LogInformation("{FileCount} target files found to add", fileCount);
            ParallelOptions parallelOptions = new() { MaxDegreeOfParallelism = dop };
            await Parallel.ForEachAsync(addFiles, parallelOptions, async (file, token) =>
            {
                token.ThrowIfCancellationRequested();

                var fileText = await ReadToEndFileAsync(file);

                var jsonText = converter.ConvertMarkDownTextToJson(fileText);
                if (string.IsNullOrEmpty(jsonText)) return;

                await WriteJsonFileAsync(jsonText, file.JsonFilePath).ConfigureAwait(false);
            });
        }
        catch (OperationCanceledException e)
        {
            logger.LogInformation("{Exception} thrown with message: {Message}", nameof(OperationCanceledException), e.Message);
        }
        catch (Exception)
        {
            throw;
        }
    }

    public IEnumerable<FileComparisonModel> GenerateFileComparisonModels(IEnumerable<string> files, string fromDir)
    {
        var result = new List<FileComparisonModel>();
        foreach (var fullPath in files)
        {
            result.Add(new FileComparisonModel()
            {
                FullPath = fullPath,
                DirectoryFrom = fromDir,
                RelativePath = Path.GetDirectoryName(Path.GetRelativePath(fromDir, fullPath)) ?? "",
                FileName = Path.GetFileNameWithoutExtension(fullPath)
            });
        }
        return result;
    }

    public IEnumerable<FileConversionModel> GenerateFileConversionModels(
        IEnumerable<FileComparisonModel> currentFileComparisonModels,
        IEnumerable<FileComparisonModel> updatedFileComparisonModels,
        string outputDir,
        DateTime? dateFrom)
    {
        var result = new List<FileConversionModel>();

        // check from current items
        // if filename is NOT found with same relative path, it will be "Deleted"
        // if same filename found with same relative path, it will be "NotChanged" or "Updated"
        foreach (var jsonFile in currentFileComparisonModels)
        {
            if (updatedFileComparisonModels.Any(mdFile => mdFile.RelativePath == jsonFile.RelativePath && mdFile.FileName == jsonFile.FileName))
            {
                // do nothing as this scenario has been already covered by previous "current -> updated" check
            }
            else
            {
                result.Add(new FileConversionModel()
                {
                    FileName = jsonFile.FileName,
                    OutputDir = outputDir,
                    RelativePath = jsonFile.RelativePath,
                    Status = FileConversionModelStatusEnum.Deleted,
                });
            }
        }

        // check from updates.
        // if filename is NOT found with same relative path, it will be "Added"
        // if same filename found with same relative path, it will be "NotChanged" or "Updated"
        foreach (var mdFile in updatedFileComparisonModels)
        {
            if (currentFileComparisonModels.Any(x => x.RelativePath == mdFile.RelativePath && x.FileName == mdFile.FileName))
            {
                if (dateFrom.HasValue && File.GetLastWriteTime(mdFile.FullPath) < dateFrom) continue;

                result.Add(new FileConversionModel()
                {
                    FileName = mdFile.FileName,
                    OutputDir = outputDir,
                    RelativePath = mdFile.RelativePath,
                    Status = FileConversionModelStatusEnum.Confirming, // to be confirmed on later step, by comparing hash value
                    MdFilePath = mdFile.FullPath,
                });
            }
            else
            {
                result.Add(new FileConversionModel()
                {
                    FileName = mdFile.FileName,
                    OutputDir = outputDir,
                    RelativePath = mdFile.RelativePath,
                    Status = FileConversionModelStatusEnum.Added,
                    MdFilePath = mdFile.FullPath,
                });
            }
        }

        return result;
    }

    public async ValueTask UpdateJsonFileIfRequired(IEnumerable<FileConversionModel> targetFiles)
    {
        try
        {
            var fileCount = targetFiles.Count();
            if (fileCount == 0)
            {
                logger.LogInformation("No target files found to check updates");
                return;
            }

            logger.LogInformation("{FileCount} target files found to check updates", fileCount);
            ParallelOptions parallelOptions = new() { MaxDegreeOfParallelism = dop };
            await Parallel.ForEachAsync(targetFiles, parallelOptions, async (file, token) =>
            {
                token.ThrowIfCancellationRequested();

                var fileText = await ReadToEndFileAsync(file).ConfigureAwait(false);

                // convert markdown file to json
                var jsonText = converter.ConvertMarkDownTextToJson(fileText);
                if (string.IsNullOrEmpty(jsonText)) return;

                // get new json hash
                var newHash = GetSha1Hash(jsonText);

                // get original json hash
                var originalHash = await GetSha1HashFromFile(file.JsonFilePath).ConfigureAwait(false);

                // if hash is different, write new json file to destination folder
                if (newHash != originalHash)
                {
                    await WriteJsonFileAsync(jsonText, file.JsonFilePath).ConfigureAwait(false);
                }
            });
        }
        catch (OperationCanceledException e)
        {
            logger.LogInformation("{Exception} thrown with message: {Message}", nameof(OperationCanceledException), e.Message);
        }
        catch (Exception)
        {
            throw;
        }
    }

    public IEnumerable<string> GetCurrentItemsFromDestination(string destinationDirectory)
    {
        // destination folder will possibly not exist for initial conversion
        if (!Directory.Exists(destinationDirectory))
        {
            logger.LogTrace($"create new directory: {destinationDirectory}");
            Directory.CreateDirectory(destinationDirectory);
        }

        logger.LogInformation("target destination directory: {Directory}", destinationDirectory);
        var includePatterns = new[] { "**/*.json" };
        var excludePatterns = new[] { "tmp/*", "temp/*", "index.json" };
        return matcher.GetResultsInFullPath(destinationDirectory, includePatterns, excludePatterns);
    }

    public IEnumerable<string> GetUpdatesFromSource(string source)
    {
        var result = new List<string>();
        if (File.Exists(source))
        {
            logger.LogInformation("target source file: {File}", source);
            result.Add(source);
        }
        else if (Directory.Exists(source))
        {
            logger.LogInformation("target source directory: {Directory}", source);
            var includePatterns = new[] { "**/*.md" };
            var excludePatterns = new[] { "tmp/*", "temp/*", "**/_*.md" };
            return matcher.GetResultsInFullPath(source, includePatterns, excludePatterns);
        }

        return result;
    }

    public void RemoveDeletedFilesFromOutputDir(IEnumerable<FileConversionModel> removeFiles)
    {
        try
        {
            var fileCount = removeFiles.Count();
            if (fileCount == 0)
            {
                logger.LogInformation("No target files found to delete");
                return;
            }

            logger.LogInformation("{FileCount} target files found to delete", fileCount);
            var files = removeFiles.Select(x => new FileInfo(x.JsonFilePath));
            Parallel.ForEach(files, file =>
            {
                logger.LogTrace($"delete file: {file.FullName}");
                file.Delete();
            });
        }
        catch (Exception)
        {
            throw;
        }
    }

    private string GetSha1Hash(string source)
    {
        var byteSource = Encoding.UTF8.GetBytes(source);
        HashAlgorithm sha = SHA1.Create();
        var hash = BitConverter.ToString(sha.ComputeHash(byteSource));
        return hash.Replace("-", "");
    }

    private async ValueTask<string> GetSha1HashFromFile(string jsonFilePath)
    {
        using var fileStream = new FileStream(jsonFilePath, FileMode.Open, FileAccess.Read, FileShare.Read, fileStreamBufferSize, FileOptions.Asynchronous);

        HashAlgorithm sha = SHA1.Create();
        var hashByte = await sha.ComputeHashAsync(fileStream).ConfigureAwait(false);
        var hash = BitConverter.ToString(hashByte);
        return hash.Replace("-", "");
    }

    private async ValueTask<string> ReadToEndFileAsync(FileConversionModel file)
    {
        logger.LogTrace($"read file: {file.MdFilePath}");
        var result = string.Empty;
        using (var fileStream = new FileStream(file.MdFilePath, FileMode.Open, FileAccess.Read, FileShare.Read, fileStreamBufferSize, FileOptions.Asynchronous))
        using (var streamReader = new StreamReader(fileStream, Encoding.UTF8))
        {
            result = await streamReader.ReadToEndAsync().ConfigureAwait(false);
        }

        return result;
    }

    private async ValueTask WriteJsonFileAsync(string jsonText, string jsonFilePath)
    {
        logger.LogTrace($"write file: {jsonFilePath}");

        var targetFolder = Path.GetDirectoryName(jsonFilePath) ?? "";
        if (!Directory.Exists(targetFolder)) Directory.CreateDirectory(targetFolder);

        using var fileStream = new FileStream(jsonFilePath, FileMode.Create, FileAccess.Write, FileShare.Write, fileStreamBufferSize, FileOptions.Asynchronous);
        using var streamWriter = new StreamWriter(fileStream);
        await streamWriter.WriteAsync(jsonText).ConfigureAwait(false);
    }
}

