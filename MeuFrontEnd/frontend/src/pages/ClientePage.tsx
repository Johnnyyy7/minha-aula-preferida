// src/pages/ClientePage.tsx
import { useState, useEffect } from 'react'
import { type Cliente } from '../types/Cliente'
import { clienteService } from '../services/ClienteService'
import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'
import './ProdutoPage.css' // estilos base compartilhados
import './ClientePage.css'

function ClientePage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [clienteEmEdicao, setClienteEmEdicao] = useState<Cliente | null>(null)

  const carregarClientes = async () => {
    try {
      setLoading(true)
      setErro(null)
      setClientes(await clienteService.listar())
    } catch {
      setErro('Não foi possível carregar os clientes. Verifique se o backend está rodando em localhost:5255 e se a rota /api/cliente existe no Swagger.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  // Depois de cadastrar ou salvar a edição: sai do modo edição e atualiza a lista
  const aoSalvar = () => {
    setClienteEmEdicao(null)
    carregarClientes()
  }

  const iniciarEdicao = (cliente: Cliente) => {
    setClienteEmEdicao(cliente)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const excluirCliente = async (cliente: Cliente) => {
    if (!window.confirm('Excluir o cliente "' + cliente.nome + '"?')) return
    try {
      await clienteService.excluir(cliente.id)
      if (clienteEmEdicao?.id === cliente.id) setClienteEmEdicao(null)
      await carregarClientes()
    } catch {
      setErro('Não foi possível excluir o cliente. Ele pode ter vendas registradas.')
    }
  }

  return (
    <main className="pagina">
      <div className="painel">
        <h1 className="pagina-titulo">👤 Gestão de Clientes</h1>

        {erro && <p className="mensagem-erro">{erro}</p>}

        <section className="card card-clientes">
          <ClienteForm
            onClienteCriado={aoSalvar}
            clienteEmEdicao={clienteEmEdicao}
            onCancelarEdicao={() => setClienteEmEdicao(null)}
          />
        </section>

        <section className="card">
          <h2>👥 Clientes Cadastrados</h2>
          <ClienteList
            clientes={clientes}
            loading={loading}
            editandoId={clienteEmEdicao ? clienteEmEdicao.id : null}
            onEditar={iniciarEdicao}
            onExcluir={excluirCliente}
          />
        </section>
      </div>
    </main>
  )
}

export default ClientePage
