using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Net6MarkdownWebEngine.Converter;

namespace Net6MarkdownWebEngine.Backend.Services;

public class DocumentsWatchService : BackgroundService
{
    readonly ILogger<DocumentsWatchService> logger;
    readonly IOptions<DocumentsWatchServiceOptions> options;
    readonly IMarkdownConverterService service;

    public DocumentsWatchService(
        ILogger<DocumentsWatchService> _logger,
        IOptions<DocumentsWatchServiceOptions> _options,
        IMarkdownConverterService _service)
    {
        logger = _logger;
        options = _options;
        service = _service;
    }

    protected override async Task ExecuteAsync(CancellationToken token)
    {
        logger.LogInformation($"Start initial md2json conversion.");
        try
        {
            await service.ConvertAsync(options.Value.InputDir, options.Value.OutputDir, options.Value.IndexDir).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "");
        }

        while (!token.IsCancellationRequested)
        {
            var now = DateTime.Now;
            logger.LogInformation("Watch documents updated after {now}", DateTime.Now);

            // Not sure why, but getting TaskCompletionSource by method or local function doesn't work.
            // IChangeToken from Watch() method never completed... To be confirmed later.
            // register ChangeToken to detect file or directory changes under InputDir
            var fileProvider = new PhysicalFileProvider(options.Value.InputDir);
            var changeToken = fileProvider.Watch("**");
            TaskCompletionSource tcs = new();
            changeToken.RegisterChangeCallback(state => ((TaskCompletionSource)state).TrySetResult(), tcs);

            using (token.Register(() =>
            {
                // this callback will be executed when token is cancelled
                logger.LogInformation($"token is cancelled!");
                tcs.TrySetCanceled();
            }))
            {
                // wait until any document change event happens fro file provider
                await tcs.Task.ConfigureAwait(false);
            }

            logger.LogInformation($"File change detected. Start md2json conversion for updated file(s).");
            try
            {
                await service.ConvertAsync(options.Value.InputDir, options.Value.OutputDir, options.Value.IndexDir, now).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "");
            }
        }
    }
}
