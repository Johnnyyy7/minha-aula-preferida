import api from './api'
import { type Venda, type NovaVenda } from '../types/Venda'

export const VendaService = {

  criar: async (p: NovaVenda): Promise<Venda> => {
    const { data } = await api.post('/venda', p)
    return data
  },

  listar: async (): Promise<Venda[]> => {
    const { data } = await api.get('/venda')
    return data
  }

}