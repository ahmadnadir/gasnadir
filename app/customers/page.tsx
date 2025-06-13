"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Download, Filter, Search, X } from "lucide-react"
import CustomerList from "@/components/customer-list"
import CustomerDetail from "@/components/customer-detail"
import CustomerFilters from "@/components/customer-filters"
import { mockCustomers, generateMockVolumeData } from "@/lib/data-utils"
import { generateCustomerInsights } from "@/lib/customer-utils"
import type { CustomerInsight } from "@/lib/customer-utils"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerInsight[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerInsight[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInsight | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    area: "all",
    sector: "all",
    segment: "all",
    status: "all",
  })

  useEffect(() => {
    // Generate mock data
    const volumeData = generateMockVolumeData()
    const customerInsights = generateCustomerInsights(mockCustomers, volumeData)
    setCustomers(customerInsights)
    setFilteredCustomers(customerInsights)

    // Set first customer as selected by default
    if (customerInsights.length > 0) {
      setSelectedCustomer(customerInsights[0])
    }
  }, [])

  useEffect(() => {
    // Apply filters and search
    let result = [...customers]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (customer) =>
          customer.customer.toLowerCase().includes(query) || customer.customerCode.toLowerCase().includes(query),
      )
    }

    // Apply filters
    if (filters.area !== "all") {
      result = result.filter((customer) => customer.area === filters.area)
    }

    if (filters.sector !== "all") {
      result = result.filter((customer) => customer.sector === filters.sector)
    }

    if (filters.segment !== "all") {
      result = result.filter((customer) => customer.segment === filters.segment)
    }

    if (filters.status !== "all") {
      result = result.filter((customer) => customer.status === filters.status)
    }

    setFilteredCustomers(result)

    // Update selected customer if it's filtered out
    if (selectedCustomer && !result.some((c) => c.id === selectedCustomer.id)) {
      setSelectedCustomer(result.length > 0 ? result[0] : null)
    } else if (result.length > 0 && !selectedCustomer) {
      setSelectedCustomer(result[0])
    }
  }, [customers, searchQuery, filters])

  const handleSelectCustomer = (customer: CustomerInsight) => {
    setSelectedCustomer(customer)
  }

  const handleResetFilters = () => {
    setFilters({
      area: "all",
      sector: "all",
      segment: "all",
      status: "all",
    })
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Insights</h1>
          <p className="text-muted-foreground">Monitor customer performance and identify at-risk accounts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            May 2025
          </Button>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            className="gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {Object.values(filters).some((v) => v !== "all") && (
              <span className="ml-1 rounded-full bg-primary/20 px-1.5 text-xs">
                {Object.values(filters).filter((v) => v !== "all").length}
              </span>
            )}
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {showFilters && <CustomerFilters filters={filters} setFilters={setFilters} onReset={handleResetFilters} />}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customers by name or code..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CustomerList
            customers={filteredCustomers}
            selectedCustomerId={selectedCustomer?.id || ""}
            onSelectCustomer={handleSelectCustomer}
          />
        </div>
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <CustomerDetail customer={selectedCustomer} />
          ) : (
            <div className="flex items-center justify-center h-[600px] border rounded-lg bg-muted/10">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">No customer selected</h3>
                <p className="text-muted-foreground">Select a customer from the list to view detailed insights</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
