import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
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
  const [foto, setFoto] = useState<File | null>(null)          // arquivo escolhido agora
  const [preview, setPreview] = useState<string | null>(null)  // prévia (foto nova ou a já salva)
  const [removerFoto, setRemoverFoto] = useState(false)        // marcou "Remover foto"
  const [inputKey, setInputKey] = useState(0)                  // muda para limpar o <input type="file">
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (produtoEmEdicao) {
      setNome(produtoEmEdicao.nome)
      setPreco(String(produtoEmEdicao.preco))
      setEstoque(String(produtoEmEdicao.estoque))
      setPreview(produtoEmEdicao.fotoBase64 ?? null)
      setErro(null)
    } else {
      setNome('')
      setPreco('')
      setEstoque('')
      setPreview(null)
    }

    setFoto(null)
    setRemoverFoto(false)
    setInputKey(k => k + 1)
  }, [produtoEmEdicao])

  function selecionarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return

    // o backend só aceita estes formatos
    const formatosPermitidos = ['image/jpeg', 'image/png', 'image/webp']
    if (!formatosPermitidos.includes(arquivo.type)) {
      setErro('Selecione uma imagem JPG, PNG ou WEBP.')
      e.target.value = ''
      return
    }

    // este limite tem que ser igual ao do backend (FotoService)
    if (arquivo.size > 5 * 1024 * 1024) {
      setErro('A imagem deve ter no máximo 5 MB.')
      e.target.value = ''
      return
    }

    setErro(null)
    setFoto(arquivo)
    setPreview(URL.createObjectURL(arquivo))
    setRemoverFoto(false)
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

      // Foto: o produto já tem ID, então envia a nova ou remove a atual.
      // Fica num try separado: se só a foto falhar, o produto já foi salvo.
      try {
        if (foto) {
          await ProdutoService.uploadFoto(produto.id, foto)
        } else if (removerFoto && produtoEmEdicao) {
          await ProdutoService.removerFoto(produto.id)
        }
      } catch (error) {
        console.error(error)
        const motivo =
          isAxiosError(error) && typeof error.response?.data === 'string'
            ? error.response.data
            : 'tente de novo editando o produto.'
        setErro('Produto salvo, mas a foto não foi enviada: ' + motivo)
      }

      setNome('')
      setPreco('')
      setEstoque('')
      setFoto(null)
      setPreview(null)
      setRemoverFoto(false)
      setInputKey(k => k + 1)

      onProdutoCriado()

    } catch (error) {
      console.error(error)
      setErro('Erro ao salvar o produto. Tente novamente.')
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
          key={inputKey}
          id="foto"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={selecionarFoto}
          disabled={loading}
        />

        <small>Selecione uma imagem JPG, PNG ou WEBP de até 5 MB.</small>

        {preview && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
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

            {/* Só aparece ao editar, quando a prévia é a foto que já estava salva */}
            {produtoEmEdicao && !foto && (
              <button
                type="button"
                className="botao-secundario"
                disabled={loading}
                onClick={() => {
                  setRemoverFoto(true)
                  setPreview(null)
                }}
              >
                Remover foto
              </button>
            )}
          </div>
        )}

        {removerFoto && (
          <p style={{ margin: '10px 0 0', fontSize: 13 }}>
            A foto será removida quando você salvar.{' '}
            <button
              type="button"
              className="botao-secundario"
              onClick={() => {
                setRemoverFoto(false)
                setPreview(produtoEmEdicao?.fotoBase64 ?? null)
              }}
            >
              Desfazer
            </button>
          </p>
        )}
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
