// src/pages/VendaPage.tsx
import { useState, useEffect } from 'react'
import { type Venda } from '../types/Venda'
import { VendaService } from '../services/VendaService'
import VendaForm from '../components/VendaForm'
import VendaList from '../components/VendaList'
import './ProdutoPage.css' // estilos base (painel, cards, campos, botão)
import './VendaPage.css'

function VendaPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregarVendas = async () => {
    try {
      setLoading(true)
      setErro(null)
      setVendas(await VendaService.listar())
    } catch {
      setErro('Não foi possível carregar as vendas. Verifique se o backend está rodando em localhost:5255 e se a rota /api/venda existe no Swagger.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarVendas()
  }, [])

  return (
    <main className="pagina">
      <div className="painel">
        <h1 className="pagina-titulo">🛒 Gestão de Vendas</h1>

        {erro && <p className="mensagem-erro">{erro}</p>}

        <section className="card card-vendas">
          <VendaForm onVendaCriado={carregarVendas} />
        </section>

        <section className="card">
          <h2>📋 Histórico de Vendas</h2>
          <VendaList vendas={vendas} loading={loading} />
        </section>
      </div>
    </main>
  )
}

export default VendaPage
