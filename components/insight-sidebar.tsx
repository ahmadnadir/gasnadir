"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, AlertCircle, TrendingUp, TrendingDown, Lightbulb, BarChart } from "lucide-react"
import { motion } from "framer-motion"

interface InsightSidebarProps {
  onClose: () => void
  filters: {
    area: string
    sector: string
    segment: string
    timeFrame: string
  }
}

export default function InsightSidebar({ onClose, filters }: InsightSidebarProps) {
  // Generate insights based on filters
  const generateInsights = () => {
    const insights = []

    // Add area-specific insight if area filter is applied
    if (filters.area !== "all") {
      insights.push({
        title: `${filters.area} Area Performance`,
        description: `The ${filters.area} area is showing a 4.2% variance to budget YTD, primarily driven by increased demand in the manufacturing sector.`,
        type: "summary",
        icon: <BarChart className="h-4 w-4 text-primary" />,
      })
    }

    // Add sector-specific insight if sector filter is applied
    if (filters.sector !== "all") {
      insights.push({
        title: `${filters.sector} Sector Trend`,
        description: `${filters.sector} has been trending downward for the past 3 months, with a current variance of -6.7% to budget.`,
        type: "anomaly",
        icon: <TrendingDown className="h-4 w-4 text-red-500" />,
      })
    }

    // Add general insights
    insights.push(
      {
        title: "Supply Chain Impact",
        description:
          "Supply chain disruptions in the Rubber Gloves sector are expected to resolve by early Q3, contributing to the forecasted recovery.",
        type: "summary",
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
      },
      {
        title: "Anomaly Detected",
        description:
          "Unusual volume spike detected in Consumer Products sector in JHR area (+15.3% vs budget). This appears to be driven by a new customer onboarding.",
        type: "anomaly",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      },
      {
        title: "Positive Growth Signal",
        description:
          "Manufacturing sector showing consistent growth for 4 consecutive months, indicating a strong recovery trend.",
        type: "summary",
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      },
      {
        title: "Benchmark Comparison",
        description:
          "Current performance is 3.2% above industry average based on IPI (Industrial Production Index) benchmarks.",
        type: "benchmark",
        icon: <BarChart className="h-4 w-4 text-blue-500" />,
      },
      {
        title: "Seasonal Pattern",
        description:
          "Current volume patterns align with historical seasonal trends, with expected uptick in Q3 based on 3-year analysis.",
        type: "benchmark",
        icon: <BarChart className="h-4 w-4 text-blue-500" />,
      },
    )

    return insights
  }

  const insights = generateInsights()

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-background border-l shadow-lg z-50 overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <h2 className="font-medium">Insights Panel</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="summary">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="summary" className="flex-1">
              Summary
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="flex-1">
              Anomalies
            </TabsTrigger>
            <TabsTrigger value="benchmarks" className="flex-1">
              Benchmarks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            {insights
              .filter((insight) => insight.type === "summary")
              .map((insight, index) => (
                <InsightCard key={index} title={insight.title} description={insight.description} icon={insight.icon} />
              ))}
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-4">
            {insights
              .filter((insight) => insight.type === "anomaly")
              .map((insight, index) => (
                <InsightCard key={index} title={insight.title} description={insight.description} icon={insight.icon} />
              ))}
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-4">
            {insights
              .filter((insight) => insight.type === "benchmark")
              .map((insight, index) => (
                <InsightCard key={index} title={insight.title} description={insight.description} icon={insight.icon} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}

interface InsightCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function InsightCard({ title, description, icon }: InsightCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:bg-muted/10 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
