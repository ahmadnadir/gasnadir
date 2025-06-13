"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Newspaper,
  BarChart,
  ListChecks,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { CorrelatedInsight } from "@/lib/correlation-utils"

interface CorrelatedInsightCardProps {
  insight: CorrelatedInsight
}

export default function CorrelatedInsightCard({ insight }: CorrelatedInsightCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Determine impact color
  const getImpactColor = (score: number) => {
    if (score > 5) return "text-green-600"
    if (score > 0) return "text-green-500"
    if (score < -5) return "text-red-600"
    if (score < 0) return "text-red-500"
    return "text-gray-500"
  }

  // Get impact icon
  const getImpactIcon = (score: number) => {
    if (score > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (score < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  // Get confidence badge color
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 text-green-800 border-green-200"
    if (confidence >= 60) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{insight.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(getConfidenceBadge(insight.confidence))}>
              {insight.confidence}% confidence
            </Badge>
            <span className={cn("font-medium", getImpactColor(insight.impactScore))}>
              {insight.impactScore > 0 ? "+" : ""}
              {insight.impactScore}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>

        {insight.sectors.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {insight.sectors.map((sector, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {sector}
              </Badge>
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-1 mt-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show details <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t"
          >
            <Tabs defaultValue="news">
              <TabsList className="w-full mb-3">
                <TabsTrigger value="news" className="flex-1">
                  <Newspaper className="h-4 w-4 mr-1" /> News
                </TabsTrigger>
                <TabsTrigger value="data" className="flex-1">
                  <BarChart className="h-4 w-4 mr-1" /> Data
                </TabsTrigger>
                <TabsTrigger value="actions" className="flex-1">
                  <ListChecks className="h-4 w-4 mr-1" /> Actions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="news" className="space-y-3">
                {insight.newsReferences.length > 0 ? (
                  insight.newsReferences.map((news, i) => (
                    <div key={i} className="text-sm border rounded-md p-3">
                      <div className="flex items-start gap-2 mb-1">
                        {news.sentiment === "positive" && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                        {news.sentiment === "negative" && <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />}
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline flex items-center gap-1"
                        >
                          {news.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      {news.keyPoints.length > 0 && (
                        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1 mt-2">
                          {news.keyPoints.map((point, j) => (
                            <li key={j}>{point}</li>
                          ))}
                        </ul>
                      )}

                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>{news.source}</span>
                        <span>{news.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No news references available.</p>
                )}
              </TabsContent>

              <TabsContent value="data" className="space-y-3">
                {insight.dataReferences.length > 0 ? (
                  insight.dataReferences.map((data, i) => (
                    <div key={i} className="text-sm border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{data.metric}</span>
                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              "font-medium",
                              data.trend === "increasing"
                                ? "text-green-600"
                                : data.trend === "decreasing"
                                  ? "text-red-600"
                                  : "text-gray-600",
                            )}
                          >
                            {data.value > 0 ? "+" : ""}
                            {data.value.toFixed(1)}%
                          </span>
                          {data.trend === "increasing" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {data.trend === "decreasing" && <TrendingDown className="h-4 w-4 text-red-600" />}
                          {data.trend === "stable" && <Minus className="h-4 w-4 text-gray-600" />}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{data.period}</span>
                        {data.anomaly && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                            Anomaly
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No data references available.</p>
                )}
              </TabsContent>

              <TabsContent value="actions" className="space-y-3">
                {insight.recommendedActions && insight.recommendedActions.length > 0 ? (
                  <ul className="space-y-2">
                    {insight.recommendedActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No recommended actions available.</p>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
