// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/SideBar'
import ProdutoPage from './pages/ProdutoPage'
import ClientePage from './pages/ClientePage'
import VendaPage from './pages/VendaPage'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 0, minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/produtos" replace />} />
            <Route path="/produtos" element={<ProdutoPage />} />
            <Route path="/clientes" element={<ClientePage />} />
            <Route path="/vendas" element={<VendaPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
