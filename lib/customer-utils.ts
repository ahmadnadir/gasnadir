import type { Customer, VolumeData } from "@/lib/data-utils"

export type CustomerStatus = "On Track" | "At Risk" | "Underperforming"

export interface CustomerInsight extends Customer {
  status: CustomerStatus
  actualVolume: number
  budgetVolume: number
  forecastVolume: number
  variance: number
  variancePercent: number
  rank: number
  insights: string[]
  timeSeriesData: TimeSeriesData[]
}

export interface TimeSeriesData {
  month: string
  actual: number
  budget: number
  forecast?: number
}

// Generate customer insights from raw data
export function generateCustomerInsights(customers: Customer[], volumeData: VolumeData[]): CustomerInsight[] {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return customers.map((customer, index) => {
    // Calculate volumes
    const customerVolumeData = volumeData.filter((v) => v.customerId === customer.id)

    // YTD actual and budget
    const ytdActual = customerVolumeData
      .filter((v) => v.year === currentYear && v.month <= currentMonth && v.volumeType === "Actual")
      .reduce((sum, v) => sum + v.volume, 0)

    const ytdBudget = customerVolumeData
      .filter((v) => v.year === currentYear && v.month <= currentMonth && v.volumeType === "Budget")
      .reduce((sum, v) => sum + v.volume, 0)

    // Forecast for next 3 months
    const forecast = customerVolumeData
      .filter((v) => {
        if (v.volumeType !== "Forecast") return false

        // Next 3 months logic
        if (v.year > currentYear) return true
        if (v.year === currentYear && v.month > currentMonth && v.month <= currentMonth + 3) return true
        return false
      })
      .reduce((sum, v) => sum + v.volume, 0)

    // Calculate variance
    const variance = ytdActual - ytdBudget
    const variancePercent = ytdBudget > 0 ? (variance / ytdBudget) * 100 : 0

    // Determine status based on variance
    let status: CustomerStatus
    if (variancePercent >= -5) {
      status = "On Track"
    } else if (variancePercent >= -15) {
      status = "At Risk"
    } else {
      status = "Underperforming"
    }

    // Generate time series data for charts
    const timeSeriesData: TimeSeriesData[] = []

    // Past 6 months + current month
    for (let i = -6; i <= 0; i++) {
      let month = currentMonth + i
      let year = currentYear

      if (month <= 0) {
        month += 12
        year -= 1
      }

      const actualData = customerVolumeData.find(
        (v) => v.year === year && v.month === month && v.volumeType === "Actual",
      )

      const budgetData = customerVolumeData.find(
        (v) => v.year === year && v.month === month && v.volumeType === "Budget",
      )

      timeSeriesData.push({
        month: monthNames[month - 1],
        actual: actualData?.volume || 0,
        budget: budgetData?.volume || 0,
      })
    }

    // Next 3 months forecast
    for (let i = 1; i <= 3; i++) {
      let month = currentMonth + i
      let year = currentYear

      if (month > 12) {
        month -= 12
        year += 1
      }

      const budgetData = customerVolumeData.find(
        (v) => v.year === year && v.month === month && v.volumeType === "Budget",
      )

      const forecastData = customerVolumeData.find(
        (v) => v.year === year && v.month === month && v.volumeType === "Forecast",
      )

      timeSeriesData.push({
        month: monthNames[month - 1],
        actual: 0, // No actual data for future months
        budget: budgetData?.volume || 0,
        forecast: forecastData?.volume || 0,
      })
    }

    // Generate AI insights
    const insights = generateAIInsights(customer, variancePercent, status)

    return {
      ...customer,
      status,
      actualVolume: ytdActual,
      budgetVolume: ytdBudget,
      forecastVolume: forecast,
      variance,
      variancePercent,
      rank: index + 1,
      insights,
      timeSeriesData,
    }
  })
}

// Generate mock AI insights
function generateAIInsights(customer: Customer, variancePercent: number, status: CustomerStatus): string[] {
  const insights: string[] = []

  // Base insight on status
  if (status === "On Track") {
    insights.push(
      `${customer.customer} is performing well with volumes ${variancePercent > 0 ? "above" : "near"} budget targets.`,
    )
  } else if (status === "At Risk") {
    insights.push(
      `${customer.customer} is showing concerning trends with volumes ${Math.abs(variancePercent).toFixed(1)}% below budget.`,
    )
  } else {
    insights.push(
      `${customer.customer} is significantly underperforming with volumes ${Math.abs(variancePercent).toFixed(1)}% below budget.`,
    )
  }

  // Add sector-specific insight
  if (customer.sector === "Rubber gloves") {
    insights.push("The rubber gloves sector is experiencing strong demand due to healthcare industry growth.")
  } else if (customer.sector === "Oleochemical") {
    insights.push("Recent supply chain disruptions are impacting the oleochemical sector's performance.")
  } else if (customer.sector === "Consumer Products") {
    insights.push("Consumer products sector shows stable demand patterns with seasonal fluctuations.")
  } else {
    insights.push(`The ${customer.sector} sector is showing typical performance patterns for this time of year.`)
  }

  // Add segment-specific insight
  if (customer.segment === "Elite") {
    insights.push("Elite segment customers typically have more stable consumption patterns and higher retention rates.")
  } else if (customer.segment === "Premium") {
    insights.push("Premium segment customers show moderate growth potential with targeted engagement.")
  } else {
    insights.push("Preferred segment customers may benefit from more frequent touchpoints and service reviews.")
  }

  // Add recommendation based on status
  if (status === "On Track") {
    insights.push("Recommendation: Maintain current engagement strategy and explore upsell opportunities.")
  } else if (status === "At Risk") {
    insights.push(
      "Recommendation: Schedule a review meeting to address volume shortfall and identify improvement areas.",
    )
  } else {
    insights.push("Recommendation: Immediate intervention required. Develop a recovery plan with the account team.")
  }

  return insights
}

// Get status color for UI
export function getStatusColor(status: CustomerStatus): {
  bg: string
  text: string
  border: string
} {
  switch (status) {
    case "On Track":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      }
    case "At Risk":
      return {
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
      }
    case "Underperforming":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
      }
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
      }
  }
}

// Get variance color for UI
export function getVarianceColor(variance: number): string {
  if (variance > 0) return "text-green-600"
  if (variance < 0) return "text-red-600"
  return "text-gray-600"
}
