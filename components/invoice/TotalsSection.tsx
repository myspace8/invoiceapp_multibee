import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TotalsSectionProps {
  totals: {
    subtotal: number
    nihil: number
    getFund: number
    covid: number
    vat: number
    discount: number
    transportation: number
    installation: number
    grandTotal: number
  }
  discountPercentage: number
  transportationCost: number
  installationPercentage: number
  expanded: boolean
  onToggle: () => void
  onDiscountChange: (percent: number) => void
  onTransportationChange: (cost: number) => void
  onInstallationChange: (percent: number) => void
}

const discountOptions = [0, 5, 10, 15]
const installationOptions = [0, 5, 10, 15]

export function TotalsSection({
  totals,
  discountPercentage,
  transportationCost,
  installationPercentage,
  expanded,
  onToggle,
  onDiscountChange,
  onTransportationChange,
  onInstallationChange,
}: TotalsSectionProps) {
  return (
    <Card>
      <CardHeader
        className="py-4 px-6 flex flex-row items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <CardTitle className="text-lg font-medium">Invoice Totals</CardTitle>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-3 max-w-md ml-auto">
            <div className="flex justify-between">
              <span className="font-medium">SUBTOTAL</span>
              <span>{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">NIHIL (2.5%)</span>
              <span>{totals.nihil.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">GETFund (2.5%)</span>
              <span>{totals.getFund.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">COVID-19 (1%)</span>
              <span>{totals.covid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">VAT (15%)</span>
              <span>{totals.vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">DISCOUNT</span>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      {discountPercentage}% <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {discountOptions.map((percent) => (
                      <DropdownMenuItem
                        key={percent}
                        onClick={() => onDiscountChange(percent)}
                      >
                        {percent}%
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <span>-{totals.discount.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">TRANSPORTATION</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={transportationCost.toFixed(2)}
                onChange={(e) => onTransportationChange(Number(e.target.value) || 0)}
                className="w-24 text-right"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">INSTALLATION</span>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      {installationPercentage}% <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {installationOptions.map((percent) => (
                      <DropdownMenuItem
                        key={percent}
                        onClick={() => onInstallationChange(percent)}
                      >
                        {percent}%
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <span>{totals.installation.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>GRAND TOTAL</span>
              <span>{totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}