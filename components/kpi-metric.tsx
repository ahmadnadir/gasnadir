"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BarChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface KpiMetricProps {
  title: string
  value: string
  comparison: string
  change?: number
  status: "positive" | "negative" | "neutral"
  pulsing?: boolean
  chart?: React.ReactNode
}

export default function KpiMetric({
  title,
  value,
  comparison,
  change,
  status,
  pulsing = false,
  chart,
}: KpiMetricProps) {
  const [showChart, setShowChart] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const statusColor = getStatusColor(status)
  const statusIcon = getStatusIcon(status)

  return (
    <Card
      className={cn(
        "border-0 shadow-none hover:bg-muted/20 transition-colors cursor-pointer overflow-hidden",
        showChart ? "bg-muted/20" : "bg-transparent",
      )}
      onClick={() => setShowChart(!showChart)}
    >
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-medium">{value}</div>
            {pulsing && status === "negative" && (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
                className="w-3 h-3 rounded-full bg-red-500"
              />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">{comparison}</span>
            {change !== undefined && (
              <span className={cn("text-sm font-medium flex items-center gap-0.5", statusColor)}>
                {change > 0 ? "+" : ""}
                {change.toFixed(1)}%{statusIcon}
              </span>
            )}
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
            {chart ? (
              chart
            ) : (
              <div className="flex items-center justify-center h-32 bg-muted/20 rounded-md">
                <div className="flex flex-col items-center text-muted-foreground">
                  <BarChart className="h-8 w-8 mb-2" />
                  <span className="text-sm">Full chart view</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
