import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-10 h-10" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="fbg" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#1a1a3e"/>
                    <stop offset="100%" stopColor="#060614"/>
                  </radialGradient>
                  <linearGradient id="fgold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffe8a0"/>
                    <stop offset="100%" stopColor="#e8b830"/>
                  </linearGradient>
                </defs>
                <rect width="512" height="512" rx="100" fill="url(#fbg)"/>
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
                  <polygon points="0,-22 5,-6 22,0 5,6 0,22 -5,6 -22,0 -5,-6" fill="url(#fgold)"/>
                </g>
                <g transform="translate(210,225)">
                  <polygon points="0,-14 3,-4 14,0 3,4 0,14 -3,4 -14,0 -3,-4" fill="url(#fgold)" opacity="0.85"/>
                </g>
              </svg>
              <span className="font-serif text-2xl text-cream">
                紫微星盤
              </span>
            </div>
            <p className="text-cream/60 max-w-md">
              免費紫微斗數命盤計算工具，8 種 AI 命理師風格。
              純本地運算，資料不上傳，隱私有保障。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-gold text-lg mb-4">導航</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-gold transition-colors">
                  首頁
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-gold transition-colors">
                  命盤計算
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-gold transition-colors">
                  科普教學
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-serif text-gold text-lg mb-4">其他</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  關於
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold transition-colors">
                  隱私政策
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-gold transition-colors">
                  免責聲明
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ka1hung/PurpleStar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-cream/40 text-sm">
            © 2024 紫微星盤 · 命理僅供參考
          </p>
          <p className="text-cream/40 text-sm">
            Made with ❤️ for Chinese Astrology
          </p>
        </div>
      </div>
    </footer>
  )
}
