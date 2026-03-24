import { useTranslation } from 'react-i18next'
import type { Chart, Palace } from '../../types'
import { PalaceCell } from './PalaceCell'
import { ChartCenter } from './ChartCenter'

interface ChartGridProps {
  chart: Chart
}

/**
 * The traditional Zi Wei Dou Shu chart layout:
 *
 *     巳(4)   午(5)   未(6)   申(7)
 *     辰(3)   [CENTER INFO]   酉(8)
 *     卯(2)   [CENTER INFO]   戌(9)
 *     寅(1)   丑(12)  子(11)  亥(10)
 *
 * Position mapping (1-12 clockwise from 寅):
 * Top row: 4, 5, 6, 7
 * Middle rows: 3, center, center, 8
 *              2, center, center, 9
 * Bottom row: 1, 12, 11, 10
 */
export function ChartGrid({ chart }: ChartGridProps) {
  const { t } = useTranslation()

  // Get palace by position (1-12)
  const getPalace = (position: number): Palace | undefined => {
    return chart.palaces.find(p => p.position === position)
  }

  // Layout positions for the grid
  const gridLayout = [
    // Row 1 (top): positions 4, 5, 6, 7
    [4, 5, 6, 7],
    // Row 2: position 3, center, center, 8
    [3, 'center-tl', 'center-tr', 8],
    // Row 3: position 2, center, center, 9
    [2, 'center-bl', 'center-br', 9],
    // Row 4 (bottom): positions 1, 12, 11, 10
    [1, 12, 11, 10],
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
