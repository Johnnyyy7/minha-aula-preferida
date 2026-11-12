
import { useEffect, useState } from 'react'
import { ProdutoService } from '../services/ProdutoService'
import { type Produto } from '../types/Produto'

interface Props {
  onProdutoCriado: () => void
  produtoEmEdicao: Produto | null
  onCancelarEdicao: () => void
}

function ProdutoForm({
  onProdutoCriado,
  produtoEmEdicao,
  onCancelarEdicao
}: Props) {

  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [estoque, setEstoque] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (produtoEmEdicao) {
      setNome(produtoEmEdicao.nome)
      setPreco(String(produtoEmEdicao.preco))
      setEstoque(String(produtoEmEdicao.estoque))
      setPreview(produtoEmEdicao.fotoBase64 ?? null)
    } else {
      setNome('')
      setPreco('')
      setEstoque('')
      setPreview(null)
    }

    setFoto(null)
    setErro(null)
  }, [produtoEmEdicao])

  function selecionarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return

    if (!arquivo.type.startsWith('image/')) {
      setErro('Selecione uma imagem válida.')
      return
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setErro('A imagem deve ter no máximo 5 MB.')
      return
    }

    setErro(null)
    setFoto(arquivo)
    setPreview(URL.createObjectURL(arquivo))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    try {
      setLoading(true)

      let produto: Produto

      if (produtoEmEdicao) {
        await ProdutoService.atualizar(produtoEmEdicao.id, {
          nome,
          preco: Number(preco),
          estoque: Number(estoque),
          ativo: produtoEmEdicao.ativo
        })

        produto = produtoEmEdicao
      } else {
        produto = await ProdutoService.criar({
          nome,
          preco: Number(preco),
          estoque: Number(estoque),
          ativo: true
        })
      }

      // Envia a foto depois que o produto já possui ID.
      if (foto) {
        await ProdutoService.uploadFoto(produto.id, foto)
      }

      setNome('')
      setPreco('')
      setEstoque('')
      setFoto(null)
      setPreview(null)

      onProdutoCriado()

    } catch (error) {
      console.error(error)
      setErro('Erro ao cadastrar produto ou enviar imagem.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      <h2>
        {produtoEmEdicao ? '✏️ Editar Produto' : '📝 Cadastrar Produto'}
      </h2>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <div>
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="preco">Preço</label>
        <input
          id="preco"
          type="number"
          step="0.01"
          min="0"
          value={preco}
          onChange={e => setPreco(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="estoque">Estoque</label>
        <input
          id="estoque"
          type="number"
          min="0"
          value={estoque}
          onChange={e => setEstoque(e.target.value)}
          required
        />
      </div>

      {/* CAMPO PARA SELECIONAR FOTO */}
      <div className="campo-foto">
        <label htmlFor="foto">Foto do produto</label>

        <input
          id="foto"
          type="file"
          accept="image/*"
          onChange={selecionarFoto}
          disabled={loading}
        />

        {preview && (
          <div style={{ marginTop: 10 }}>
            <img
              src={preview}
              alt="Prévia do produto"
              style={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: 8
              }}
            />
          </div>
        )}

        <small>Selecione uma imagem de até 5 MB.</small>
      </div>

      <div className="form-acoes">

        <button type="submit" disabled={loading}>
          {loading
            ? 'Salvando...'
            : produtoEmEdicao
              ? 'Salvar alterações'
              : 'Cadastrar'}
        </button>

        {produtoEmEdicao && (
          <button
            type="button"
            className="botao-secundario"
            onClick={onCancelarEdicao}
            disabled={loading}
          >
            Cancelar
          </button>
        )}

      </div>

    </form>
  )
}

export default ProdutoForm
