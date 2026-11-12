import { useState } from 'react'
import { type Produto } from '../types/Produto'
import ModalFoto from './produtos/ModalFoto'

interface Props {
  produtos: Produto[]
  loading: boolean
  editandoId: number | null
  onEditar: (produto: Produto) => void
  onExcluir: (produto: Produto) => void
}

function ProdutoList({ produtos, loading, editandoId, onEditar, onExcluir }: Props) {
  // Produto cuja foto está aberta no modal (null = modal fechado).
  // O useState fica ANTES dos "return": hooks nunca podem vir depois de um return.
  const [produtoModal, setProdutoModal] = useState<Produto | null>(null)

  if (loading) return <p>Carregando...</p>
  if (produtos.length === 0)
    return <p>Nenhum produto cadastrado ainda.</p>

  return (
    <>
      <ul>
        {produtos.map(p => (
          <li
            key={p.id}
            className={p.id === editandoId ? 'produto-item em-edicao' : 'produto-item'}
          >
            <div className="produto-info">
              {p.fotoBase64 ? (
                // Miniatura clicável: abre a foto grande no modal
                <button
                  type="button"
                  onClick={() => setProdutoModal(p)}
                  aria-label={'Ver foto de ' + p.nome}
                  style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  <img
                    src={p.fotoBase64}
                    alt={p.nome}
                    style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, display: 'block' }}
                  />
                </button>
              ) : (
                // Sem foto: quadradinho cinza
                <div
                  title="Sem foto"
                  style={{
                    width: 56, height: 56, borderRadius: 8, background: '#f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, color: '#bbb'
                  }}
                >
                  📷
                </div>
              )}

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

      {/* Modal com a foto grande: só aparece quando há um produto selecionado */}
      {produtoModal && (
        <ModalFoto produto={produtoModal} onFechar={() => setProdutoModal(null)} />
      )}
    </>
  )
}
export default ProdutoList
