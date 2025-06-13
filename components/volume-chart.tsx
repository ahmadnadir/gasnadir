"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { areas, sectors, segments } from "@/lib/data-utils"

// Mock data generator based on dimension
const generateChartData = (dimension: string) => {
  let categories: string[] = []

  if (dimension === "area") {
    categories = areas
  } else if (dimension === "sector") {
    categories = sectors.slice(0, 4) // Limit to 4 sectors for clarity
  } else {
    categories = segments
  }

  // Generate monthly data for the past 12 months
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()

  return months.map((month, i) => {
    const monthIndex = (currentMonth - 11 + i) % 12
    const displayMonth = months[monthIndex]

    const result: any = {
      month: displayMonth,
      actual: 0,
      budget: 0,
      forecast: 0,
      previousYear: 0,
    }

    // Add data for each category
    categories.forEach((category) => {
      // Generate some trends
      let baseValue = 1000 + Math.random() * 500

      // Add some seasonality
      baseValue += Math.sin((i / 12) * Math.PI * 2) * 200

      // Add trend
      baseValue += i * 50

      // Add category-specific data
      result[category] = Math.floor(baseValue + Math.random() * 300)

      // Sum up for totals
      result.actual += result[category]
    })

    // Generate budget, forecast and previous year data
    result.budget = Math.floor(result.actual * (0.9 + Math.random() * 0.2))
    result.previousYear = Math.floor(result.actual * (0.8 + Math.random() * 0.15))

    // Only add forecast for future months
    if (i > currentMonth) {
      result.forecast = Math.floor(result.budget * (0.95 + Math.random() * 0.2))
    } else {
      result.forecast = 0
    }

    return result
  })
}

export default function VolumeChart({ dimension, timeFrame }: { dimension: string; timeFrame: string }) {
  const data = generateChartData(dimension)

  // Format numbers for tooltip and axis
  const formatNumber = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`
    }
    return value
  }

  // Custom tooltip formatter
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-sm p-3">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => {
            // Skip rendering if value is 0
            if (entry.value === 0) return null

            return (
              <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}: </span>
                <span className="font-medium">{new Intl.NumberFormat("en-US").format(entry.value)} GJ</span>
              </div>
            )
          })}
        </div>
      )
    }

    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={formatNumber} />
        <Tooltip content={customTooltip} />
        <Legend />
        <ReferenceLine y={0} stroke="#666" />
        <Line type="monotone" dataKey="actual" name="Actual" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="budget" name="Budget" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
        <Line
          type="monotone"
          dataKey="forecast"
          name="Forecast"
          stroke="#8b5cf6"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="previousYear"
          name="Previous Year"
          stroke="#94a3b8"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
