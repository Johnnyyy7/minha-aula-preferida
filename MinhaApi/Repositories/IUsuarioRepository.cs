public interface IUsuarioRepository
{
    // Retorna null se não encontrar
    Usuario? BuscarPorEmail(string email);
    void Add(Usuario usuario);
}