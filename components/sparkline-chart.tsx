"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface SparklineChartProps {
  data: number[]
  color?: string
}

export default function SparklineChart({ data, color = "#0ea5e9" }: SparklineChartProps) {
  // Convert data to format required by recharts
  const chartData = data.map((value, index) => ({ value }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={true} />
      </LineChart>
    </ResponsiveContainer>
  )
}
