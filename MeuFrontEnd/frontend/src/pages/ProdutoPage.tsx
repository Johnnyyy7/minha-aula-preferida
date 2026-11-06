// src/pages/ProdutoPage.tsx
import { useState, useEffect } from 'react'
import { type Produto } from '../types/Produto'
import { ProdutoService } from '../services/ProdutoService'
import ProdutoForm from '../components/ProdutoForm'
import ProdutoList from '../components/ProdutoList'
import './ProdutoPage.css'

function ProdutoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null)

  const carregarProdutos = async () => {
    try {
      setLoading(true)
      setErro(null)
      setProdutos(await ProdutoService.listar())
    } catch {
      setErro('Não foi possível carregar os produtos. Verifique se o backend está rodando em localhost:5255 e se o CORS libera http://localhost:5173.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  // Depois de cadastrar ou salvar a edição: sai do modo edição e atualiza a lista
  const aoSalvar = () => {
    setProdutoEmEdicao(null)
    carregarProdutos()
  }

  const iniciarEdicao = (produto: Produto) => {
    setProdutoEmEdicao(produto)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const excluirProduto = async (produto: Produto) => {
    if (!window.confirm('Excluir o produto "' + produto.nome + '"?')) return
    try {
      await ProdutoService.excluir(produto.id)
      if (produtoEmEdicao?.id === produto.id) setProdutoEmEdicao(null)
      await carregarProdutos()
    } catch {
      setErro('Não foi possível excluir o produto. Ele pode ter vendas registradas.')
    }
  }

  return (
    <main className="pagina">
      <div className="painel">
        <h1 className="pagina-titulo">⚙️ Gestão de Produtos</h1>

        {erro && <p className="mensagem-erro">{erro}</p>}

        <section className="card">
          <ProdutoForm
            onProdutoCriado={aoSalvar}
            produtoEmEdicao={produtoEmEdicao}
            onCancelarEdicao={() => setProdutoEmEdicao(null)}
          />
        </section>

        <section className="card">
          <h2>📦 Produtos Cadastrados</h2>
          <ProdutoList
            produtos={produtos}
            loading={loading}
            editandoId={produtoEmEdicao ? produtoEmEdicao.id : null}
            onEditar={iniciarEdicao}
            onExcluir={excluirProduto}
          />
        </section>
      </div>
    </main>
  )
}

export default ProdutoPage