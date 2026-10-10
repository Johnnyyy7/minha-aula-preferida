// src/types/Venda.ts
// Os nomes devem ser IDÊNTICOS ao JSON que a API devolve (GET /api/venda)

// O que a API DEVOLVE
export interface Venda {
  id: number
  nomeCliente: string
  nomeProduto: string
  quantidade: number
  data_Venda: string
  valor_Unitario: number
  total_Venda: number
}

// O que a gente ENVIA para criar uma venda (o resto a API calcula)
export interface NovaVenda {
  id_Cliente: number
  id_Produto: number
  quantidade: number
}