using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;

public class VendaService : IVendaService
{
    private readonly IVendaRepository _repo;
    private readonly IProdutoRepository _repoProduto;
    private readonly IClienteRepository _repoCliente;

    public VendaService(IVendaRepository repo, IProdutoRepository repoProduto, IClienteRepository repoCliente)
    {
        _repo = repo;
        _repoProduto = repoProduto;
        _repoCliente = repoCliente;
    } 

    public Venda Create(Venda venda)
    {
        if(_repoCliente.GetById(venda.Id_Cliente) == null)
        {
            throw new ArgumentException("ID invalido");
        }

        if(_repoProduto.GetById(venda.Id_Produto) == null)
        {
            throw new ArgumentException("ID invalido");
        }

        return venda;
    }


}