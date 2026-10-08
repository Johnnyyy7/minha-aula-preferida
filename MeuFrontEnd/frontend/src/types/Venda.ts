export interface Venda {
  id: number
  idProduto: number
  idCliente: number
  dateTime: Date
  valorUnitario: number
  quantidade: number
  totalVenda: number
}

// Tipo para criação — sem o id (gerado pela MinhaAPI)
export type NovaVenda = Omit<Venda, 'id'>