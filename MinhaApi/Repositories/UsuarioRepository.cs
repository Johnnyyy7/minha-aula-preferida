using MinhaApi.Models;
using MinhaApi.Repositories;
using MySqlConnector;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly string _connectionString;

    // Mesma connection string que o ProdutoRepository usa ("DefaultConnection")
    public UsuarioRepository(IConfiguration config)
        => _connectionString = config.GetConnectionString("DefaultConnection")!;

    public Usuario? BuscarPorEmail(string email)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        // @Email parametrizado: protege contra SQL Injection
        string sql = @"SELECT id, nome, email, senha_hash, ativo
                       FROM usuario
                       WHERE email = @Email AND ativo = 1";

        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Email", email);

        using var reader = cmd.ExecuteReader();

        // Não achou: devolve null (quem decide o que fazer é a Service)
        if (!reader.Read())
            return null;

        return new Usuario
        {
            Id = reader.GetInt32("id"),
            Nome = reader.GetString("nome"),
            Email = reader.GetString("email"),
            SenhaHash = reader.GetString("senha_hash"),
            Ativo = reader.GetBoolean("ativo")
        };
    }
}