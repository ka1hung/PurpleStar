import { useTranslation } from 'react-i18next'
import { masterList } from '../../data/prompts'
import type { MasterType } from '../../types'

interface MasterSelectorProps {
  selectedMaster: MasterType
  onSelect: (master: MasterType) => void
}

export function MasterSelector({ selectedMaster, onSelect }: MasterSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {masterList.map((master) => (
        <button
          key={master.id}
          onClick={() => onSelect(master.id)}
          className={`
            p-4 rounded-lg border-2 transition-all text-left
            ${
              selectedMaster === master.id
                ? 'border-primary bg-primary/10'
                : 'border-primary/10 bg-white hover:border-primary/30'
            }
          `}
        >
          <div className="text-3xl mb-2">{master.avatar}</div>
          <div className="font-serif text-sm font-medium text-primary">
            {t(master.nameKey)}
          </div>
          <div className="text-xs text-ink/60 mt-1">
            {t(master.descKey)}
          </div>
        </button>
      ))}
    </div>
  )
}
