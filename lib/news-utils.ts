// Function to search for news using Tavily API
export async function searchNews(query: string) {
  try {
    console.log("Sending news search request for query:", query)

    const response = await fetch("/api/tavily", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("News API error:", response.status, errorText)
      throw new Error(`Failed to fetch news: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log("News search successful, found", data.results?.length || 0, "results")

    // Validate the response structure
    if (!data || !data.results) {
      console.error("Invalid news API response structure:", data)
      throw new Error("Invalid news API response structure")
    }

    return data
  } catch (error) {
    console.error("Error searching news:", error)

    // If we have a timeout or network error, provide more specific error
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("News search timed out. Please try again.")
    }

    throw error
  }
}

// Function to analyze news results and generate a summary
export function analyzeNewsResults(results: any) {
  if (!results || !results.results || results.results.length === 0) {
    console.log("No news results to analyze")
    return {
      summary: "No relevant news found.",
      sources: [],
    }
  }

  console.log("Analyzing news results:", results.results.length, "items")

  // Extract the answer if available
  const answer = results.answer || ""

  // Extract sources
  const sources = results.results.map((result: any) => ({
    title: result.title || "Untitled Article",
    url: result.url || "#",
    publishedDate: result.published_date || "Unknown date",
    source: result.source || "Unknown source",
  }))

  return {
    summary: answer,
    sources,
  }
}
