import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ClientInfo } from "@/types/invoice"

interface ClientInfoSectionProps {
  clientInfo: ClientInfo
  gauge: string
  cmpPercentage: number
  paymentMethod: string
  expanded: boolean
  onToggle: () => void
  onClientInfoChange: (field: keyof ClientInfo, value: string) => void
  onGaugeChange: (gauge: string) => void
  onCmpChange: (percent: number) => void
  onPaymentMethodChange: (method: string) => void
  setErrors: (errors: Partial<Record<keyof ClientInfo, string>>) => void
}

const gaugeOptions = [
  "0.30 MSL ALUZINC WRINKLINK",
  "0.35 ALUZINC WRINKLING",
  "0.40 ALUZINC WRINKLING",
  "0.30 IBR 1000 ALUZINC WRINKLING",
]

const cmpOptions = Array.from({ length: 20 }, (_, i) => i + 1)
const paymentMethods = ["Cash", "Bank", "Mobile Money"]

export function ClientInfoSection({
  clientInfo,
  gauge,
  cmpPercentage,
  paymentMethod,
  expanded,
  onToggle,
  onClientInfoChange,
  onGaugeChange,
  onCmpChange,
  onPaymentMethodChange,
  setErrors,
}: ClientInfoSectionProps) {
  const [localErrors, setLocalErrors] = useState<Partial<Record<keyof ClientInfo, string>>>({})

  const validateField = (field: keyof ClientInfo, value: string) => {
    let error: string | undefined
    if (field === "client" && !value.trim()) {
      error = "Client name is required"
    } else if (field === "contact" && value && !/^\+?\d{10,15}(-\d{3,4})?$/.test(value)) {
      error = "Invalid phone number (e.g., +1234567890 or 123-456-7890)"
    }
    setLocalErrors((prev) => ({ ...prev, [field]: error }))
    setErrors({ ...localErrors, [field]: error })
    return !error
  }

  const handleChange = (field: keyof ClientInfo, value: string) => {
    onClientInfoChange(field, value)
    validateField(field, value)
  }

  return (
    <Card>
      <CardHeader
        className="py-4 px-6 flex flex-row items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <CardTitle className="text-lg font-medium">Client Information</CardTitle>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </CardHeader>

      {expanded && (
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client">CLIENT:</Label>
            <Input
              id="client"
              placeholder="Enter client name"
              value={clientInfo.client}
              onChange={(e) => handleChange("client", e.target.value)}
              className={localErrors.client ? "border-red-500 animate-shake" : ""}
            />
            {localErrors.client && (
              <p className="text-sm text-red-500">{localErrors.client}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">LOCATION:</Label>
            <Input
              id="location"
              placeholder="Enter location"
              value={clientInfo.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">CONTACT:</Label>
            <Input
              id="contact"
              placeholder="Enter contact details"
              value={clientInfo.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              className={localErrors.contact ? "border-red-500 animate-shake" : ""}
            />
            {localErrors.contact && (
              <p className="text-sm text-red-500">{localErrors.contact}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">DATE:</Label>
            <Input
              id="date"
              type="date"
              value={clientInfo.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gauge">GAUGE:</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {gauge} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {gaugeOptions.map((option) => (
                  <DropdownMenuItem key={option} onClick={() => onGaugeChange(option)}>
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cmp">CMP:</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {cmpPercentage}% <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {cmpOptions.map((percent) => (
                  <DropdownMenuItem key={percent} onClick={() => onCmpChange(percent)}>
                    {percent}%
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment">PAYMENT METHOD:</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {paymentMethod} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {paymentMethods.map((method) => (
                  <DropdownMenuItem key={method} onClick={() => onPaymentMethodChange(method)}>
                    {method}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
