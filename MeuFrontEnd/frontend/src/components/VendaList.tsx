// src/components/VendaList.tsx
import { type Venda } from '../types/Venda'

// Dados que o componente PAI precisa fornecer
interface Props {
  vendas: Venda[]
  loading: boolean
}

function VendaList({ vendas, loading }: Props) {

  if (loading)
    return <p>Carregando...</p>

  if (vendas.length === 0)
    return <p>Nenhuma venda registrada ainda.</p>

  return (
    <ul>
      {vendas.map(v => (
        <li key={v.id} className="venda-item">
          <div className="venda-detalhes">
            <strong>{v.nomeCliente}</strong>
            <span>
              {v.nomeProduto} · Qtd: {v.quantidade}
            </span>
            <span>{new Date(v.data_Venda).toLocaleDateString('pt-BR')}</span>
          </div>
          <span className="venda-total">R$ {v.total_Venda.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  )
}

export default VendaList
