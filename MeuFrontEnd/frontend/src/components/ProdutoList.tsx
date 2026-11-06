import { type Produto } from '../types/Produto'

interface Props {
  produtos: Produto[]
  loading: boolean
  editandoId: number | null
  onEditar: (produto: Produto) => void
  onExcluir: (produto: Produto) => void
}

function ProdutoList({ produtos, loading, editandoId, onEditar, onExcluir }: Props) {
  if (loading) return <p>Carregando...</p>
  if (produtos.length === 0)
    return <p>Nenhum produto cadastrado ainda.</p>

  return (
    <ul>
      {produtos.map(p => (
        <li
          key={p.id}
          className={p.id === editandoId ? 'produto-item em-edicao' : 'produto-item'}
        >
          <div className="produto-info">
            <strong>{p.nome}</strong>
            <span className="produto-preco">R$ {p.preco.toFixed(2)}</span>
            <span className={p.estoque <= 0 ? 'estoque zerado' : p.estoque <= 5 ? 'estoque baixo' : 'estoque'}>
              {p.estoque <= 0 ? 'Sem estoque' : 'Estoque: ' + p.estoque}
            </span>
          </div>

          <div className="produto-acoes">
            <button type="button" className="btn-acao" onClick={() => onEditar(p)}>
              Editar
            </button>
            <button type="button" className="btn-acao btn-excluir" onClick={() => onExcluir(p)}>
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
export default ProdutoList