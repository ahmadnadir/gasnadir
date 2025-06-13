"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, ChevronRight, ExternalLink, RefreshCw, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { searchNews } from "@/lib/news-utils"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type NewsItem = {
  id: number
  title: string
  url: string
  content: string
  source: string
  sentiment: "positive" | "neutral" | "negative"
  date: string
  sector?: string
}

export default function NewsPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    sector: "all",
    sentiment: "all",
  })

  const fetchLatestNews = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Search for general industry news
      const query = "latest news gas industry energy manufacturing rubber gloves supply chain"
      const results = await searchNews(query)

      if (results && results.results) {
        const formattedNews = results.results.map((item: any, index: number) => {
          // Determine sentiment based on content (simplified approach)
          let sentiment: "positive" | "neutral" | "negative" = "neutral"
          const content = item.content || item.snippet || ""

          if (
            content.toLowerCase().includes("growth") ||
            content.toLowerCase().includes("increase") ||
            content.toLowerCase().includes("positive")
          ) {
            sentiment = "positive"
          } else if (
            content.toLowerCase().includes("decline") ||
            content.toLowerCase().includes("decrease") ||
            content.toLowerCase().includes("negative")
          ) {
            sentiment = "negative"
          }

          // Determine sector (simplified approach)
          let sector = "General"
          const sectors = [
            "Rubber gloves",
            "Oleochemical",
            "Consumer Products",
            "Manufacturing",
            "Food & Beverage",
            "Pharmaceuticals",
          ]

          for (const s of sectors) {
            if (item.title.toLowerCase().includes(s.toLowerCase()) || content.toLowerCase().includes(s.toLowerCase())) {
              sector = s
              break
            }
          }

          return {
            id: index,
            title: item.title,
            url: item.url,
            content: content,
            source: item.source || "News Source",
            sentiment: sentiment,
            date: item.published_date || new Date().toISOString().split("T")[0],
            sector: sector,
          }
        })

        setNews(formattedNews)
      } else {
        // Fallback to mock data if no results
        setNews(mockNews)
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      setError("Failed to fetch latest news")
      // Fallback to mock data
      setNews(mockNews)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestNews()
    // Refresh news every 30 minutes
    const interval = setInterval(fetchLatestNews, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "🟢"
      case "neutral":
        return "⚪"
      case "negative":
        return "🔴"
      default:
        return "⚪"
    }
  }

  // Filter news based on selected filters
  const filteredNews = news.filter((item) => {
    if (filters.sector !== "all" && item.sector !== filters.sector) {
      return false
    }
    if (filters.sentiment !== "all" && item.sentiment !== filters.sentiment) {
      return false
    }
    return true
  })

  // Fallback mock news data
  const mockNews: NewsItem[] = [
    {
      id: 1,
      title: "New Rubber Glove Factory Opens in Johor",
      content: "Major manufacturer expands capacity with new facility",
      url: "#",
      source: "Industry News",
      sentiment: "positive",
      date: "2025-05-10",
      sector: "Rubber gloves",
    },
    {
      id: 2,
      title: "Supply Chain Disruptions Impact Oleochemical Industry",
      content: "Temporary shortages expected to resolve by Q3",
      url: "#",
      source: "Market Watch",
      sentiment: "negative",
      date: "2025-05-09",
      sector: "Oleochemical",
    },
    {
      id: 3,
      title: "Consumer Products Sector Shows Steady Growth",
      content: "Q1 results indicate stable demand across markets",
      url: "#",
      source: "Business Daily",
      sentiment: "neutral",
      date: "2025-05-08",
      sector: "Consumer Products",
    },
    {
      id: 4,
      title: "Energy Regulations Update in Southeast Asia",
      content: "New policies may impact industrial gas consumption",
      url: "#",
      source: "Policy Review",
      sentiment: "neutral",
      date: "2025-05-07",
      sector: "General",
    },
  ]

  return (
    <div className={cn("border-l h-screen transition-all duration-300 bg-background", isCollapsed ? "w-12" : "w-80")}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
          <Newspaper className="h-4 w-4" />
          <h3 className="font-medium text-sm">News & Market Signals</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          <ChevronRight className={cn("h-4 w-4 transition-transform", isCollapsed ? "rotate-180" : "")} />
          <span className="sr-only">Toggle news panel</span>
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-3 overflow-y-auto max-h-[calc(100vh-60px)]">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Latest updates</span>
              <Badge variant="outline" className="text-xs">
                {filteredNews.length} items
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-3 w-3" />
                <span className="sr-only">Filter news</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={fetchLatestNews} disabled={isLoading}>
                <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
                <span className="sr-only">Refresh news</span>
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-3 p-2 border rounded-md bg-muted/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium">Filters</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setShowFilters(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Sector</label>
                  <Select value={filters.sector} onValueChange={(value) => setFilters({ ...filters, sector: value })}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sectors</SelectItem>
                      <SelectItem value="Rubber gloves">Rubber gloves</SelectItem>
                      <SelectItem value="Oleochemical">Oleochemical</SelectItem>
                      <SelectItem value="Consumer Products">Consumer Products</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Pharmaceuticals">Pharmaceuticals</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Sentiment</label>
                  <Select
                    value={filters.sentiment}
                    onValueChange={(value) => setFilters({ ...filters, sentiment: value })}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sentiment</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {error && <div className="text-xs text-red-500 mb-2">{error}</div>}

          <div className="space-y-3">
            {(filteredNews.length > 0 ? filteredNews : mockNews).map((newsItem) => (
              <Card key={newsItem.id} className="shadow-none border">
                <CardHeader className="p-3 pb-0">
                  <div className="flex items-start gap-2">
                    <span>{getSentimentEmoji(newsItem.sentiment)}</span>
                    <CardTitle className="text-sm font-medium leading-tight">
                      <a
                        href={newsItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        {newsItem.title}
                        <ExternalLink className="h-3 w-3 inline flex-shrink-0" />
                      </a>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <p className="text-xs text-muted-foreground">{newsItem.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-primary">{newsItem.source}</span>
                      {newsItem.sector && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                          {newsItem.sector}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{newsItem.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredNews.length === 0 && (
              <div className="text-center p-4 text-sm text-muted-foreground">No news matching your filters</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
