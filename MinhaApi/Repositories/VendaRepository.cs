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

    public int Inserir(Venda venda)
    {
        
    }
}