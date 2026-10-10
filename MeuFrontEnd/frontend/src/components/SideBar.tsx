// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom'

const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: 'block',
  padding: '12px 20px',
  color: isActive ? '#c8d400' : 'white',
  fontWeight: isActive ? 700 : 400,
  textDecoration: 'none',
  background: isActive ? 'rgba(255,255,255,.12)' : 'transparent',
  borderLeft: isActive ? '4px solid #c8d400' : '4px solid transparent'
})

function Sidebar() {
  return (
    <nav
      style={{
        width: '210px',
        background: '#1a3d5c',
        minHeight: '100vh',
        padding: '24px 0',
        flexShrink: 0,
        fontFamily: "'DM Sans', system-ui, sans-serif"
      }}
    >
      <div
        style={{
          padding: '0 24px 20px',
          color: 'white',
          fontSize: '1.15rem',
          fontWeight: 700
        }}
      >
        MinhaApp
      </div>
      <NavLink to="/produtos" style={getLinkStyle}>📦 Produtos</NavLink>
      <NavLink to="/clientes" style={getLinkStyle}>👤 Clientes</NavLink>
      <NavLink to="/vendas" style={getLinkStyle}>👤 Vendas</NavLink>
    </nav>
  )
}
export default Sidebar
