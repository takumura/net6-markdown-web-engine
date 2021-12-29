using Net6MarkdownWebEngine.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// // Add md2json converter service
//builder.Services.AddSingleton<IService, MarkdownConverterService>();

// Add Documents Watch Service
var contetRootPath = builder.Environment.ContentRootPath;
var isDevelopment = builder.Environment.IsDevelopment();
builder.Services.Configure<DocumentsWatchServiceOptions> (options =>
{
    options.InputDirectry = Path.Combine(contetRootPath, "../AngularStandalone/src/assets/docs");
    if (isDevelopment)
    {
        options.OutputDirectry = Path.Combine(contetRootPath, "../AngularStandalone/src/assets/json");
    }
    else
    {
        options.OutputDirectry = Path.Combine(contetRootPath, "../AngularStandalone/dist/assets/json");
    }
});
builder.Services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, DocumentsWatchService>();

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
