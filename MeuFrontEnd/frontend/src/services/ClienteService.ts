import api from './api'
import { type Cliente, type NovoCliente } from '../types/Cliente'

export const clienteService = {
  listar: async (): Promise<Cliente[]> => {
    const { data } = await api.get('/cliente')
    return data
  },
  criar: async (c: NovoCliente): Promise<Cliente> => {
    const { data } = await api.post('/cliente', c)
    return data
  },

  atualizar: async (id: number, p: NovoCliente): Promise<void> => {
    await api.put(`/cliente/${id}`, {id, ...p})
  },
  
  excluir: async (id: number): Promise<void> => {
    await api.delete(`/cliente/${id}`)
  }
}