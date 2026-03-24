import { useTranslation } from 'react-i18next'
import type { Chart, Palace } from '../../types'
import { PalaceCell } from './PalaceCell'
import { ChartCenter } from './ChartCenter'

interface ChartGridProps {
  chart: Chart
}

/**
 * The traditional Zi Wei Dou Shu chart layout:
 * Using earthly branch indices (0-based): 子=0, 丑=1, 寅=2, ...
 *
 *     巳(5)   午(6)   未(7)   申(8)
 *     辰(4)   [CENTER INFO]   酉(9)
 *     卯(3)   [CENTER INFO]   戌(10)
 *     寅(2)   丑(1)   子(0)   亥(11)
 */
export function ChartGrid({ chart }: ChartGridProps) {
  const { t } = useTranslation()

  // Get palace by position (0-11 earthly branch index)
  const getPalace = (position: number): Palace | undefined => {
    return chart.palaces.find(p => p.position === position)
  }

  // Layout positions for the grid (earthly branch indices 0-11)
  const gridLayout = [
    // Row 1 (top): 巳午未申
    [5, 6, 7, 8],
    // Row 2: 辰, center, center, 酉
    [4, 'center-tl', 'center-tr', 9],
    // Row 3: 卯, center, center, 戌
    [3, 'center-bl', 'center-br', 10],
    // Row 4 (bottom): 寅丑子亥
    [2, 1, 0, 11],
  ]

  const isLifePalace = (position: number) => position === chart.lifePalacePosition
  const isBodyPalace = (position: number) => position === chart.bodyPalacePosition

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-4 gap-0.5 bg-primary/20 p-0.5 rounded-lg">
        {gridLayout.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            if (typeof cell === 'string' && cell.startsWith('center')) {
              // Render center cells (merged into one component)
              if (cell === 'center-tl') {
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="col-span-2 row-span-2 bg-cream-dark"
                  >
                    <ChartCenter chart={chart} />
                  </div>
                )
              }
              // Skip other center cells as they're part of the merged cell
              return null
            }

            const position = cell as number
            const palace = getPalace(position)

            if (!palace) return null

            return (
              <PalaceCell
                key={`${rowIndex}-${colIndex}`}
                palace={palace}
                isLifePalace={isLifePalace(position)}
                isBodyPalace={isBodyPalace(position)}
              />
            )
          })
        ))}
      </div>
    </div>
  )
}
