import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from './components/layout'
import {
  Home,
  Calculator,
  Comparison,
  Education,
  About,
  Privacy,
  Disclaimer,
  Settings,
  ChatPage,
  ComparisonChatPage,
} from './pages'

function LayoutRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Fullscreen chat routes (no Header/Footer) */}
        <Route path="/chat/:chartId" element={<ChatPage />} />
        <Route path="/chat/comparison/:comparisonId" element={<ComparisonChatPage />} />

        {/* Standard routes wrapped by Layout */}
        <Route element={<LayoutRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/education" element={<Education />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
