"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Home, TrendingUp, TrendingDown, Lightbulb } from "lucide-react"
import { getStatusColor, getVarianceColor } from "@/lib/customer-utils"
import type { CustomerInsight } from "@/lib/customer-utils"
import { cn } from "@/lib/utils"
import CustomerVolumeChart from "@/components/customer-volume-chart"
import Link from "next/link"

interface CustomerDetailProps {
  customer: CustomerInsight
}

export default function CustomerDetail({ customer }: CustomerDetailProps) {
  const statusColor = getStatusColor(customer.status)
  const varianceColor = getVarianceColor(customer.variancePercent)

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "On Track":
        return "Customer is meeting or exceeding volume targets"
      case "At Risk":
        return "Customer is slightly below volume targets"
      case "Underperforming":
        return "Customer is significantly below volume targets"
      default:
        return ""
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm">
        <Link href="/customers" className="text-muted-foreground hover:text-foreground">
          <Home className="h-4 w-4" />
          <span className="sr-only">Customers</span>
        </Link>
        <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
        <span className="font-medium">{customer.customer}</span>
        <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
        <span className="text-muted-foreground">{customer.customerCode}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Actual Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(customer.actualVolume)} GJ</div>
            <p className="text-sm text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={cn("text-2xl font-bold", varianceColor)}>
                {customer.variancePercent > 0 ? "+" : ""}
                {customer.variancePercent.toFixed(1)}%
              </div>
              {customer.variancePercent > 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <p className={cn("text-sm mt-1", varianceColor)}>
              {formatNumber(Math.abs(customer.variance))} GJ {customer.variance >= 0 ? "above" : "below"} budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn(statusColor.bg, statusColor.text, statusColor.border)}>
                {customer.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{getStatusDescription(customer.status)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Volume Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <CustomerVolumeChart data={customer.timeSeriesData} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-3">
              <div className="text-sm font-medium text-muted-foreground">Customer Code</div>
              <div>{customer.customerCode}</div>

              <div className="text-sm font-medium text-muted-foreground">Sector</div>
              <div>{customer.sector}</div>

              <div className="text-sm font-medium text-muted-foreground">Segment</div>
              <div>
                <Badge variant="secondary">{customer.segment}</Badge>
              </div>

              <div className="text-sm font-medium text-muted-foreground">Area</div>
              <div>{customer.area}</div>

              <div className="text-sm font-medium text-muted-foreground">Usage Rank</div>
              <div>#{customer.rank}</div>

              <div className="text-sm font-medium text-muted-foreground">Budget Volume</div>
              <div>{formatNumber(customer.budgetVolume)} GJ</div>

              <div className="text-sm font-medium text-muted-foreground">Forecast (Next 3M)</div>
              <div>{formatNumber(customer.forecastVolume)} GJ</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">AI Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customer.insights.map((insight, index) => (
                <div key={index} className="text-sm">
                  <p>{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
