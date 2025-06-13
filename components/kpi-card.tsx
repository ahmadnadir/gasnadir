"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import SparklineChart from "@/components/sparkline-chart"

interface KpiCardProps {
  title: string
  value: string
  unit: string
  change: number
  trend: "up" | "down" | "stable"
  comparison: string
}

export default function KpiCard({ title, value, unit, change, trend, comparison }: KpiCardProps) {
  const [showChart, setShowChart] = useState(false)

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const trendColor = getTrendColor(trend)
  const trendIcon = getTrendIcon(trend)

  // Generate mock data for sparkline
  const generateSparklineData = () => {
    const data = []
    for (let i = 0; i < 10; i++) {
      if (trend === "up") {
        data.push(3 + Math.random() * 2 + i * 0.3)
      } else if (trend === "down") {
        data.push(8 - Math.random() * 2 - i * 0.3)
      } else {
        data.push(5 + Math.random() * 2 - 1)
      }
    }
    return data
  }

  return (
    <Card
      className={cn(
        "border shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden",
        showChart ? "bg-muted/10" : "",
      )}
      onClick={() => setShowChart(!showChart)}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-medium">{value}</div>
            <div className="text-sm">{unit}</div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{comparison}</span>
            <span className={cn("text-sm font-medium flex items-center gap-0.5", trendColor)}>
              {change > 0 ? "+" : ""}
              {change}%{trendIcon}
            </span>
          </div>
        </div>

        {showChart && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t"
          >
            <div className="h-24">
              <SparklineChart data={generateSparklineData()} color={trend === "up" ? "#16a34a" : "#dc2626"} />
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
