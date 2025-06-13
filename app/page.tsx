"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Share2, AlertCircle, Mail, ChevronRight } from "lucide-react"
import { generateMockVolumeData, getYTDTotals, getCurrentMonthTotals } from "@/lib/data-utils"
import { motion } from "framer-motion"
import InsightCard from "@/components/insight-card"
import KpiMetric from "@/components/kpi-metric"
import dynamic from "next/dynamic"

const SparklineChart = dynamic(() => import("@/components/sparkline-chart"), { ssr: false })
const ConfidenceGauge = dynamic(() => import("@/components/confidence-gauge"), { ssr: false })

export default function ExecutiveReport() {
  const [volumeData, setVolumeData] = useState([])
  const [ytdTotals, setYtdTotals] = useState({ actual: 0, budget: 0, forecast: 0, variance: 0 })
  const [currentMonthTotals, setCurrentMonthTotals] = useState({ actual: 0, budget: 0, forecast: 0, variance: 0 })
  const [showTalkingPoints, setShowTalkingPoints] = useState(false)

  useEffect(() => {
    // Load data
    const data = generateMockVolumeData()
    setVolumeData(data)

    // Calculate summaries
    setYtdTotals(getYTDTotals(data))
    setCurrentMonthTotals(getCurrentMonthTotals(data))
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const getVariancePercent = (actual: number, budget: number) => {
    return budget > 0 ? ((actual - budget) / budget) * 100 : 0
  }

  const ytdVariancePercent = getVariancePercent(ytdTotals.actual, ytdTotals.budget)
  const currentMonthVariancePercent = getVariancePercent(currentMonthTotals.actual, currentMonthTotals.budget)

  // Insights data
  const insights = [
    {
      title: "Rubber Gloves",
      icon: "📉",
      trend: "down",
      value: -8.7,
      description: "−8.7% vs. budget due to delayed raw material delivery",
      data: [4, 5, 3, 2, 1, 2, 3, 2, 1],
    },
    {
      title: "Food & Beverage",
      icon: "📉",
      trend: "down",
      value: -6.2,
      description: "−6.2% vs. budget due to seasonal demand fluctuation",
      data: [5, 4, 3, 4, 3, 2, 1, 2, 1],
    },
    {
      title: "Pharmaceuticals",
      icon: "📈",
      trend: "up",
      value: 5.3,
      description: "+5.3% vs. budget driven by healthcare sector growth",
      data: [1, 2, 3, 2, 3, 4, 5, 6, 7],
    },
    {
      title: "Manufacturing",
      icon: "📈",
      trend: "up",
      value: 3.8,
      description: "+3.8% vs. budget with new facility expansion",
      data: [3, 2, 3, 4, 3, 4, 5, 4, 5],
    },
  ]

  // Talking points
  const talkingPoints = [
    "Consider rebalancing volume allocations in Northern region",
    "Schedule supply chain review in Rubber Gloves",
    "Push board Q2 briefing to early July with updated outlook",
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      {/* AI-Generated Executive Narrative */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-serif font-medium tracking-tight">Executive Report</h1>

        <div className="bg-muted/20 rounded-xl p-8 space-y-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-4">
                Gas volume is {ytdVariancePercent.toFixed(1)}% below budget YTD, driven by underperformance in the
                Rubber and Food sectors. Forecasts suggest recovery by July.
              </h2>
              <p className="text-muted-foreground">
                The current month shows a {Math.abs(currentMonthVariancePercent).toFixed(1)}% variance to budget, with
                signs of improvement in the Manufacturing sector. Supply chain disruptions in the Rubber Gloves sector
                are expected to resolve by early Q3, contributing to the forecasted recovery.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <AlertCircle className="h-4 w-4" />
              Add Food Sector to Watchlist
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Share2 className="h-4 w-4" />
              Share Summary to Slack
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Mail className="h-4 w-4" />
              Discuss with Strategy Lead
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Single KPI Strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <KpiMetric
          title="YTD Volume Performance"
          value={`${formatNumber(ytdTotals.actual)} GJ`}
          comparison={`vs ${formatNumber(ytdTotals.budget)} GJ`}
          change={ytdVariancePercent}
          status={ytdVariancePercent >= 0 ? "positive" : "negative"}
        />

        <KpiMetric
          title="Current Month Variance"
          value={`${currentMonthTotals.variance > 0 ? "+" : ""}${formatNumber(currentMonthTotals.variance)} GJ`}
          comparison={`${currentMonthVariancePercent.toFixed(1)}%`}
          status={currentMonthVariancePercent >= 0 ? "positive" : "negative"}
          pulsing={true}
        />

        <KpiMetric
          title="Forecast Confidence"
          value="91%"
          comparison="based on macro & sector models"
          status="positive"
          chart={<ConfidenceGauge value={91} />}
        />
      </motion.section>

      {/* Insight Strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">What's trending and why?</h2>
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex overflow-x-auto pb-4 space-x-4 -mx-2 px-2">
          {insights.map((insight, index) => (
            <InsightCard
              key={index}
              title={insight.title}
              icon={insight.icon}
              trend={insight.trend}
              value={insight.value}
              description={insight.description}
              data={insight.data}
            />
          ))}
        </div>
      </motion.section>

      {/* Predictive Outlook Panel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-muted/20 rounded-xl p-8 space-y-6"
      >
        <h2 className="text-xl font-medium">What's next?</h2>

        <div className="flex flex-col items-center text-center">
          <div className="text-5xl font-medium text-primary mb-4">+3.8% Forecasted Recovery</div>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Recovery expected in Q3, led by Electronics and Automotive sectors. Supply chain improvements and new
            customer onboarding will drive volume growth.
          </p>

          <div className="w-full max-w-xl mb-6">
            <div className="h-3 w-full bg-muted rounded-full relative">
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-xs text-muted-foreground">+1.2%</span>
                <span className="text-xs text-muted-foreground">+6.5%</span>
              </div>
              <div className="h-full w-[60%] bg-primary rounded-full"></div>
              <div className="absolute top-full left-[60%] -translate-x-1/2 mt-1">
                <div className="w-3 h-3 bg-primary rotate-45 transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          {!showTalkingPoints ? (
            <Button onClick={() => setShowTalkingPoints(true)} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate 3 Talking Points
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="w-full max-w-2xl bg-card p-4 rounded-lg border"
            >
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Talking Points
              </h3>
              <ul className="space-y-3">
                {talkingPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <span className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  )
}
