"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import SparklineChart from "@/components/sparkline-chart"

interface InsightCardProps {
  title: string
  icon: string
  trend: "up" | "down" | "stable"
  value: number
  description: string
  data: number[]
}

export default function InsightCard({ title, icon, trend, value, description, data }: InsightCardProps) {
  const getTrendColor = (trend: string, value: number) => {
    if (trend === "up" && value > 0) return "text-green-600"
    if (trend === "down" && value < 0) return "text-red-600"
    return "text-gray-600"
  }

  const trendColor = getTrendColor(trend, value)

  return (
    <Card className="flex-shrink-0 w-80 border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h3 className="font-medium">{title}</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Flag className="h-4 w-4" />
            <span className="sr-only">Flag</span>
          </Button>
        </div>

        <div className="h-16 mb-3">
          <SparklineChart data={data} color={trend === "up" ? "#16a34a" : "#dc2626"} />
        </div>

        <p className="text-sm">
          <span className={cn("font-medium", trendColor)}>
            {value > 0 ? "+" : ""}
            {value}%
          </span>{" "}
          {description.split(value.toString())[1]}
        </p>
      </CardContent>
    </Card>
  )
}
