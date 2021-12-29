using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace Net6MarkdownWebEngine.Backend.Services;

public class DocumentsWatchService : BackgroundService
{
    private readonly ILogger<DocumentsWatchService> _logger;
    readonly IOptions<DocumentsWatchServiceOptions> _options;

    public DocumentsWatchService(ILogger<DocumentsWatchService> logger,
        IOptions<DocumentsWatchServiceOptions> options
        //MarkdownConverterService service,
        )
    {
        this._logger = logger;
        this._options = options;
        //this._service = service;
    }

    protected override async Task ExecuteAsync(CancellationToken token)
    {
        var now = DateTime.Now;

        while (!token.IsCancellationRequested)
        {
            _logger.LogInformation($"Start md2json conversion for updated file.");
            try
            {
                //await _service.ConvertAsync(_options.Value.InputDirectry, _options.Value.OutputDirectry, now).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "");
            }

            _logger.LogInformation("Watch documents updated after {now}", DateTime.Now);
            var tcs = GetFileProviderTask();
            using (token.Register(() =>
            {
                // this callback will be executed when token is cancelled
                _logger.LogInformation($"token is cancelled!");
                tcs.TrySetCanceled();
            }))
            {
                // wait until any document change event happens fro file provider
                await tcs.Task.ConfigureAwait(false);
            }
        }

    }

    private TaskCompletionSource GetFileProviderTask()
    {
        var fileProvider = new PhysicalFileProvider(_options.Value.InputDirectry);
        var tcs = new TaskCompletionSource();
        var token = fileProvider.Watch("**");

        token.RegisterChangeCallback(state =>
            ((TaskCompletionSource)state).TrySetResult(), tcs);

        return tcs;
    }
}
