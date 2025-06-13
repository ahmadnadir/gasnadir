"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { areas, sectors, segments } from "@/lib/data-utils"

interface FilterBarProps {
  filters: {
    area: string
    sector: string
    segment: string
    timeFrame: string
  }
  setFilters: (filters: any) => void
}

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      <div>
        <Select value={filters.area} onValueChange={(value) => handleFilterChange("area", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Area" />
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

      <div>
        <Select value={filters.sector} onValueChange={(value) => handleFilterChange("sector", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Sector" />
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

      <div>
        <Select value={filters.segment} onValueChange={(value) => handleFilterChange("segment", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Segment" />
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

      <div>
        <Select value={filters.timeFrame} onValueChange={(value) => handleFilterChange("timeFrame", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Time Frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mtd">Month to Date</SelectItem>
            <SelectItem value="mom">Month over Month</SelectItem>
            <SelectItem value="qoq">Quarter over Quarter</SelectItem>
            <SelectItem value="yoy">Year over Year</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
