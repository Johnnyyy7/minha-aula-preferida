public class TipoService : ITipoService
{
    private readonly ITipoRepository _repo;

    public TipoService(ITipoRepository repo)
        => _repo = repo;

    public Enumerable<Tipo> GetAll()
        => _repo = GetAll();
    
    public Tipo? GetById(int id)
        => _repo.GetById(id);
    
    public Tipo Create(Tipo tipo)
    {
        if (tipo.Id != 0)
            throw new ArgumentException("ID invalido");

        _repo.Add(tipo);
        return tipo;
    }

    public Tipo? Update(int id, Tipo t)
    {
        if (_repo.GetById(id) == null) return null;
        t.Id = id;
        _repo.Update(t);
        return t;
    }
}