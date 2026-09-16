using MinhaApi.Models;

namespace MinhaApi.Services;

public interface IVendaService
{
    Venda  Create(Venda venda);
    IEnumerable<Venda> GetAll();
    Venda? GetById(int id);
}