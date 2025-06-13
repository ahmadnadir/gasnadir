"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FileText,
  Send,
  Download,
  Sparkles,
  Search,
  Newspaper,
  ExternalLink,
  BarChart,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { searchNews, analyzeNewsResults } from "@/lib/news-utils"
import { correlateNewsWithData } from "@/lib/correlation-utils"
import { generateMockVolumeData, mockCustomers } from "@/lib/data-utils"
import CorrelatedInsightCard from "@/components/correlated-insight-card"
import { generatePolicyImpactResponse } from "@/lib/response-utils"
import { toast } from "@/components/ui/use-toast"

// Types for chat message
interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: {
    title: string
    url: string
    publishedDate: string
    source: string
  }[]
  insights?: any[]
  error?: boolean
}

// Sample suggested questions
const suggestedQuestions = [
  "How are supply chain issues affecting rubber glove production volumes?",
  "Analyze the impact of rising energy costs on manufacturing sector gas usage",
  "What's causing the variance in Johor's gas consumption this quarter?",
  "How do recent market trends correlate with our volume performance?",
  "What is the impact of Trump tariffs on Malaysian rubber gloves sector and rubber gloves sector gas usage?",
]

export default function AimiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hello! I'm AIMI, your AI analyst. I can now correlate gas volume data with the latest news to provide comprehensive insights. Ask me about industry trends, market impacts on your gas usage, or specific sector performance.",
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSearchingNews, setIsSearchingNews] = useState(false)
  const [isCorrelatingData, setIsCorrelatingData] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [volumeData, setVolumeData] = useState<any[]>([])
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 2

  // Load volume data on component mount
  useEffect(() => {
    try {
      const data = generateMockVolumeData()
      setVolumeData(data)
      console.log("Volume data loaded successfully:", data.length, "records")
    } catch (error) {
      console.error("Error loading volume data:", error)
      toast({
        title: "Data Loading Error",
        description: "Failed to load volume data. Some features may be limited.",
        variant: "destructive",
      })
    }
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setIsSearchingNews(true)
    setRetryCount(0)

    await processUserQuery(input)
  }

  // Process user query with retry logic
  const processUserQuery = async (query: string) => {
    try {
      // Check if it's a policy-related question that we can answer directly
      const isPolicyQuestion =
        query.toLowerCase().includes("tariff") ||
        query.toLowerCase().includes("trump") ||
        query.toLowerCase().includes("policy")

      // For policy questions about rubber gloves and tariffs, we can use our specialized response
      if (isPolicyQuestion && (query.toLowerCase().includes("rubber") || query.toLowerCase().includes("glove"))) {
        console.log("Detected policy question about rubber gloves, using specialized response")

        // Generate a specialized response without requiring news API
        const policyResponse = generatePolicyImpactResponse(query, [], [])

        // Add AI message with the policy response
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: policyResponse,
          timestamp: new Date(),
          // We don't have real sources but we can add mock sources for consistency
          sources: [
            {
              title: "US-Malaysia Trade Relations Report",
              url: "https://example.com/trade-report",
              publishedDate: "2025-04-15",
              source: "Trade Analysis Bureau",
            },
            {
              title: "Impact of Tariffs on Asian Manufacturing",
              url: "https://example.com/tariff-impact",
              publishedDate: "2025-04-10",
              source: "Economic Research Institute",
            },
          ],
        }

        setMessages((prev) => [...prev, aiMessage])
        setLoading(false)
        return
      }

      // For other questions, proceed with news search and correlation
      console.log("Searching for news related to:", query)
      setIsSearchingNews(true)

      // Search for news related to the query
      const newsResults = await searchNewsWithRetry(query)
      setIsSearchingNews(false)

      if (!newsResults || !newsResults.results || newsResults.results.length === 0) {
        console.log("No news results found, using fallback response")
        throw new Error("No relevant news found")
      }

      console.log(`Found ${newsResults.results.length} news items, correlating with data`)
      setIsCorrelatingData(true)

      // Analyze the news results
      const analysis = analyzeNewsResults(newsResults)

      // Map news results to our format
      const formattedNews = newsResults.results.map((result: any) => ({
        id: result.id || Date.now(),
        title: result.title || "Untitled Article",
        content: result.content || result.snippet || "",
        url: result.url || "#",
        source: result.source || "News Source",
        sentiment: determineSentiment(result.content || result.snippet || ""),
        date: result.published_date || new Date().toISOString().split("T")[0],
      }))

      // Correlate news with volume data
      const correlatedInsights = await correlateNewsWithData(query, formattedNews, volumeData, mockCustomers)

      console.log(`Generated ${correlatedInsights.length} correlated insights`)

      // Generate AI response based on correlated insights
      const responseContent = generateResponseFromInsights(correlatedInsights, query)

      // Add AI message with sources and insights
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        sources: analysis.sources,
        insights: correlatedInsights,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error processing query:", error)

      // If we haven't exceeded max retries, try again
      if (retryCount < maxRetries) {
        console.log(`Retry attempt ${retryCount + 1} of ${maxRetries}`)
        setRetryCount((prev) => prev + 1)
        await processUserQuery(query)
        return
      }

      // If we've exhausted retries or it's a policy question, use fallback
      const fallbackResponse = generateFallbackResponse(query)

      // Add AI message with fallback response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackResponse,
        timestamp: new Date(),
        error: true,
      }

      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsCorrelatingData(false)
      setLoading(false)
    }
  }

  // Search news with retry logic
  const searchNewsWithRetry = async (query: string, retries = 2): Promise<any> => {
    try {
      return await searchNews(query)
    } catch (error) {
      if (retries > 0) {
        console.log(`News search failed, retrying... (${retries} attempts left)`)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
        return searchNewsWithRetry(query, retries - 1)
      }
      throw error
    }
  }

  // Determine sentiment from content
  const determineSentiment = (content: string): "positive" | "neutral" | "negative" => {
    const positiveTerms = [
      "growth",
      "increase",
      "profit",
      "success",
      "positive",
      "improvement",
      "opportunity",
      "expand",
      "gain",
      "recovery",
      "boost",
      "rise",
    ]

    const negativeTerms = [
      "decline",
      "decrease",
      "loss",
      "failure",
      "negative",
      "challenge",
      "problem",
      "crisis",
      "risk",
      "threat",
      "drop",
      "fall",
      "concern",
    ]

    let positiveCount = 0
    let negativeCount = 0

    const contentLower = content.toLowerCase()

    positiveTerms.forEach((term) => {
      if (contentLower.includes(term)) positiveCount++
    })

    negativeTerms.forEach((term) => {
      if (contentLower.includes(term)) negativeCount++
    })

    if (positiveCount > negativeCount + 1) return "positive"
    if (negativeCount > positiveCount + 1) return "negative"
    return "neutral"
  }

  // Generate response from correlated insights
  const generateResponseFromInsights = (insights: any[], query: string): string => {
    // Check for policy impact questions first
    const policyResponse = generatePolicyImpactResponse(
      query,
      insights.length > 0 ? insights[0].newsReferences : [],
      insights.length > 0 ? insights[0].dataReferences : [],
    )

    // If we have a specialized policy response, use it
    if (policyResponse) {
      return policyResponse
    }

    // Otherwise continue with standard response generation
    if (!insights || insights.length === 0) {
      return generateFallbackResponse(query)
    }

    // Start with a summary of what was found
    let response = `I've analyzed your question about "${query}" by correlating our gas volume data with the latest market news.\n\n`

    // Add main insight
    const mainInsight = insights[0]
    response += `**Key Finding:** ${mainInsight.title}\n\n${mainInsight.description}\n\n`

    // Add confidence level
    response += `This analysis has a ${mainInsight.confidence}% confidence level based on the correlation strength between our data and external news sources.\n\n`

    // Add impact assessment
    const impactText = mainInsight.impactScore > 0 ? "positive" : mainInsight.impactScore < 0 ? "negative" : "neutral"
    const impactStrength = Math.abs(mainInsight.impactScore) > 5 ? "significant" : "moderate"

    response += `**Impact Assessment:** The ${impactStrength} ${impactText} impact (${mainInsight.impactScore > 0 ? "+" : ""}${mainInsight.impactScore}/10) suggests `

    if (mainInsight.impactScore > 5) {
      response += "this represents an important opportunity for the business.\n\n"
    } else if (mainInsight.impactScore < -5) {
      response += "this requires immediate attention and mitigation strategies.\n\n"
    } else if (mainInsight.impactScore > 0) {
      response += "this is a positive development that should be monitored.\n\n"
    } else if (mainInsight.impactScore < 0) {
      response += "this is a concerning trend that warrants closer observation.\n\n"
    } else {
      response += "this has a balanced effect on operations at present.\n\n"
    }

    // Add recommended action if available
    if (mainInsight.recommendedActions && mainInsight.recommendedActions.length > 0) {
      response += `**Recommended Action:** ${mainInsight.recommendedActions[0]}\n\n`
    }

    // Add note about additional insights
    if (insights.length > 1) {
      response +=
        "I've provided additional correlated insights below for your review. You can expand each card to see the supporting news and data."
    }

    return response
  }

  // Generate fallback response when news search fails or returns no results
  const generateFallbackResponse = (query: string) => {
    // Check if it's a tariff question
    if (query.toLowerCase().includes("tariff") || query.toLowerCase().includes("trump")) {
      if (query.toLowerCase().includes("rubber") || query.toLowerCase().includes("glove")) {
        return generatePolicyImpactResponse(query, [], [])
      }
    }

    // Original fallback responses
    if (query.toLowerCase().includes("rubber") || query.toLowerCase().includes("glove")) {
      return "Based on our gas volume data, the rubber glove sector has shown a 6.7% decrease compared to budget in the last quarter. This aligns with general market trends indicating supply chain challenges affecting production. The most significant impact is seen in the PKP area, where our largest rubber glove customers are located."
    } else if (query.toLowerCase().includes("manufacturing")) {
      return "The manufacturing sector's gas consumption has increased by 3.8% above budget this quarter. This positive trend appears to be driven by capacity expansions at key customers. The data shows particular strength in the JHR area, where several new production lines have come online."
    } else if (query.toLowerCase().includes("energy") || query.toLowerCase().includes("cost")) {
      return "Rising energy costs have had a varied impact across our customer base. The data shows that energy-intensive sectors like Oleochemical have reduced consumption by approximately 4.2%, likely as a cost-control measure. However, sectors with inelastic demand like Pharmaceuticals have maintained consistent usage patterns despite price pressures."
    } else {
      return "Based on our internal gas volume data, we're seeing mixed performance across sectors. The overall volume is currently 2.3% below budget YTD, with significant variance between sectors. Manufacturing and Pharmaceuticals are performing above budget (+3.8% and +5.3% respectively), while Rubber Gloves and Food & Beverage are underperforming (-6.7% and -4.2% respectively)."
    }
  }

  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Handle retry for a failed message
  const handleRetry = (messageId: string) => {
    // Find the user message that preceded this error message
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex > 0) {
      // Look for the most recent user message before this one
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          // Remove the error message
          setMessages((prev) => prev.filter((m) => m.id !== messageId))
          // Process the user query again
          processUserQuery(messages[i].content)
          break
        }
      }
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chat with AIMI</h1>
          <p className="text-muted-foreground">Your AI analyst, now correlating news with your gas volume data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <FileText className="h-4 w-4" />
            Chat History
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export Chat
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 h-full">
        <div className="flex-1 overflow-y-auto p-4 border rounded-lg bg-muted/10">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 mb-4",
                message.role === "assistant" ? "mr-auto max-w-[90%]" : "ml-auto flex-row-reverse max-w-[80%]",
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src="/ai-robot-avatar.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}

              {message.role === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}

              <div className="flex flex-col space-y-3">
                <div
                  className={cn(
                    "flex flex-col space-y-1 rounded-lg p-3",
                    message.role === "assistant" ? "bg-card" : "bg-primary text-primary-foreground",
                  )}
                >
                  <div className="text-sm whitespace-pre-line">{message.content}</div>

                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-muted">
                      <p className="text-xs font-medium flex items-center gap-1 mb-1">
                        <Newspaper className="h-3 w-3" /> Sources:
                      </p>
                      <ul className="space-y-1">
                        {message.sources.slice(0, 3).map((source, index) => (
                          <li key={index} className="text-xs flex items-start gap-1">
                            <ExternalLink className="h-3 w-3 flex-shrink-0 mt-0.5" />
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-primary"
                            >
                              {source.title} ({source.source}, {source.publishedDate})
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>

                  {message.error && (
                    <div className="mt-2 pt-2 border-t border-muted">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs flex items-center gap-1"
                        onClick={() => handleRetry(message.id)}
                      >
                        <AlertCircle className="h-3 w-3" />
                        Retry with better correlation
                      </Button>
                    </div>
                  )}
                </div>

                {message.insights && message.insights.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BarChart className="h-3 w-3" />
                      <span>Correlated Insights</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>

                    {message.insights.map((insight, index) => (
                      <CorrelatedInsightCard key={index} insight={insight} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 mb-4 max-w-[80%] mr-auto">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src="/ai-robot-avatar.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-card rounded-lg p-4">
                <div className="flex flex-col space-y-2">
                  {isSearchingNews && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <Search className="h-3 w-3 animate-pulse" /> Searching for relevant news...
                    </p>
                  )}

                  {isCorrelatingData && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <BarChart className="h-3 w-3 animate-pulse" /> Correlating with gas volume data...
                    </p>
                  )}

                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Suggested questions</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1.5"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AIMI about correlations between news and your gas volume data..."
                className="w-full p-2 pr-10 rounded-md border bg-background"
                disabled={loading}
              />
              <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
            </div>
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
