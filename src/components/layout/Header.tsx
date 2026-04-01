import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: '首頁' },
    { path: '/calculator', label: '命盤計算' },
    { path: '/comparison', label: '合盤比較' },
    { path: '/education', label: '科普教學' },
    { path: '/about', label: '關於' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-cream border-b-2 border-primary/20 sticky top-0 z-50 pt-safe">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-10 h-10" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="hgold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37"/><stop offset="100%" stopColor="#B8860B"/>
                </linearGradient>
              </defs>
              <rect width="512" height="512" rx="110" fill="#FDF5E6"/>
              <circle cx="256" cy="256" r="200" fill="none" stroke="#8B0000" strokeWidth="5" opacity="0.18"/>
              <g transform="translate(256,256)">
                <polygon points="0,-120 16,-22 120,0 16,22 0,120 -16,22 -120,0 -16,-22" fill="#8B0000" opacity="0.8"/>
                <polygon points="0,-78 12,-15 78,0 12,15 0,78 -12,15 -78,0 -12,-15" fill="url(#hgold)"/>
                <circle r="14" fill="#D4AF37"/>
              </g>
            </svg>
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
