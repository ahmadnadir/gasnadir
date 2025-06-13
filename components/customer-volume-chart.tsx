"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { TimeSeriesData } from "@/lib/customer-utils"

interface CustomerVolumeChartProps {
  data: TimeSeriesData[]
}

export default function CustomerVolumeChart({ data }: CustomerVolumeChartProps) {
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
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={formatNumber} />
        <Tooltip content={customTooltip} />
        <Legend />
        <Bar dataKey="actual" name="Actual" fill="#0ea5e9" barSize={20} />
        <Bar dataKey="budget" name="Budget" fill="#10b981" barSize={20} />
        <Line
          type="monotone"
          dataKey="forecast"
          name="Forecast"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
