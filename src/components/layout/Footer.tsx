import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-ink text-cream/80">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-gold font-serif text-xl">紫</span>
              </div>
              <span className="font-serif text-2xl text-cream">
                {t('common.appName')}
              </span>
            </div>
            <p className="text-cream/60 max-w-md">
              免費紫微斗數命盤計算工具，支援真太陽時校正，8 種 AI 命理師風格。
              純本地運算，資料不上傳，隱私有保障。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-gold text-lg mb-4">導航</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-gold transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-gold transition-colors">
                  {t('nav.calculator')}
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-gold transition-colors">
                  {t('nav.education')}
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
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold transition-colors">
                  {t('nav.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-gold transition-colors">
                  {t('nav.disclaimer')}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
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
            {t('footer.copyright')} · {t('footer.disclaimer')}
          </p>
          <p className="text-cream/40 text-sm">
            Made with ❤️ for Chinese Astrology
          </p>
        </div>
      </div>
    </footer>
  )
}
