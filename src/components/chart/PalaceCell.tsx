import { useTranslation } from 'react-i18next'
import type { Palace, Star } from '../../types'

interface PalaceCellProps {
  palace: Palace
  isLifePalace: boolean
  isBodyPalace: boolean
}

export function PalaceCell({ palace, isLifePalace, isBodyPalace }: PalaceCellProps) {
  const { t } = useTranslation()

  return (
    <div
      className={`
        relative bg-cream p-2 min-h-[140px] md:min-h-[160px]
        border border-primary/10
        ${isLifePalace ? 'ring-2 ring-primary ring-inset' : ''}
        ${isBodyPalace && !isLifePalace ? 'ring-2 ring-gold ring-inset' : ''}
      `}
    >
      {/* Palace Header */}
      <div className="flex justify-between items-start mb-1">
        <div className="flex flex-col">
          <span className="text-xs text-ink/50">{palace.stem}{palace.branch}</span>
          {/* Decadal (大限) range */}
          {palace.decadal && (
            <span className="text-[9px] text-ink/40">
              {palace.decadal.range[0]}-{palace.decadal.range[1]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isLifePalace && (
            <span className="text-[10px] bg-primary text-cream px-1 rounded">命</span>
          )}
          {isBodyPalace && (
            <span className="text-[10px] bg-gold text-ink px-1 rounded">身</span>
          )}
        </div>
      </div>

      {/* Palace Name */}
      <div className="text-center mb-2">
        <span className="font-serif text-sm font-medium text-primary">
          {palace.name}
        </span>
      </div>

      {/* Stars */}
      <div className="space-y-1">
        {/* Main Stars */}
        {palace.mainStars.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {palace.mainStars.map((star, index) => (
              <StarBadge key={index} star={star} type="main" />
            ))}
          </div>
        )}

        {/* Auxiliary Stars */}
        {palace.auxiliaryStars.length > 0 && (
          <div className="flex flex-wrap gap-0.5 justify-center">
            {palace.auxiliaryStars.map((star, index) => (
              <StarBadge key={index} star={star} type="auxiliary" />
            ))}
          </div>
        )}

        {/* Harmful Stars */}
        {palace.harmfulStars.length > 0 && (
          <div className="flex flex-wrap gap-0.5 justify-center">
            {palace.harmfulStars.map((star, index) => (
              <StarBadge key={index} star={star} type="harmful" />
            ))}
          </div>
        )}

        {/* Misc Stars (smaller) */}
        {palace.miscStars.length > 0 && (
          <div className="flex flex-wrap gap-0.5 justify-center">
            {palace.miscStars.map((star, index) => (
              <StarBadge key={index} star={star} type="misc" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface StarBadgeProps {
  star: Star
  type: 'main' | 'auxiliary' | 'harmful' | 'misc'
}

function StarBadge({ star, type }: StarBadgeProps) {
  const typeStyles = {
    main: 'text-primary font-medium text-sm',
    auxiliary: 'text-blue-600 text-xs',
    harmful: 'text-red-600 text-xs',
    misc: 'text-ink/60 text-[10px]',
  }

  const transformationStyles = {
    '化祿': 'text-green-600',
    '化權': 'text-orange-600',
    '化科': 'text-blue-600',
    '化忌': 'text-red-600',
  }

  const transformationSymbols = {
    '化祿': '祿',
    '化權': '權',
    '化科': '科',
    '化忌': '忌',
  }

  // Brightness symbols (亮度)
  const brightnessSymbols: Record<string, string> = {
    '廟': '廟',
    '旺': '旺',
    '得': '得',
    '利': '利',
    '平': '',
    '不': '不',
    '陷': '陷',
  }

  const brightnessStyles: Record<string, string> = {
    '廟': 'text-amber-600',
    '旺': 'text-amber-500',
    '得': 'text-green-600',
    '利': 'text-green-500',
    '平': 'text-ink/40',
    '不': 'text-ink/40',
    '陷': 'text-red-400',
  }

  return (
    <span className={`${typeStyles[type]} whitespace-nowrap`}>
      {star.name}
      {star.brightness && brightnessSymbols[star.brightness] && (
        <sub className={`ml-0.5 text-[9px] ${brightnessStyles[star.brightness] || ''}`}>
          {brightnessSymbols[star.brightness]}
        </sub>
      )}
      {star.transformation && (
        <sup className={`ml-0.5 ${transformationStyles[star.transformation]}`}>
          {transformationSymbols[star.transformation]}
        </sup>
      )}
    </span>
  )
}
