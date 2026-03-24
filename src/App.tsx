import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { Home, Calculator, Education, About, Privacy, Disclaimer } from './pages'
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
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App
