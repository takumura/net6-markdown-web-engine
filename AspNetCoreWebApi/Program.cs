using Net6MarkdownWebEngine.Backend.Services;
using Net6MarkdownWebEngine.Converter;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// // Add md2json converter service
builder.Services.AddSingleton<IMarkdownConverterService, MarkdownConverterService>();

// Add Documents Watch Service
var contetRootPath = builder.Environment.ContentRootPath;
var isDevelopment = builder.Environment.IsDevelopment();
builder.Services.Configure<DocumentsWatchServiceOptions>(options =>
{
    options.InputDir = Path.Combine(contetRootPath, "Docs/md");
    options.OutputDir = Path.Combine(contetRootPath, "Docs/json");
    if (isDevelopment)
    {
        options.IndexDir = Path.Combine(contetRootPath, "../AngularStandalone/src/assets");
    }
    else
    {
        options.IndexDir = Path.Combine(contetRootPath, "../AngularStandalone/dist/assets");
    }
});
builder.Services.AddSingleton<IHostedService, DocumentsWatchService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
