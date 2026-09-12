using MinhaApi.Models;
using MinhaApi.Repositories;
using MySqlConnector;

public class VendaRepository
{
    private readonly string _connectionString;

    public VendaRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public void Add (Venda v)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = @"INSERT INTO venda (id_produto, id_cliente, data_venda, valor_Unitario, quantidade, total_venda)
                        VALUES (@Id_Prduto, @Id_Cliente, @Data_Venda, Valor_Unitario, @Quantidade, @Total_Venda);
                        SELECT LAST_INSERT_ID()";

        using var cmd = new MySqlCommand(sql, conn);

        cmd.Parameters.AddWithValue("@Id_Produto", v.Id_Produto);
        cmd.Parameters.AddWithValue("@Id_Cliente", v.Id_Cliente);
        cmd.Parameters.AddWithValue("@Data_Venda", v.Data_Venda);
        cmd.Parameters.AddWithValue("@Valor_Unitario", v.Valor_Unitario);
        cmd.Parameters.AddWithValue("@Qauntidade", v.Quantidade);
        cmd.Parameters.AddWithValue("@Total_Venda", v.Total_Venda);

        var idGerado = cmd.ExecuteScalar();
        v.Id = Convert.ToInt32(idGerado);
    }
}