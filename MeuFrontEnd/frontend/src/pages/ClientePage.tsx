// src/pages/ClientePage.tsx
import { useCallback, useEffect, useState } from 'react'
import { type Cliente } from '../types/Cliente'
import { clienteService } from '../services/ClienteService'
import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'
import './ProdutoPage.css' // estilos base compartilhados (painel, cards, campos, botão)
import './ClientePage.css' // ajustes do formulário de clientes

function ClientePage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregarClientes = useCallback(async () => {
    try {
      setLoading(true)
      setErro(null)
      setClientes(await clienteService.listar())
    } catch {
      setErro(
        'Não foi possível carregar os clientes. Verifique se o backend está rodando em localhost:5255 e se a rota /api/cliente existe no Swagger.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarClientes()
  }, [carregarClientes])

  return (
    <main className="pagina">
      <div className="painel">
        <h1 className="pagina-titulo">👤 Gestão de Clientes</h1>

        {erro && (
          <p className="mensagem-erro" role="alert">
            {erro}
          </p>
        )}

        <section className="card card-clientes">
          <ClienteForm onClienteCriado={carregarClientes} />
        </section>

        <section className="card">
          <h2>👥 Clientes Cadastrados</h2>
          <ClienteList clientes={clientes} loading={loading} />
        </section>
      </div>
    </main>
  )
}

export default ClientePage
