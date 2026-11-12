
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
    await api.put(`/produto/${id}`, { id, ...p })
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/produto/${id}`)
  },

  // ENVIAR FOTO DO PRODUTO

  uploadFoto: async (id: number, arquivo: File): Promise<string> => {
  const formData = new FormData()

  formData.append('arquivo', arquivo)

  const { data } = await api.post(
    `/produto/${id}/foto`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  return data.fotoBase64
},


  // REMOVER FOTO
  removerFoto: async (id: number): Promise<void> => {
    await api.delete(`/produto/${id}/foto`)
  },

  // BUSCAR PRODUTO POR ID
  buscarPorId: async (id: number): Promise<Produto> => {
    const { data } = await api.get(`/produto/${id}`)
    return data
  }

}
