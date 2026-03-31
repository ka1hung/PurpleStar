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
    <header className="bg-cream border-b-2 border-primary/20 sticky top-0 z-50">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-10 h-10" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="hbg" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#1a1a3e"/>
                  <stop offset="100%" stopColor="#060614"/>
                </radialGradient>
                <linearGradient id="hgold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffe8a0"/>
                  <stop offset="100%" stopColor="#e8b830"/>
                </linearGradient>
              </defs>
              <rect width="512" height="512" rx="100" fill="url(#hbg)"/>
              <circle cx="256" cy="256" r="195" fill="none" stroke="#1e2858" strokeWidth="36"/>
              <circle cx="256" cy="256" r="213" fill="none" stroke="#3a5a9a" strokeWidth="2" opacity="0.6"/>
              <circle cx="256" cy="256" r="177" fill="none" stroke="#3a5a9a" strokeWidth="2" opacity="0.6"/>
              <g stroke="#5ab4ff" strokeWidth="3" opacity="0.7">
                <line x1="195" y1="210" x2="220" y2="175"/><line x1="220" y1="175" x2="260" y2="155"/>
                <line x1="260" y1="155" x2="300" y2="168"/><line x1="300" y1="168" x2="318" y2="200"/>
                <line x1="195" y1="210" x2="210" y2="248"/><line x1="245" y1="230" x2="275" y2="245"/>
                <line x1="235" y1="280" x2="275" y2="285"/>
              </g>
              <g fill="#7acaff">
                <circle cx="220" cy="175" r="7"/><circle cx="260" cy="155" r="6"/>
                <circle cx="300" cy="168" r="7"/><circle cx="195" cy="210" r="6"/>
                <circle cx="318" cy="200" r="7"/><circle cx="245" cy="230" r="6"/>
                <circle cx="275" cy="245" r="6"/><circle cx="210" cy="248" r="6"/>
                <circle cx="235" cy="280" r="6"/><circle cx="275" cy="285" r="5"/>
              </g>
              <g transform="translate(265,195)">
                <polygon points="0,-22 5,-6 22,0 5,6 0,22 -5,6 -22,0 -5,-6" fill="url(#hgold)"/>
              </g>
              <g transform="translate(210,225)">
                <polygon points="0,-14 3,-4 14,0 3,4 0,14 -3,4 -14,0 -3,-4" fill="url(#hgold)" opacity="0.85"/>
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
