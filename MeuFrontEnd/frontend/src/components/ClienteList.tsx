import { type Cliente } from '../types/Cliente'

interface Props {
  clientes: Cliente[]
  loading: boolean
  editandoId: number | null
  onEditar: (cliente: Cliente) => void
  onExcluir: (cliente: Cliente) => void
}

function ClienteList({ clientes, loading, editandoId, onEditar, onExcluir }: Props) {
  if (loading) return <p>Carregando...</p>
  if (clientes.length === 0)
    return <p>Nenhum cliente cadastrado ainda.</p>

  // As classes produto-item, produto-info e produto-acoes vêm do ProdutoPage.css
  return (
    <ul>
      {clientes.map(c => (
        <li
          key={c.id}
          className={c.id === editandoId ? 'produto-item em-edicao' : 'produto-item'}
        >
          <div className="produto-info">
            <strong>{c.nome}</strong>
            <span>{c.email}</span>
            {c.cpf && <span>CPF: {c.cpf}</span>}
          </div>

          <div className="produto-acoes">
            <button type="button" className="btn-acao" onClick={() => onEditar(c)}>
              Editar
            </button>
            <button type="button" className="btn-acao btn-excluir" onClick={() => onExcluir(c)}>
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
export default ClienteList