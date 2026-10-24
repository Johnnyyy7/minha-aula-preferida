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

    public void Add(Usuario u) 
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = @"INSERT INTO usuario (nome, email, senha_hash, ativo) 
                    VALUES (@Nome, @Email, @SenhaHash, @Ativo);
                    SELECT LAST_INSERT_ID();";

        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Nome", u.Nome);
        cmd.Parameters.AddWithValue("@Email", u.Email);
        cmd.Parameters.AddWithValue("@SenhaHash", u.SenhaHash);
        cmd.Parameters.AddWithValue("@Ativo", u.Ativo);

        var idGerado = cmd.ExecuteScalar();
        u.Id = Convert.ToInt32(idGerado);
    }

    public Usuario? usuarioExiste(string email, string senhaHash)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = @"SELECT id, nome, email, senha_hash, ativo
                       FROM usuario
                       WHERE email = @Email AND senha_hash = @SenhaHash AND ativo = 1";

        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Email", email);
        cmd.Parameters.AddWithValue("@SenhaHash", senhaHash);

        using var reader = cmd.ExecuteReader();

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