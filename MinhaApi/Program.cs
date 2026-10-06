using MinhaApi.Repositories;
using MinhaApi.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddScoped<
    IProdutoRepository,
    ProdutoRepository>();

builder.Services.AddScoped<
    ITipoRepository,
    TipoRepository>();

builder.Services.AddScoped<
    IProdutoService,
    ProdutoService>();

builder.Services.AddScoped<
    ITipoService,
    TipoService>();

builder.Services.AddScoped<
    IClienteService,
    ClienteService>();

builder.Services.AddScoped<
    IClienteRepository,
    ClienteRepository>();

builder.Services.AddScoped<
    IVendaRepository,
    VendaRepository>();
    
builder.Services.AddScoped<
    IVendaService,
    VendaService>();

builder.Services.AddScoped<
    IFornecedorService,
    FornecedorService>();

builder.Services.AddScoped<
    IFornecedorRepository,
    FornecedorRepository>();

builder.Services.AddScoped<
    IDepartamentoService,
    DepartamentoService>();

builder.Services.AddScoped<
    IDepartamentoRepository,
    DepartamentoRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});


var app = builder.Build();

app.UseCors("Frontend");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();


