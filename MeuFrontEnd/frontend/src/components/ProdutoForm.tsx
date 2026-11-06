import { useEffect, useState } from 'react'
import { ProdutoService } from '../services/ProdutoService'
import { type Produto } from '../types/Produto'

interface Props {
  onProdutoCriado: () => void           // chamado depois de cadastrar OU salvar a edição
  produtoEmEdicao: Produto | null       // null = formulário de cadastro
  onCancelarEdicao: () => void
}

function ProdutoForm({ onProdutoCriado, produtoEmEdicao, onCancelarEdicao }: Props) {
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [estoque, setEstoque] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Quando clica em "Editar", preenche o formulário com os dados do produto.
  // Quando cancela (ou termina), limpa os campos.
  useEffect(() => {
    if (produtoEmEdicao) {
      setNome(produtoEmEdicao.nome)
      setPreco(String(produtoEmEdicao.preco))
      setEstoque(String(produtoEmEdicao.estoque))
    } else {
      setNome('')
      setPreco('')
      setEstoque('')
    }
    setErro(null)
  }, [produtoEmEdicao])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    try {
      setLoading(true)
      if (produtoEmEdicao) {
        // EDITAR: mantém o "ativo" que o produto já tinha
        await ProdutoService.atualizar(produtoEmEdicao.id, {
          nome,
          preco: Number(preco),
          estoque: Number(estoque),
          ativo: produtoEmEdicao.ativo
        })
      } else {
        // CADASTRAR
        await ProdutoService.criar({
          nome,
          preco: Number(preco),
          estoque: Number(estoque),
          ativo: true
        })
      }
      setNome('')
      setPreco('')
      setEstoque('')
      onProdutoCriado()
    } catch {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{produtoEmEdicao ? '✏️ Editar Produto' : '📝 Cadastrar Produto'}</h2>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <div>
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="preco">Preço</label>
        <input
          id="preco"
          type="number"
          step="0.01"
          min="0"
          value={preco}
          onChange={e => setPreco(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="estoque">Estoque</label>
        <input
          id="estoque"
          type="number"
          step="1"
          min="0"
          value={estoque}
          onChange={e => setEstoque(e.target.value)}
          required
        />
      </div>

      <div className="form-acoes">
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : produtoEmEdicao ? 'Salvar alterações' : 'Cadastrar'}
        </button>
        {produtoEmEdicao && (
          <button type="button" className="botao-secundario" onClick={onCancelarEdicao}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
export default ProdutoForm