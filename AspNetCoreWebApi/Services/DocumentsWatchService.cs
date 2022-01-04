using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Net6MarkdownWebEngine.Converter;

namespace Net6MarkdownWebEngine.Backend.Services;

public class DocumentsWatchService : BackgroundService
{
    readonly ILogger<DocumentsWatchService> logger;
    readonly IOptions<DocumentsWatchServiceOptions> options;
    readonly MarkdownConverterService service;

    public DocumentsWatchService(
        ILogger<DocumentsWatchService> _logger,
        IOptions<DocumentsWatchServiceOptions> _options,
        MarkdownConverterService _service)
    {
        logger = _logger;
        options = _options;
        service = _service;
    }

    protected override async Task ExecuteAsync(CancellationToken token)
    {
        var now = DateTime.Now;

        var getFileProviderTaskCompletionSource = () =>
        {
            var fileProvider = new PhysicalFileProvider(options.Value.InputDirectry);
            var changeToken = fileProvider.Watch("**");
            var tcs = new TaskCompletionSource();

            changeToken.RegisterChangeCallback(state => ((TaskCompletionSource)state).TrySetResult(), tcs);

            return tcs;
        };

        while (!token.IsCancellationRequested)
        {
            logger.LogInformation($"Start md2json conversion for updated file.");
            try
            {
                await service.ConvertAsync(options.Value.InputDirectry, options.Value.OutputDirectry, now).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "");
            }

            logger.LogInformation("Watch documents updated after {now}", DateTime.Now);
            var tcs = getFileProviderTaskCompletionSource();
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
        }

    }
}
