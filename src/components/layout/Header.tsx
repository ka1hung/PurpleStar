import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: '首頁' },
    { path: '/calculator', label: '命盤計算' },
    { path: '/education', label: '科普教學' },
    { path: '/about', label: '關於' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-cream border-b-2 border-primary/20 sticky top-0 z-50">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-gold font-serif text-xl">紫</span>
            </div>
            <span className="font-serif text-xl text-primary hidden sm:block">
              紫微星盤
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-4 py-2 rounded-classical font-medium transition-all
                  ${
                    isActive(item.path)
                      ? 'bg-primary text-cream'
                      : 'text-ink hover:bg-primary/10'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Settings Link */}
            <Link
              to="/settings"
              className={`p-2 rounded-classical transition-all ${
                isActive('/settings')
                  ? 'bg-primary text-cream'
                  : 'text-ink hover:bg-primary/10'
              }`}
              title="AI 設定"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-classical hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary/10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block px-4 py-3 rounded-classical font-medium transition-all
                  ${
                    isActive(item.path)
                      ? 'bg-primary text-cream'
                      : 'text-ink hover:bg-primary/10'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`
                block px-4 py-3 rounded-classical font-medium transition-all
                ${
                  isActive('/settings')
                    ? 'bg-primary text-cream'
                    : 'text-ink hover:bg-primary/10'
                }
              `}
            >
              AI 設定
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
