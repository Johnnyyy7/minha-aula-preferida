export interface Venda {
  id: number
  id_Produto: number
  id_Cliente: number
  data_venda: Date
  valor_Unitario: number
  quantidade: number
  total_Venda: number
}

// Tipo para criação — sem o id (gerado pela MinhaAPI)
export type NovaVenda = Omit<Venda,'id' | 'valor_Unitario' | 'total_Venda' | 'data_venda'>