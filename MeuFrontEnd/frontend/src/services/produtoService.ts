// src/services/produtoService.ts
import api from './api'
import { type Produto, type NovoProduto } from '../types/Produto'

export const ProdutoService = {

  listar: async (): Promise<Produto[]> => {
    const { data } = await api.get('/produto')
    return data
  },

  criar: async (p: NovoProduto): Promise<Produto> => {
    const { data } = await api.post('/produto', p)
    return data
  },

  atualizar: async (id: number, p: NovoProduto): Promise<void> => {
    await api.put(`/produto/${id}`, {id, ...p})

  },
  
  excluir: async (id: number): Promise<void> => {
    await api.delete(`/produto/${id}`)
  }

}