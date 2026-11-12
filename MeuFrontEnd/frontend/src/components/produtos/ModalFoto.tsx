// Só use este arquivo se você AINDA NÃO tem o seu ModalFoto.
import { useEffect } from 'react'
import { type Produto } from '../../types/Produto'

interface Props {
  produto: Produto
  onFechar: () => void
}

function ModalFoto({ produto, onFechar }: Props) {
  // Fecha com a tecla Esc
  useEffect(() => {
    const aoApertar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoApertar)
    return () => window.removeEventListener('keydown', aoApertar)
  }, [onFechar])

  return (
    // Clicar no fundo escuro fecha o modal
    <div
      onClick={onFechar}
      role="dialog"
      aria-modal="true"
      aria-label={'Foto de ' + produto.nome}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16
      }}
    >
      {/* Clicar dentro da caixa NÃO fecha */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', background: '#fff', borderRadius: 12,
          padding: 16, maxWidth: '90vw', maxHeight: '90vh', textAlign: 'center'
        }}
      >
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          style={{
            position: 'absolute', top: 8, right: 8, width: 32, height: 32,
            borderRadius: '50%', border: 'none', background: '#1a3d5c',
            color: '#fff', fontSize: 16, cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <img
          src={produto.fotoBase64 ?? ''}
          alt={produto.nome}
          style={{ maxWidth: '80vw', maxHeight: '75vh', display: 'block', borderRadius: 8 }}
        />
        <p style={{ margin: '12px 0 0', fontWeight: 700, color: '#1a3d5c' }}>{produto.nome}</p>
      </div>
    </div>
  )
}
export default ModalFoto
