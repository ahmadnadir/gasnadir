"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface ConfidenceGaugeProps {
  value: number // 0-100
}

export default function ConfidenceGauge({ value }: ConfidenceGaugeProps) {
  // Calculate the remaining percentage
  const remaining = 100 - value

  // Data for the gauge
  const data = [
    { name: "Confidence", value: value },
    { name: "Remaining", value: remaining },
  ]

  // Colors for the gauge
  const COLORS = ["#0ea5e9", "#e2e8f0"]

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-2xl font-medium">{value}%</div>
      </div>
    </div>
  )
}
