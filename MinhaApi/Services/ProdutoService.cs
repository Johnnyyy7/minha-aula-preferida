using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;

public class ProdutoService : IProdutoService
{
    private readonly IProdutoRepository _repo;
    private readonly IFotoService _fotoService;

    public ProdutoService(IProdutoRepository repo, IFotoService fotoService) // DI injeta automaticamente
    {
        _repo        = repo;
        _fotoService = fotoService;
    }

    // O tipo de retorno tem que ser IEnumerable<Produto>, igual ao da interface
    public IEnumerable<Produto> GetAll()
    {
        var produtos = _repo.GetAll().ToList();

        // Para cada produto, calcular o base64 da foto
        foreach (var p in produtos)
            p.FotoBase64 = _fotoService.LerBase64(p.Foto);

        return produtos;
    }

    public Produto? GetById(int id)
    {
        var produto = _repo.GetById(id);
        if (produto is null) return null;

        // Enriquecer com base64 antes de retornar
        produto.FotoBase64 = _fotoService.LerBase64(produto.Foto);
        return produto;
    }

    public Produto Create(Produto produto)
    {
        if (produto.Preco < 0)
            throw new ArgumentException("Preço inválido");
        if (produto.Estoque < 0)
            throw new ArgumentException("Estoque inválido");

        _repo.Add(produto);
        return produto;
    }

    public Produto? Update(int id, Produto p)
    {
        var existente = _repo.GetById(id);
        if (existente == null) return null;

        p.Id = id;
        _repo.Update(p);

        // O PUT não mexe na foto: devolve a que já existia
        p.Foto = existente.Foto;
        p.FotoBase64 = _fotoService.LerBase64(existente.Foto);
        return p;
    }

    public bool Delete(int id)
    {
        var produto = _repo.GetById(id);
        if (produto == null) return false;

        _repo.Delete(id);

        // Só apaga o arquivo depois que o produto saiu do banco
        if (!string.IsNullOrEmpty(produto.Foto))
            _fotoService.Deletar(produto.Foto);

        return true;
    }

    public async Task<string> SalvarFoto(int id, IFormFile arquivo)
    {
        var produto = _repo.GetById(id)
            ?? throw new KeyNotFoundException("Produto não encontrado.");

        // 1º salva a nova (se falhar, a antiga continua intacta)
        var nome = await _fotoService.SalvarAsync(arquivo);
        var fotoAntiga = produto.Foto;

        // 2º grava o novo nome no banco
        _repo.AtualizarFoto(id, nome);

        // 3º só agora apaga a antiga do disco
        if (!string.IsNullOrEmpty(fotoAntiga))
            _fotoService.Deletar(fotoAntiga);

        // Retorna a data URL — o controller manda direto ao React
        return _fotoService.LerBase64(nome)!;
    }

    public void RemoverFoto(int id)
    {
        var produto = _repo.GetById(id)
            ?? throw new KeyNotFoundException("Produto não encontrado.");

        if (string.IsNullOrEmpty(produto.Foto)) return;

        _repo.AtualizarFoto(id, null);
        _fotoService.Deletar(produto.Foto);
    }
}