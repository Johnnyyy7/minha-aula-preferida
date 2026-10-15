import { useEffect, useState } from 'react'
import { clienteService } from '../services/ClienteService'
import { type Cliente } from '../types/Cliente'


interface Props 
{ 
  onClienteCriado: () => void
  clienteEmEdicao: Cliente | null 
  onCancelarEdicao: () => void
}

function ClienteForm({ onClienteCriado, clienteEmEdicao, onCancelarEdicao }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect (() => 
  {
    if (clienteEmEdicao) 
    {
      setNome(clienteEmEdicao.nome)
      setEmail(clienteEmEdicao.email)
      setCpf(clienteEmEdicao.cpf ?? '')
    }
    else
    {
      setNome('')
      setEmail('')
      setCpf('')
    }
    setErro(null)
    
  }, [clienteEmEdicao])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    try {
      setLoading(true)
      if (clienteEmEdicao) {
        // EDITAR: mantém o "ativo" que o cliente já tinha
        await clienteService.atualizar(clienteEmEdicao.id, {
          nome,
          email,
          cpf,
        })
      } else {
        // CADASTRAR
        await clienteService.criar({ nome, email, cpf })
      }
      setNome('')
      setEmail('')
      setCpf('')
      onClienteCriado()
    } catch {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{clienteEmEdicao ? '✏️ Editar Cliente' : '📝 Cadastrar Cliente'}</h2>
      {erro && <p>{erro}</p>}

      <label htmlFor="nome">Nome</label>
      <input id="nome" value={nome}
        onChange={e => setNome(e.target.value)} required />

      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" value={email}
        onChange={e => setEmail(e.target.value)} required />

      <label htmlFor="cpf">CPF</label>
      <input id="cpf" value={cpf}
        onChange={e => setCpf(e.target.value)} />

      <div className="form-acoes">
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : clienteEmEdicao ? 'Salvar alterações' : 'Cadastrar'}
        </button>
        {clienteEmEdicao && (
          <button type="button" className="botao-secundario" onClick={onCancelarEdicao}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default ClienteForm