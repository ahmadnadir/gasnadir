"use client"
import { Badge } from "@/components/ui/badge"
import { getStatusColor } from "@/lib/customer-utils"
import type { CustomerInsight } from "@/lib/customer-utils"
import { cn } from "@/lib/utils"

interface CustomerListProps {
  customers: CustomerInsight[]
  selectedCustomerId: string
  onSelectCustomer: (customer: CustomerInsight) => void
}

function getVarianceColor(variancePercent: number): string {
  if (variancePercent > 5) {
    return "text-green-500"
  } else if (variancePercent < -5) {
    return "text-red-500"
  } else {
    return "text-gray-500"
  }
}

export default function CustomerList({ customers, selectedCustomerId, onSelectCustomer }: CustomerListProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted/50 p-3 border-b">
        <h3 className="font-medium">Customers ({customers.length})</h3>
      </div>

      <div className="overflow-y-auto max-h-[600px]">
        {customers.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No customers match your filters</p>
          </div>
        ) : (
          <div className="divide-y">
            {customers.map((customer) => {
              const statusColor = getStatusColor(customer.status)

              return (
                <div
                  key={customer.id}
                  className={cn(
                    "p-3 cursor-pointer hover:bg-muted/30 transition-colors",
                    selectedCustomerId === customer.id && "bg-muted/20",
                  )}
                  onClick={() => onSelectCustomer(customer)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{customer.customer}</h4>
                    <Badge
                      variant="outline"
                      className={cn("ml-2", statusColor.bg, statusColor.text, statusColor.border)}
                    >
                      {customer.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div className="text-muted-foreground">Sector:</div>
                    <div>{customer.sector}</div>

                    <div className="text-muted-foreground">Area:</div>
                    <div>{customer.area}</div>

                    <div className="text-muted-foreground">Volume:</div>
                    <div>{new Intl.NumberFormat("en-US").format(customer.actualVolume)} GJ</div>
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs">
                      {customer.segment}
                    </Badge>

                    <div className={cn("text-sm font-medium", getVarianceColor(customer.variancePercent))}>
                      {customer.variancePercent > 0 ? "+" : ""}
                      {customer.variancePercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
