import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { Home, Calculator, Education, About, Privacy, Disclaimer, Settings } from './pages'
import './i18n'

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/education" element={<Education />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App
