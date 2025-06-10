import { Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import Dashboard from './pages/Dashboard'
import './App.css'
import Layout from './pages/Layout'
import Portfolio from './pages/Portfolio'
import Compare from './pages/Compare'
import Watchlist from './pages/Watchlist'
import StockDetail from './pages/StockDetail'

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
        </Route>
      </Routes>
    </Provider>
  )
}

export default App
