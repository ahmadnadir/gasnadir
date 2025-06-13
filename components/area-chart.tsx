"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { monthNames } from "@/lib/data-utils"

export default function AreaChartComponent() {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()

  // Generate data with last 12 months
  const data = []

  for (let i = 0; i < 12; i++) {
    // Ensure monthIndex is always between 0-11
    let monthIndex = (currentMonth - 11 + i) % 12
    if (monthIndex < 0) monthIndex += 12 // Handle negative values

    // Make sure we have a valid month name before calling substring
    const monthName = monthNames[monthIndex] || ""
    const month = monthName.substring(0, 3)

    // Generate some trends - increasing for sectors
    const rubberVolume = 3000 + Math.floor(Math.random() * 500) + i * 200
    const oleoVolume = 2000 + Math.floor(Math.random() * 400) + i * 100
    const consumerVolume = 1500 + Math.floor(Math.random() * 300) + i * 150
    const otherVolume = 3000 + Math.floor(Math.random() * 600) + i * 50

    data.push({
      month,
      Rubber: rubberVolume,
      Oleochemical: oleoVolume,
      Consumer: consumerVolume,
      Other: otherVolume,
      Total: rubberVolume + oleoVolume + consumerVolume + otherVolume,
    })
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value.toLocaleString()} GJ`, ""]} />
        <Area type="monotone" dataKey="Rubber" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" />
        <Area type="monotone" dataKey="Oleochemical" stackId="1" stroke="#6366f1" fill="#6366f1" />
        <Area type="monotone" dataKey="Consumer" stackId="1" stroke="#10b981" fill="#10b981" />
        <Area type="monotone" dataKey="Other" stackId="1" stroke="#f97316" fill="#f97316" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
