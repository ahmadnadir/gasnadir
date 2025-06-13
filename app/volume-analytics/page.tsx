"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  RefreshCw,
  Sparkles,
  Send,
  Bell,
  ChevronRight,
  PanelRight,
  X,
  FileText,
  MessageSquare,
} from "lucide-react"
import { mockCustomers, generateMockVolumeData } from "@/lib/data-utils"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import FilterBar from "@/components/filter-bar"
import KpiCard from "@/components/kpi-card"
import InsightSidebar from "@/components/insight-sidebar"

const VolumeChart = dynamic(() => import("@/components/volume-chart"), { ssr: false })
const VarianceHeatmap = dynamic(() => import("@/components/variance-heatmap"), { ssr: false })

export default function VolumeAnalytics() {
  const [volumeData, setVolumeData] = useState([])
  const [filters, setFilters] = useState({
    area: "all",
    sector: "all",
    segment: "all",
    timeFrame: "ytd",
  })
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [showInsightSidebar, setShowInsightSidebar] = useState(false)
  const [selectedCell, setSelectedCell] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showExportPanel, setShowExportPanel] = useState(false)

  // Ref for the filter bar to implement sticky behavior
  const filterBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load data
    const data = generateMockVolumeData()
    setVolumeData(data)
  }, [])

  // Handle preset selection
  const handlePresetClick = (preset: string) => {
    if (activePreset === preset) {
      // If clicking the active preset, clear it
      setActivePreset(null)
      setFilters({
        area: "all",
        sector: "all",
        segment: "all",
        timeFrame: "ytd",
      })
    } else {
      setActivePreset(preset)
      // Apply preset filters
      switch (preset) {
        case "underperforming":
          setFilters({
            ...filters,
            sector: "Rubber gloves",
            timeFrame: "mom",
          })
          break
        case "aboveBudget":
          setFilters({
            ...filters,
            sector: "Manufacturing",
            timeFrame: "mtd",
          })
          break
        case "southern":
          setFilters({
            ...filters,
            area: "JHR",
            timeFrame: "ytd",
          })
          break
      }
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      const data = generateMockVolumeData()
      setVolumeData(data)
      setIsRefreshing(false)
    }, 1000)
  }

  // Handle cell click in heatmap
  const handleCellClick = (cellData: any) => {
    setSelectedCell(cellData)
  }

  // KPI data
  const kpiData = [
    {
      title: "Total Volume",
      value: "198,450",
      unit: "GJ",
      change: 4.2,
      trend: "up",
      comparison: "vs previous period",
    },
    {
      title: "Budget Variance",
      value: "-4.3",
      unit: "%",
      change: -4.3,
      trend: "down",
      comparison: "vs target",
    },
    {
      title: "Month-on-Month",
      value: "2.8",
      unit: "%",
      change: 2.8,
      trend: "up",
      comparison: "growth",
    },
    {
      title: "Year-on-Year",
      value: "5.7",
      unit: "%",
      change: 5.7,
      trend: "up",
      comparison: "growth",
    },
    {
      title: "Forecasted Growth",
      value: "3.8",
      unit: "%",
      change: 3.8,
      trend: "up",
      comparison: "next quarter",
    },
  ]

  // AI insights
  const aiInsights = [
    "Rubber Gloves in PKP down 6.7% vs budget for 3 straight months",
    "Ceramics in Southern Area projected to exceed budget by 12% next quarter",
    "Consumer Products showing recovery with 3.2% growth MoM after supply chain improvements",
  ]

  return (
    <div className="relative min-h-screen pb-20">
      {/* Filter Bar (Fixed Header) */}
      <div ref={filterBarRef} className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b pb-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Volume Analytics</h1>
            <p className="text-muted-foreground">
              Live control panel for gas volume performance across all business dimensions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn("gap-1", isRefreshing && "opacity-50")}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
            <Button
              variant={showInsightSidebar ? "default" : "outline"}
              size="sm"
              className="gap-1"
              onClick={() => setShowInsightSidebar(!showInsightSidebar)}
            >
              <PanelRight className="h-4 w-4" />
              Insights
            </Button>
          </div>
        </div>

        {/* Smart Presets */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activePreset === "underperforming" ? "default" : "outline"}
            className={cn(
              "cursor-pointer hover:bg-primary/20 transition-colors",
              activePreset === "underperforming" && "bg-primary text-primary-foreground",
            )}
            onClick={() => handlePresetClick("underperforming")}
          >
            📉 Underperforming Sectors
          </Badge>
          <Badge
            variant={activePreset === "aboveBudget" ? "default" : "outline"}
            className={cn(
              "cursor-pointer hover:bg-primary/20 transition-colors",
              activePreset === "aboveBudget" && "bg-primary text-primary-foreground",
            )}
            onClick={() => handlePresetClick("aboveBudget")}
          >
            📈 Above Budget This Month
          </Badge>
          <Badge
            variant={activePreset === "southern" ? "default" : "outline"}
            className={cn(
              "cursor-pointer hover:bg-primary/20 transition-colors",
              activePreset === "southern" && "bg-primary text-primary-foreground",
            )}
            onClick={() => handlePresetClick("southern")}
          >
            🌍 View Southern Region Only
          </Badge>
        </div>

        {/* Filter Controls */}
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="space-y-6 mt-6">
        {/* AI Insight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/20 rounded-lg p-4 border"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <h2 className="font-medium">Key Insights</h2>
              <ul className="space-y-1">
                {aiInsights.map((insight, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowInsightSidebar(true)}>
              Generate Full Insight Panel
            </Button>
          </div>
        </motion.div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiData.map((kpi, index) => (
            <KpiCard
              key={index}
              title={kpi.title}
              value={kpi.value}
              unit={kpi.unit}
              change={kpi.change}
              trend={kpi.trend}
              comparison={kpi.comparison}
            />
          ))}
        </div>

        {/* Volume Trend Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg font-medium">Volume Trend</h2>
              <div className="flex flex-wrap gap-2">
                <Tabs defaultValue="month" className="w-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="month" className="text-xs h-6">
                      Month
                    </TabsTrigger>
                    <TabsTrigger value="quarter" className="text-xs h-6">
                      Quarter
                    </TabsTrigger>
                    <TabsTrigger value="ytd" className="text-xs h-6">
                      YTD
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="all" className="text-xs h-6">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="actual" className="text-xs h-6">
                      Actual
                    </TabsTrigger>
                    <TabsTrigger value="budget" className="text-xs h-6">
                      Budget
                    </TabsTrigger>
                    <TabsTrigger value="forecast" className="text-xs h-6">
                      Forecast
                    </TabsTrigger>
                    <TabsTrigger value="previous" className="text-xs h-6">
                      Previous Year
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div className="h-80">
              <VolumeChart dimension={filters.sector !== "all" ? "sector" : "area"} timeFrame={filters.timeFrame} />
            </div>
          </CardContent>
        </Card>

        {/* Variance Heatmap */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg font-medium">Variance Heatmap</h2>
              <Tabs defaultValue="sector" className="w-auto">
                <TabsList className="h-8">
                  <TabsTrigger value="sector" className="text-xs h-6">
                    By Sector
                  </TabsTrigger>
                  <TabsTrigger value="area" className="text-xs h-6">
                    By Area
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="overflow-x-auto">
              <VarianceHeatmap onCellClick={handleCellClick} />
            </div>
          </CardContent>
        </Card>

        {/* Cell Detail Modal */}
        <AnimatePresence>
          {selectedCell && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setSelectedCell(null)}
            >
              <motion.div
                className="bg-background rounded-lg shadow-lg max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">
                    {selectedCell.sector} - {selectedCell.month}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedCell(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Variance:</span>
                    <span className={cn("font-medium", selectedCell.variance > 0 ? "text-green-600" : "text-red-600")}>
                      {selectedCell.variance > 0 ? "+" : ""}
                      {selectedCell.variance}%
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Customer Breakdown</h4>
                    <div className="space-y-2">
                      {mockCustomers
                        .filter((c) => c.sector === selectedCell.sector)
                        .slice(0, 3)
                        .map((customer, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span>{customer.customer}</span>
                            <span className={cn("font-medium", i % 2 === 0 ? "text-green-600" : "text-red-600")}>
                              {i % 2 === 0 ? "+" : ""}
                              {(Math.random() * 10).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">AI Analysis</h4>
                    <p className="text-sm">
                      {selectedCell.variance < 0
                        ? `The ${selectedCell.variance}% underperformance in ${selectedCell.sector} during ${selectedCell.month} appears to be driven by supply chain disruptions affecting raw material availability. This is a temporary issue expected to resolve by next quarter.`
                        : `The ${selectedCell.variance}% overperformance in ${selectedCell.sector} during ${selectedCell.month} is primarily due to increased demand from new customers and expanded production capacity. This positive trend is expected to continue.`}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Add Comment
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Bell className="h-4 w-4" />
                      Flag to Commercial Lead
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insight Sidebar */}
        <AnimatePresence>
          {showInsightSidebar && <InsightSidebar onClose={() => setShowInsightSidebar(false)} filters={filters} />}
        </AnimatePresence>

        {/* Export + Share Panel (Sticky Footer) */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-3 flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowExportPanel(!showExportPanel)}>
              <Download className="h-4 w-4" />
              Export
              {showExportPanel && <ChevronRight className="h-4 w-4 rotate-90" />}
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Send className="h-4 w-4" />
              Send to Team
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Sparkles className="h-4 w-4" />
              Generate Commentary
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Bell className="h-4 w-4" />
              Set Alert
            </Button>
          </div>
        </div>

        {/* Export Panel */}
        <AnimatePresence>
          {showExportPanel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-16 left-4 bg-background rounded-lg border shadow-lg p-4 w-64"
            >
              <h3 className="font-medium mb-3">Export Options</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Export to Excel
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Export to PDF
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Export Chart Image
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
