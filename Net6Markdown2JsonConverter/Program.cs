using CommandLine;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Net6MarkdownWebEngine.Converter;

public class Program
{
    readonly ILogger logger;
    readonly ServiceProvider serviceProvider;

    // Referred to the following sample code.
    // https://github.com/aspnet/Logging/blob/master/samples/SampleApp/Program.cs
    public Program(CommandLineOptions? options = null)
    {

        // A Web App based program would configure logging via the WebHostBuilder.
        // Create a logger factory with filters that can be applied across all logger providers.
        var serviceCollection = new ServiceCollection()
            .AddLogging(builder =>
            {
                builder
                    .AddFilter("Microsoft", LogLevel.Warning)
                    .AddFilter("System", LogLevel.Warning)
                    .AddConsole();

                if (options != null && options.Verbose)
                {
                    builder.AddFilter("Net6MarkdownWebEngine.Converter", LogLevel.Trace);
                }
                else
                {
                    builder.AddFilter("Net6MarkdownWebEngine.Converter", LogLevel.Information);
                }
            })
            .AddSingleton<IMarkdownConverterService, MarkdownConverterService>();

        // providers may be added to a LoggerFactory before any loggers are created
        serviceProvider = serviceCollection.BuildServiceProvider();

        // getting the logger using the class's name is conventional
        logger = serviceProvider.GetRequiredService<ILogger<Program>>();
    }


    static async Task Main(string[] args)
    {
        await Parser.Default.ParseArguments<CommandLineOptions>(args).MapResult(
                async options => await new Program(options).RunService(options).ConfigureAwait(false),
                async errors => await new Program().ProcessErrors(errors).ConfigureAwait(false)
            );
    }

    async Task RunService(CommandLineOptions options)
    {
        try
        {
            logger.LogTrace("Start service");
            var service = serviceProvider.GetRequiredService<IMarkdownConverterService>();
            await service.RunAsync(options).ConfigureAwait(false);
            logger.LogInformation("Convert process is successfully completed!");


            if (options.Verbose)
            {
                logger.LogTrace("Press any key to close the window...");
                Console.ReadLine();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "");
        }
    }

    async Task ProcessErrors(IEnumerable<Error> errors)
    {
        await Task.Run(() =>
        {
            foreach (var item in errors)
            {
                logger.LogError(item.ToString());
            }
        });
    }
}

