import { useState } from 'react'

type TabId = 'intro' | 'palaces' | 'stars' | 'transformations' | 'howto'

export function Education() {
  const [activeTab, setActiveTab] = useState<TabId>('intro')

  const tabs = [
    { id: 'intro' as TabId, label: '紫微斗數入門' },
    { id: 'palaces' as TabId, label: '十二宮位' },
    { id: 'stars' as TabId, label: '主星介紹' },
    { id: 'transformations' as TabId, label: '四化星' },
    { id: 'howto' as TabId, label: '如何看命盤' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl text-primary text-center mb-8">
        紫微斗數科普教學
      </h1>

      {/* Tab navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-classical font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-primary text-cream'
                : 'bg-white text-ink border border-primary/20 hover:border-primary/40'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg shadow-classical p-8">
        {activeTab === 'intro' && <IntroContent />}
        {activeTab === 'palaces' && <PalacesContent />}
        {activeTab === 'stars' && <StarsContent />}
        {activeTab === 'transformations' && <TransformationsContent />}
        {activeTab === 'howto' && <HowToContent />}
      </div>
    </div>
  )
}

function IntroContent() {
  return (
    <article className="prose prose-lg max-w-none">
      <h2 className="font-serif text-2xl text-primary">紫微斗數是什麼？</h2>

      <h3 className="font-serif text-xl text-primary/80">起源與歷史</h3>
      <p>
        紫微斗數相傳為宋代陳摶老祖所創，是中國傳統命理學的重要分支。
        它以紫微星為首，配合其他星曜在十二宮位中的分布，來推算人一生的命運走勢。
      </p>
      <p>
        因為據說此術原本只在皇宮中流傳，專為帝王將相所用，因此又被稱為「帝王之學」。
      </p>

      <h3 className="font-serif text-xl text-primary/80">「斗數」的由來</h3>
      <p>
        「斗」指的是北斗七星與南斗六星。紫微斗數的主要星曜分為：
      </p>
      <ul>
        <li><strong>北斗星系</strong>：紫微、貪狼、巨門、祿存、文曲、廉貞、武曲、破軍</li>
        <li><strong>南斗星系</strong>：天府、天機、天相、天梁、天同、七殺</li>
        <li><strong>中天星系</strong>：太陽、太陰</li>
      </ul>

      <h3 className="font-serif text-xl text-primary/80">與八字、西洋占星的差異</h3>
      <div className="not-prose overflow-x-auto my-4">
        <table className="w-full border-collapse border border-primary/20">
          <thead>
            <tr className="bg-cream">
              <th className="border border-primary/20 px-4 py-2 text-left">項目</th>
              <th className="border border-primary/20 px-4 py-2 text-left">紫微斗數</th>
              <th className="border border-primary/20 px-4 py-2 text-left">八字</th>
              <th className="border border-primary/20 px-4 py-2 text-left">西洋占星</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-primary/20 px-4 py-2">基礎</td>
              <td className="border border-primary/20 px-4 py-2">星曜 + 宮位</td>
              <td className="border border-primary/20 px-4 py-2">天干地支</td>
              <td className="border border-primary/20 px-4 py-2">行星 + 星座</td>
            </tr>
            <tr className="bg-cream/50">
              <td className="border border-primary/20 px-4 py-2">宮位數</td>
              <td className="border border-primary/20 px-4 py-2">12 宮</td>
              <td className="border border-primary/20 px-4 py-2">-</td>
              <td className="border border-primary/20 px-4 py-2">12 宮</td>
            </tr>
            <tr>
              <td className="border border-primary/20 px-4 py-2">特色</td>
              <td className="border border-primary/20 px-4 py-2">視覺化命盤</td>
              <td className="border border-primary/20 px-4 py-2">五行生剋</td>
              <td className="border border-primary/20 px-4 py-2">行星相位</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="font-serif text-xl text-primary/80">紫微斗數的特點</h3>
      <ul>
        <li>命盤直觀易讀，十二宮清晰呈現人生各面向</li>
        <li>星曜有明確的象徵意義，易於理解</li>
        <li>可以看大限、流年，預測人生不同階段的運勢</li>
        <li>對時辰要求較高，出生時間越精準命盤越準確</li>
      </ul>
    </article>
  )
}

function PalacesContent() {
  const palaces = [
    { name: '命宮', desc: '代表自己，性格特質、外在形象、人生態度', keywords: '自我、個性、長相' },
    { name: '兄弟宮', desc: '兄弟姐妹關係、同事朋友、合作夥伴', keywords: '手足、同儕、合作' },
    { name: '夫妻宮', desc: '感情關係、婚姻狀況、另一半特質', keywords: '婚姻、戀愛、伴侶' },
    { name: '子女宮', desc: '子女關係、子女狀況、也代表性生活', keywords: '子女、下屬、創作' },
    { name: '財帛宮', desc: '賺錢能力、理財方式、金錢觀', keywords: '收入、財運、用錢' },
    { name: '疾厄宮', desc: '健康狀況、體質、容易發生的疾病', keywords: '健康、體質、災厄' },
    { name: '遷移宮', desc: '外出運、旅行、異地發展、社會緣分', keywords: '出外、旅遊、異地' },
    { name: '交友宮', desc: '人際關係、朋友類型、部下緣分', keywords: '朋友、人緣、社交' },
    { name: '官祿宮', desc: '事業運、工作類型、社會地位', keywords: '事業、工作、成就' },
    { name: '田宅宮', desc: '不動產、家庭環境、居住狀況', keywords: '房產、家庭、祖業' },
    { name: '福德宮', desc: '精神生活、興趣嗜好、內心世界', keywords: '精神、福氣、享受' },
    { name: '父母宮', desc: '父母關係、長輩緣分、上司運', keywords: '父母、長輩、上司' },
  ]

  return (
    <article className="prose prose-lg max-w-none">
      <h2 className="font-serif text-2xl text-primary">十二宮位詳解</h2>
      <p>
        紫微斗數的命盤由十二個宮位組成，每個宮位代表人生的不同面向。
        宮位固定不變，但落入的星曜會因為出生時間不同而變化。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
        {palaces.map((palace) => (
          <div
            key={palace.name}
            className="bg-cream rounded-lg p-4 border border-primary/10"
          >
            <h3 className="font-serif text-lg text-primary mb-2">{palace.name}</h3>
            <p className="text-sm text-ink/70 mb-2">{palace.desc}</p>
            <p className="text-xs text-ink/50">關鍵詞：{palace.keywords}</p>
          </div>
        ))}
      </div>

      <h3 className="font-serif text-xl text-primary/80 mt-8">三方四正</h3>
      <p>
        解讀命盤時，不只看單一宮位，還要參考「三方四正」：
      </p>
      <ul>
        <li><strong>三方</strong>：本宮 + 相隔四宮的兩個宮位（如命宮的三方是命宮、財帛、官祿）</li>
        <li><strong>四正</strong>：三方 + 對宮（如命宮的對宮是遷移宮）</li>
      </ul>
    </article>
  )
}

function StarsContent() {
  const mainStars = [
    { name: '紫微', nature: '帝王星', keywords: '領導、尊貴、理想主義', desc: '紫微為帝星，代表領導力、尊貴、高傲，有主見但可能過於理想化' },
    { name: '天機', nature: '智慧星', keywords: '聰明、謀略、善變', desc: '天機為智星，聰明機智、善於謀略，但可能想太多、較神經質' },
    { name: '太陽', nature: '光明星', keywords: '熱情、付出、博愛', desc: '太陽代表光明、熱情，樂於付出、有責任感，但可能過於燃燒自己' },
    { name: '武曲', nature: '財星', keywords: '務實、財富、剛毅', desc: '武曲為財星，務實剛毅、重視物質，行動力強但可能過於功利' },
    { name: '天同', nature: '福星', keywords: '溫和、享受、懶散', desc: '天同代表福氣、享受，個性溫和樂觀，但可能缺乏進取心' },
    { name: '廉貞', nature: '囚星', keywords: '複雜、才藝、感情', desc: '廉貞為囚星，情感複雜、有才藝，但可能執著於感情或有桃花' },
    { name: '天府', nature: '財庫星', keywords: '穩重、保守、物質', desc: '天府為庫星，穩重保守、善於守財，但可能過於保守不願冒險' },
    { name: '太陰', nature: '富星', keywords: '溫柔、財富、陰性', desc: '太陰代表財富與陰柔，細膩敏感、有藝術天分，但可能多愁善感' },
    { name: '貪狼', nature: '桃花星', keywords: '慾望、才華、多變', desc: '貪狼代表慾望與才華，多才多藝、善社交，但可能貪心不專一' },
    { name: '巨門', nature: '暗星', keywords: '口才、是非、分析', desc: '巨門主口舌是非，分析力強、能言善辯，但可能招惹口舌糾紛' },
    { name: '天相', nature: '印星', keywords: '服務、貴人、依附', desc: '天相代表印信，善於服務、有貴人緣，但可能過於依賴他人' },
    { name: '天梁', nature: '蔭星', keywords: '長壽、庇蔭、清高', desc: '天梁為蔭星，有長輩緣、逢凶化吉，但可能過於清高、好為人師' },
    { name: '七殺', nature: '將星', keywords: '魄力、冒險、孤獨', desc: '七殺為將星，有魄力、敢冒險，但可能孤獨、行事較極端' },
    { name: '破軍', nature: '耗星', keywords: '開創、變動、破壞', desc: '破軍主變動，有開創力、不安於現狀，但可能先破後立、動盪不定' },
  ]

  return (
    <article className="prose prose-lg max-w-none">
      <h2 className="font-serif text-2xl text-primary">十四主星詳解</h2>
      <p>
        紫微斗數有十四顆主星，是解讀命盤最重要的依據。每顆主星都有獨特的象徵意義和性格特質。
      </p>

      <div className="not-prose space-y-4">
        {mainStars.map((star) => (
          <div
            key={star.name}
            className="bg-cream rounded-lg p-4 border border-primary/10"
          >
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-serif text-xl text-primary">{star.name}</h3>
              <span className="text-sm bg-gold/20 text-gold-dark px-2 py-0.5 rounded">
                {star.nature}
              </span>
            </div>
            <p className="text-ink/70 mb-2">{star.desc}</p>
            <p className="text-xs text-ink/50">關鍵詞：{star.keywords}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

function TransformationsContent() {
  return (
    <article className="prose prose-lg max-w-none">
      <h2 className="font-serif text-2xl text-primary">四化星</h2>
      <p>
        四化星是紫微斗數中非常重要的概念，它們會「附著」在主星或輔星上，改變該星的能量表現。
        四化由出生年的天干決定，每個天干對應固定的四化組合。
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h3 className="font-serif text-xl text-green-700 mb-2">化祿</h3>
          <p className="text-sm text-green-600 mb-2">代表：福氣、順利、增加</p>
          <p className="text-sm text-ink/70">
            化祿是最吉利的四化，代表該星的能量被放大、順利發展。
            化祿在財帛宮表示財運佳，在官祿宮表示事業順利。
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h3 className="font-serif text-xl text-orange-700 mb-2">化權</h3>
          <p className="text-sm text-orange-600 mb-2">代表：權力、掌控、積極</p>
          <p className="text-sm text-ink/70">
            化權代表該星具有主導權、控制力。
            化權在命宮表示有領導慾，在官祿宮表示在工作上有實權。
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-serif text-xl text-blue-700 mb-2">化科</h3>
          <p className="text-sm text-blue-600 mb-2">代表：名聲、考試、貴人</p>
          <p className="text-sm text-ink/70">
            化科代表該星帶來好名聲、學業運、貴人緣。
            化科在命宮表示氣質出眾，在官祿宮表示專業受肯定。
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <h3 className="font-serif text-xl text-red-700 mb-2">化忌</h3>
          <p className="text-sm text-red-600 mb-2">代表：阻礙、執著、課題</p>
          <p className="text-sm text-ink/70">
            化忌代表該星的能量受阻、需要面對的課題。
            化忌不一定是壞事，而是指出此生需要學習的功課。
          </p>
        </div>
      </div>

      <h3 className="font-serif text-xl text-primary/80">四化速查表</h3>
      <div className="not-prose overflow-x-auto my-4">
        <table className="w-full border-collapse border border-primary/20">
          <thead>
            <tr className="bg-cream">
              <th className="border border-primary/20 px-4 py-2 text-left">年干</th>
              <th className="border border-primary/20 px-4 py-2 text-left text-green-700">化祿</th>
              <th className="border border-primary/20 px-4 py-2 text-left text-orange-700">化權</th>
              <th className="border border-primary/20 px-4 py-2 text-left text-blue-700">化科</th>
              <th className="border border-primary/20 px-4 py-2 text-left text-red-700">化忌</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border border-primary/20 px-4 py-2 font-medium">甲</td><td className="border border-primary/20 px-4 py-2">廉貞</td><td className="border border-primary/20 px-4 py-2">破軍</td><td className="border border-primary/20 px-4 py-2">武曲</td><td className="border border-primary/20 px-4 py-2">太陽</td></tr>
            <tr className="bg-cream/50"><td className="border border-primary/20 px-4 py-2 font-medium">乙</td><td className="border border-primary/20 px-4 py-2">天機</td><td className="border border-primary/20 px-4 py-2">天梁</td><td className="border border-primary/20 px-4 py-2">紫微</td><td className="border border-primary/20 px-4 py-2">太陰</td></tr>
            <tr><td className="border border-primary/20 px-4 py-2 font-medium">丙</td><td className="border border-primary/20 px-4 py-2">天同</td><td className="border border-primary/20 px-4 py-2">天機</td><td className="border border-primary/20 px-4 py-2">文昌</td><td className="border border-primary/20 px-4 py-2">廉貞</td></tr>
            <tr className="bg-cream/50"><td className="border border-primary/20 px-4 py-2 font-medium">丁</td><td className="border border-primary/20 px-4 py-2">太陰</td><td className="border border-primary/20 px-4 py-2">天同</td><td className="border border-primary/20 px-4 py-2">天機</td><td className="border border-primary/20 px-4 py-2">巨門</td></tr>
            <tr><td className="border border-primary/20 px-4 py-2 font-medium">戊</td><td className="border border-primary/20 px-4 py-2">貪狼</td><td className="border border-primary/20 px-4 py-2">太陰</td><td className="border border-primary/20 px-4 py-2">右弼</td><td className="border border-primary/20 px-4 py-2">天機</td></tr>
            <tr className="bg-cream/50"><td className="border border-primary/20 px-4 py-2 font-medium">己</td><td className="border border-primary/20 px-4 py-2">武曲</td><td className="border border-primary/20 px-4 py-2">貪狼</td><td className="border border-primary/20 px-4 py-2">天梁</td><td className="border border-primary/20 px-4 py-2">文曲</td></tr>
            <tr><td className="border border-primary/20 px-4 py-2 font-medium">庚</td><td className="border border-primary/20 px-4 py-2">太陽</td><td className="border border-primary/20 px-4 py-2">武曲</td><td className="border border-primary/20 px-4 py-2">太陰</td><td className="border border-primary/20 px-4 py-2">天同</td></tr>
            <tr className="bg-cream/50"><td className="border border-primary/20 px-4 py-2 font-medium">辛</td><td className="border border-primary/20 px-4 py-2">巨門</td><td className="border border-primary/20 px-4 py-2">太陽</td><td className="border border-primary/20 px-4 py-2">文曲</td><td className="border border-primary/20 px-4 py-2">文昌</td></tr>
            <tr><td className="border border-primary/20 px-4 py-2 font-medium">壬</td><td className="border border-primary/20 px-4 py-2">天梁</td><td className="border border-primary/20 px-4 py-2">紫微</td><td className="border border-primary/20 px-4 py-2">左輔</td><td className="border border-primary/20 px-4 py-2">武曲</td></tr>
            <tr className="bg-cream/50"><td className="border border-primary/20 px-4 py-2 font-medium">癸</td><td className="border border-primary/20 px-4 py-2">破軍</td><td className="border border-primary/20 px-4 py-2">巨門</td><td className="border border-primary/20 px-4 py-2">太陰</td><td className="border border-primary/20 px-4 py-2">貪狼</td></tr>
          </tbody>
        </table>
      </div>
    </article>
  )
}

function HowToContent() {
  return (
    <article className="prose prose-lg max-w-none">
      <h2 className="font-serif text-2xl text-primary">如何看懂自己的命盤</h2>

      <h3 className="font-serif text-xl text-primary/80">第一步：找到命宮主星</h3>
      <p>
        命宮是整張命盤的核心，代表你的基本性格和人生態度。
        首先看命宮裡有哪些主星，這些主星就是你最核心的性格特質。
      </p>
      <ul>
        <li>如果命宮有紫微：你可能有領導氣質、追求完美</li>
        <li>如果命宮有太陽：你可能熱情外向、樂於付出</li>
        <li>如果命宮是空宮：需要看對宮（遷移宮）的主星</li>
      </ul>

      <h3 className="font-serif text-xl text-primary/80">第二步：觀察三方四正</h3>
      <p>
        不要只看單一宮位，要看命宮的「三方四正」：
      </p>
      <ul>
        <li><strong>命宮</strong>：自我本質</li>
        <li><strong>財帛宮</strong>：賺錢能力（三方）</li>
        <li><strong>官祿宮</strong>：事業表現（三方）</li>
        <li><strong>遷移宮</strong>：外在發展（對宮）</li>
      </ul>
      <p>
        這四個宮位的星曜要一起看，才能完整了解你的整體格局。
      </p>

      <h3 className="font-serif text-xl text-primary/80">第三步：注意四化星</h3>
      <p>
        找到你命盤中的四化星（化祿、化權、化科、化忌），看它們落在哪些宮位：
      </p>
      <ul>
        <li>化祿落在哪裡，那個領域通常較順利</li>
        <li>化忌落在哪裡，那個領域是此生的課題</li>
      </ul>

      <h3 className="font-serif text-xl text-primary/80">第四步：了解大限流年</h3>
      <p>
        紫微斗數可以看不同人生階段的運勢：
      </p>
      <ul>
        <li><strong>大限</strong>：每十年一個大運（根據五行局不同，起運年齡不同）</li>
        <li><strong>流年</strong>：每一年的運勢變化</li>
        <li><strong>流月、流日</strong>：更細節的運勢（進階用法）</li>
      </ul>

      <h3 className="font-serif text-xl text-primary/80">常見問題</h3>
      <dl>
        <dt><strong>Q: 命盤中有煞星是不是不好？</strong></dt>
        <dd>A: 不一定。煞星（如七殺、破軍）代表的是能量強、變動大，善用可以成為開創的動力。</dd>

        <dt><strong>Q: 空宮怎麼看？</strong></dt>
        <dd>A: 空宮要看對宮的主星，並參考該宮的輔星和雜曜。</dd>

        <dt><strong>Q: 命盤可以改變嗎？</strong></dt>
        <dd>A: 命盤顯示的是傾向，不是定數。了解自己的優缺點，可以趨吉避凶、揚長避短。</dd>
      </dl>
    </article>
  )
}
