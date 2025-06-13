"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { areas, sectors, segments } from "@/lib/data-utils"

interface CustomerFiltersProps {
  filters: {
    area: string
    sector: string
    segment: string
    status: string
  }
  setFilters: (filters: any) => void
  onReset: () => void
}

export default function CustomerFilters({ filters, setFilters, onReset }: CustomerFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    })
  }

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
            <div className="space-y-2">
              <label className="text-sm font-medium">Area</label>
              <Select value={filters.area} onValueChange={(value) => handleFilterChange("area", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sector</label>
              <Select value={filters.sector} onValueChange={(value) => handleFilterChange("sector", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Segment</label>
              <Select value={filters.segment} onValueChange={(value) => handleFilterChange("segment", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  {segments.map((segment) => (
                    <SelectItem key={segment} value={segment}>
                      {segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="On Track">On Track</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                  <SelectItem value="Underperforming">Underperforming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={onReset} className="gap-1">
              <X className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
