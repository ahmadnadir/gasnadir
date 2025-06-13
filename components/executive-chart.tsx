"use client"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", actual: 12500, budget: 11000 },
  { month: "Feb", actual: 13200, budget: 12500 },
  { month: "Mar", actual: 14100, budget: 13000 },
  { month: "Apr", actual: 13800, budget: 13500 },
  { month: "May", actual: 13000, budget: 13400 },
  { month: "Jun", actual: 0, budget: 13800, forecast: 14200 },
  { month: "Jul", actual: 0, budget: 14000, forecast: 14500 },
]

export default function ExecutiveChart() {
  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <YAxis hide />
          <Tooltip
            formatter={(value) => [`${value.toLocaleString()} GJ`, ""]}
            labelFormatter={(label) => `${label} 2025`}
            contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px" }}
          />
          <Bar dataKey="budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Budget" />
          <Bar dataKey="actual" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Actual" />
          <Bar
            dataKey="forecast"
            fill="#93c5fd"
            radius={[4, 4, 0, 0]}
            name="Forecast"
            strokeDasharray="3 3"
            stroke="#0ea5e9"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
