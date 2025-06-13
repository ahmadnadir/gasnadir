"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Sparkles, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { areas, sectors, segments, mockCustomers, monthNames } from "@/lib/data-utils"

interface BudgetItem {
  id: string
  customerCode: string
  customer: string
  area: string
  sector: string
  segment: string
  currentYear: number
  nextYear: number
  variance: number
  months: number[]
}

// Generate mock budget data
const generateBudgetItems = () => {
  return mockCustomers.map((customer) => {
    const currentYear = 10000 + Math.floor(Math.random() * 30000)
    const nextYear = currentYear * (0.9 + Math.random() * 0.3)
    const variance = nextYear - currentYear

    // Generate monthly data
    const months = Array(12)
      .fill(0)
      .map(() => {
        return Math.floor((nextYear / 12) * (0.8 + Math.random() * 0.4))
      })

    return {
      id: customer.id,
      customerCode: customer.customerCode,
      customer: customer.customer,
      area: customer.area,
      sector: customer.sector,
      segment: customer.segment,
      currentYear,
      nextYear: Math.floor(nextYear),
      variance,
      months,
    }
  })
}

export default function BudgetPlanning() {
  const [area, setArea] = useState("all")
  const [sector, setSector] = useState("all")
  const [segment, setSegment] = useState("all")
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(generateBudgetItems())

  const handleGenerateBudget = () => {
    // In a real app, this would call an API to generate budget
    const newBudgetItems = generateBudgetItems()
    setBudgetItems(newBudgetItems)
  }

  const filteredItems = budgetItems.filter((item) => {
    return (
      (area === "all" || item.area === area) &&
      (sector === "all" || item.sector === sector) &&
      (segment === "all" || item.segment === segment)
    )
  })

  const handleUpdateMonth = (itemId: string, monthIndex: number, value: number) => {
    setBudgetItems((prev) => {
      return prev.map((item) => {
        if (item.id === itemId) {
          const newMonths = [...item.months]
          newMonths[monthIndex] = value

          // Recalculate yearly total
          const newNextYear = newMonths.reduce((sum, val) => sum + val, 0)
          const newVariance = newNextYear - item.currentYear

          return {
            ...item,
            months: newMonths,
            nextYear: newNextYear,
            variance: newVariance,
          }
        }
        return item
      })
    })
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-green-500"
    if (variance < 0) return "text-red-500"
    return ""
  }

  // AI-generated suggestions
  const suggestions = {
    RGJ001: "+12% due to capacity expansion in glove segment",
    OCP002: "-8% due to expected raw material price increases",
    CPM003: "+5% aligned with consumer product market growth forecast",
    MFJ005: "+15% based on new facility production plans in Q2",
    PHJ009: "+7% due to increased demand in healthcare sector",
  }

  // Calculate quarterly totals for each item
  const getQuarterlyTotals = (months: number[]) => {
    return [
      months.slice(0, 3).reduce((sum, val) => sum + val, 0),
      months.slice(3, 6).reduce((sum, val) => sum + val, 0),
      months.slice(6, 9).reduce((sum, val) => sum + val, 0),
      months.slice(9, 12).reduce((sum, val) => sum + val, 0),
    ]
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budget Planning</h1>
          <p className="text-muted-foreground">Simplify the annual gas volume budgeting process</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Generator</CardTitle>
          <CardDescription>Generate volume estimates based on historical data and market trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Area</label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sector</label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Segment</label>
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  {segments.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleGenerateBudget} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate AI Budget
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Planning Table</CardTitle>
          <CardDescription>Review and adjust volume estimates for 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-muted/50 w-[200px]">Customer</TableHead>
                  <TableHead className="bg-muted/50">Area</TableHead>
                  <TableHead className="bg-muted/50">Sector</TableHead>
                  <TableHead className="bg-muted/50">2025 (GJ)</TableHead>
                  <TableHead className="bg-muted/50">2026 (GJ)</TableHead>
                  <TableHead className="bg-muted/50">Variance</TableHead>
                  {monthNames.map((month, index) => (
                    <TableHead key={month} className="bg-muted/50 min-w-[100px]">
                      {month.substring(0, 3)}
                    </TableHead>
                  ))}
                  <TableHead className="bg-muted/50">Q1</TableHead>
                  <TableHead className="bg-muted/50">Q2</TableHead>
                  <TableHead className="bg-muted/50">Q3</TableHead>
                  <TableHead className="bg-muted/50">Q4</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const quarterlyTotals = getQuarterlyTotals(item.months)

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.customer}
                          {suggestions[item.customerCode] && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-primary cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{suggestions[item.customerCode]}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.area}</TableCell>
                      <TableCell>{item.sector}</TableCell>
                      <TableCell>{new Intl.NumberFormat("en-US").format(item.currentYear)}</TableCell>
                      <TableCell className="font-medium">
                        {new Intl.NumberFormat("en-US").format(item.nextYear)}
                      </TableCell>
                      <TableCell className={getVarianceColor(item.variance)}>
                        {item.variance > 0 ? "+" : ""}
                        {new Intl.NumberFormat("en-US").format(item.variance)}
                        <br />
                        <span className="text-xs">({((item.variance / item.currentYear) * 100).toFixed(1)}%)</span>
                      </TableCell>

                      {/* Monthly inputs */}
                      {item.months.map((value, monthIndex) => (
                        <TableCell key={monthIndex} className="p-1">
                          <Input
                            type="number"
                            className="h-8 text-right"
                            value={value}
                            onChange={(e) =>
                              handleUpdateMonth(item.id, monthIndex, Number.parseInt(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                      ))}

                      {/* Quarterly totals */}
                      {quarterlyTotals.map((total, qIndex) => (
                        <TableCell key={`q-${qIndex}`} className="font-medium text-right">
                          {new Intl.NumberFormat("en-US").format(total)}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
