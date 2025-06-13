"use client"

import { areas, sectors } from "@/lib/data-utils"

export default function HeatmapChart() {
  // Generate mock data for the heatmap
  const heatmapData = []

  for (const area of areas) {
    const areaData = { area }

    for (const sector of sectors) {
      // Generate a variance value between -30 and +30 percent
      const variance = Math.floor(Math.random() * 60) - 30
      areaData[sector] = variance
    }

    heatmapData.push(areaData)
  }

  const getColorByValue = (value: number) => {
    if (value > 20) return "bg-green-600 text-white"
    if (value > 10) return "bg-green-500 text-white"
    if (value > 5) return "bg-green-400 text-white"
    if (value > 0) return "bg-green-300"
    if (value > -5) return "bg-red-300"
    if (value > -10) return "bg-red-400 text-white"
    if (value > -20) return "bg-red-500 text-white"
    return "bg-red-600 text-white"
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="border p-2 bg-muted/50">Area / Sector</th>
            {sectors.map((sector) => (
              <th key={sector} className="border p-2 bg-muted/50 whitespace-nowrap">
                {sector}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {heatmapData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-2 font-medium bg-muted/50">{row.area}</td>
              {sectors.map((sector) => (
                <td key={sector} className={`border p-2 text-center ${getColorByValue(row[sector])}`}>
                  {row[sector] > 0 ? "+" : ""}
                  {row[sector]}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
