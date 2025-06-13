"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { sectors, monthNames } from "@/lib/data-utils"

interface VarianceHeatmapProps {
  onCellClick: (cellData: any) => void
}

export default function VarianceHeatmap({ onCellClick }: VarianceHeatmapProps) {
  // Generate mock data for the heatmap
  const generateHeatmapData = () => {
    const data = []
    const currentMonth = new Date().getMonth()

    for (const sector of sectors) {
      const sectorData = { sector }

      for (let i = 0; i < 6; i++) {
        // Ensure monthIndex is always between 0-11
        let monthIndex = (currentMonth - 5 + i) % 12
        if (monthIndex < 0) monthIndex += 12 // Handle negative values

        // Make sure we have a valid month name before calling substring
        const monthName = monthNames[monthIndex] || ""
        const month = monthName.substring(0, 3)

        // Generate a variance value between -30 and +30 percent
        const variance = Math.floor(Math.random() * 60) - 30
        sectorData[month] = variance
      }

      data.push(sectorData)
    }

    return data
  }

  const [heatmapData] = useState(generateHeatmapData())

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

  // Get the last 6 months
  const getMonths = () => {
    const currentMonth = new Date().getMonth()
    const months = []

    for (let i = 0; i < 6; i++) {
      // Ensure monthIndex is always between 0-11
      let monthIndex = (currentMonth - 5 + i) % 12
      if (monthIndex < 0) monthIndex += 12 // Handle negative values

      // Make sure we have a valid month name before calling substring
      const monthName = monthNames[monthIndex] || ""
      months.push(monthName.substring(0, 3))
    }

    return months
  }

  const months = getMonths()

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="border p-2 bg-muted/50 sticky left-0 z-10">Sector / Month</th>
            {months.map((month) => (
              <th key={month} className="border p-2 bg-muted/50 whitespace-nowrap">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {heatmapData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-2 font-medium bg-muted/50 sticky left-0 z-10">{row.sector}</td>
              {months.map((month) => (
                <td
                  key={month}
                  className={cn(
                    "border p-2 text-center cursor-pointer transition-colors hover:opacity-80",
                    getColorByValue(row[month]),
                  )}
                  onClick={() =>
                    onCellClick({
                      sector: row.sector,
                      month,
                      variance: row[month],
                    })
                  }
                >
                  {row[month] > 0 ? "+" : ""}
                  {row[month]}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
