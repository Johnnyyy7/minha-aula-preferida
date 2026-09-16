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
        var produto = _repoProduto.GetById(venda.Id_Produto);
        var cliente = _repoCliente.GetById(venda.Id_Cliente);

        if(cliente == null)
        {
            throw new ArgumentException("ID invalido");
        }

        if(produto == null)
        {
            throw new ArgumentException("ID invalido");
        }

        if (produto.Estoque < venda.Quantidade)
        {
            throw new ArgumentException("Estoque insuficiente");
        }

        venda.Valor_Unitario = produto.Preco;
        venda.Total_Venda = produto.Preco * venda.Quantidade;
        venda.Data_Venda = DateTime.Now;

        _repoProduto.AtualizarEstoque(produto.Id, venda.Quantidade);
        _repo.Add(venda);

        return venda;
    }

    public IEnumerable<Venda> GetAll()
        => _repo.GetAll();

    public Venda? GetById(int id)
        => _repo.GetById(id);
}