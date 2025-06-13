// Mock data for the application

export type Customer = {
  id: string
  customerCode: string
  customer: string
  area: string
  sector: string
  segment: string
}

export type VolumeData = {
  id: string
  customerId: string
  volumeType: "Actual" | "Budget" | "Forecast" | "Variance"
  month: number
  year: number
  volume: number
}

export const areas = ["PRK", "PKP", "SWP", "JHR", "MNS", "PTK"]
export const sectors = [
  "Rubber gloves",
  "Oleochemical",
  "Consumer Products",
  "Manufacturing",
  "Food & Beverage",
  "Pharmaceuticals",
]
export const segments = ["Elite", "Premium", "Preferred"]

// Generate mock customers
export const mockCustomers: Customer[] = [
  {
    id: "1",
    customerCode: "RGJ001",
    customer: "GloveMax Industries",
    area: "JHR",
    sector: "Rubber gloves",
    segment: "Elite",
  },
  {
    id: "2",
    customerCode: "OCP002",
    customer: "TropicChem Products",
    area: "PRK",
    sector: "Oleochemical",
    segment: "Premium",
  },
  {
    id: "3",
    customerCode: "CPM003",
    customer: "EssentialGoods Co",
    area: "SWP",
    sector: "Consumer Products",
    segment: "Preferred",
  },
  {
    id: "4",
    customerCode: "RGP004",
    customer: "MediShield Gloves",
    area: "PKP",
    sector: "Rubber gloves",
    segment: "Premium",
  },
  {
    id: "5",
    customerCode: "MFJ005",
    customer: "PrecisionTech Industries",
    area: "JHR",
    sector: "Manufacturing",
    segment: "Elite",
  },
  {
    id: "6",
    customerCode: "OCP006",
    customer: "NaturalChem Solutions",
    area: "PRK",
    sector: "Oleochemical",
    segment: "Preferred",
  },
  {
    id: "7",
    customerCode: "CPM007",
    customer: "HomeEssentials Ltd",
    area: "MNS",
    sector: "Consumer Products",
    segment: "Premium",
  },
  {
    id: "8",
    customerCode: "FBP008",
    customer: "TastyTreats Food Co",
    area: "PTK",
    sector: "Food & Beverage",
    segment: "Preferred",
  },
  {
    id: "9",
    customerCode: "PHJ009",
    customer: "VitalCare Pharma",
    area: "JHR",
    sector: "Pharmaceuticals",
    segment: "Elite",
  },
  {
    id: "10",
    customerCode: "MFP010",
    customer: "InnovateX Manufacturing",
    area: "PKP",
    sector: "Manufacturing",
    segment: "Premium",
  },
]

// Generate mock volume data
export function generateMockVolumeData(): VolumeData[] {
  const data: VolumeData[] = []
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  // Generate data for previous 12 months plus 3 months forecast
  for (let customerIndex = 0; customerIndex < mockCustomers.length; customerIndex++) {
    const customerId = mockCustomers[customerIndex].id

    // Past 12 months of actual data
    for (let monthOffset = -11; monthOffset <= 0; monthOffset++) {
      let month = currentMonth + monthOffset
      let year = currentYear

      if (month <= 0) {
        month += 12
        year -= 1
      }

      // Actuals
      const actualVolume = Math.floor(1000 + Math.random() * 5000)
      data.push({
        id: `a-${customerId}-${year}-${month}`,
        customerId,
        volumeType: "Actual",
        month,
        year,
        volume: actualVolume,
      })

      // Budget
      const budgetVolume = actualVolume * (0.9 + Math.random() * 0.3)
      data.push({
        id: `b-${customerId}-${year}-${month}`,
        customerId,
        volumeType: "Budget",
        month,
        year,
        volume: Math.floor(budgetVolume),
      })

      // Variance
      data.push({
        id: `v-${customerId}-${year}-${month}`,
        customerId,
        volumeType: "Variance",
        month,
        year,
        volume: Math.floor(actualVolume - budgetVolume),
      })
    }

    // Next 3 months of forecast data
    for (let monthOffset = 1; monthOffset <= 3; monthOffset++) {
      let month = currentMonth + monthOffset
      let year = currentYear

      if (month > 12) {
        month -= 12
        year += 1
      }

      // Budget
      const budgetVolume = Math.floor(1000 + Math.random() * 5000)
      data.push({
        id: `b-${customerId}-${year}-${month}`,
        customerId,
        volumeType: "Budget",
        month,
        year,
        volume: budgetVolume,
      })

      // Forecast
      const forecastVolume = budgetVolume * (0.9 + Math.random() * 0.3)
      data.push({
        id: `f-${customerId}-${year}-${month}`,
        customerId,
        volumeType: "Forecast",
        month,
        year,
        volume: Math.floor(forecastVolume),
      })
    }
  }

  return data
}

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Helper function to aggregate data by dimension
export function aggregateData(data: VolumeData[], customers: Customer[], dimension: "area" | "sector" | "segment") {
  const result: Record<string, { actual: number; budget: number; forecast: number; variance: number }> = {}

  // Initialize result with all possible dimension values
  let dimensionValues: string[] = []
  if (dimension === "area") dimensionValues = areas
  else if (dimension === "sector") dimensionValues = sectors
  else dimensionValues = segments

  dimensionValues.forEach((value) => {
    result[value] = { actual: 0, budget: 0, forecast: 0, variance: 0 }
  })

  // Aggregate data
  data.forEach((item) => {
    const customer = customers.find((c) => c.id === item.customerId)
    if (!customer) return

    const dimensionValue = customer[dimension]

    if (item.volumeType === "Actual") {
      result[dimensionValue].actual += item.volume
    } else if (item.volumeType === "Budget") {
      result[dimensionValue].budget += item.volume
    } else if (item.volumeType === "Forecast") {
      result[dimensionValue].forecast += item.volume
    } else if (item.volumeType === "Variance") {
      result[dimensionValue].variance += item.volume
    }
  })

  return result
}

// Get year-to-date totals
export function getYTDTotals(data: VolumeData[]) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const filteredData = data.filter((item) => item.year === currentYear && item.month <= currentMonth)

  const actual = filteredData.filter((item) => item.volumeType === "Actual").reduce((sum, item) => sum + item.volume, 0)

  const budget = filteredData.filter((item) => item.volumeType === "Budget").reduce((sum, item) => sum + item.volume, 0)

  const forecast = filteredData
    .filter((item) => item.volumeType === "Forecast")
    .reduce((sum, item) => sum + item.volume, 0)

  const variance = actual - budget

  return { actual, budget, forecast, variance }
}

// Get current month totals
export function getCurrentMonthTotals(data: VolumeData[]) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const filteredData = data.filter((item) => item.year === currentYear && item.month === currentMonth)

  const actual = filteredData.filter((item) => item.volumeType === "Actual").reduce((sum, item) => sum + item.volume, 0)

  const budget = filteredData.filter((item) => item.volumeType === "Budget").reduce((sum, item) => sum + item.volume, 0)

  const forecast = filteredData
    .filter((item) => item.volumeType === "Forecast")
    .reduce((sum, item) => sum + item.volume, 0)

  const variance = actual - budget

  return { actual, budget, forecast, variance }
}
