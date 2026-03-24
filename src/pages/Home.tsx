import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/common/Button'

export function Home() {
  const { t } = useTranslation()

  const features = [
    {
      icon: '🤖',
      titleKey: 'home.features.aiMasters.title',
      descKey: 'home.features.aiMasters.desc',
    },
    {
      icon: '📚',
      titleKey: 'home.features.education.title',
      descKey: 'home.features.education.desc',
    },
    {
      icon: '🔒',
      titleKey: 'home.features.privacy.title',
      descKey: 'home.features.privacy.desc',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-cream-dark" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            {/* Main title */}
            <h1 className="font-serif text-5xl md:text-7xl text-primary mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-ink/70 mb-4">
              {t('home.hero.subtitle')}
            </p>

            {/* Tagline with highlight */}
            <div className="inline-block bg-primary/10 border border-primary/20 rounded-classical px-6 py-3 mb-10">
              <p className="text-lg text-primary font-medium">
                「{t('home.hero.tagline')}」
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <Link to="/calculator">
                <Button size="lg" variant="primary">
                  {t('home.hero.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-cream rounded-lg p-6 border border-primary/10
                           hover:border-primary/30 hover:shadow-classical
                           transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-serif text-xl text-primary mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-ink/60">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Masters Preview */}
      <section className="py-20 bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-gold mb-12">
            8 位 AI 命理師
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: '玄真道長', emoji: '🏔️', desc: '道家風格' },
              { name: '林老師', emoji: '👨‍🏫', desc: '學院派' },
              { name: '紫微姐姐', emoji: '💜', desc: '療癒系' },
              { name: '鐵口神算', emoji: '⚡', desc: '江湖派' },
              { name: '科學命理師', emoji: '🔬', desc: '理性派' },
              { name: '幽默大師', emoji: '😄', desc: '諧趣派' },
              { name: '廖阿姨', emoji: '🔮', desc: '台式神婆' },
              { name: '小神童', emoji: '🌸', desc: '清新可愛' },
            ].map((master, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-4 text-center
                           hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="text-4xl mb-2">{master.emoji}</div>
                <div className="font-serif text-cream">{master.name}</div>
                <div className="text-sm text-cream/60">{master.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl text-primary mb-6">
            探索您的命運地圖
          </h2>
          <p className="text-ink/70 mb-8">
            免費使用，無需註冊，資料安全存於您的裝置
          </p>
          <Link to="/calculator">
            <Button size="lg" variant="primary">
              立即排盤
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
