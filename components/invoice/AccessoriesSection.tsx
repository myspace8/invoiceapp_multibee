import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { PlusCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { Accessory, SelectedAccessory } from "@/types/invoice"

interface AccessoriesSectionProps {
  selectedAccessories: SelectedAccessory[]
  modalSelections: string[]
  sheetOpen: boolean
  expanded: boolean
  onToggle: () => void
  onQuantityChange: (id: string, quantity: number) => void
  onRemoveAccessory: (id: string) => void
  onModalSelectionChange: (id: string, checked: boolean) => void
  onAddAccessories: () => void
  onSheetOpenChange: (open: boolean) => void
}

const availableAccessories: Accessory[] = [
  { id: "acc1", name: "MB HIPCAP WRINKLING", unitPrice: 142.5 },
  { id: "acc2", name: "MB RAINGUTTER WRINKLING", unitPrice: 141.0 },
  { id: "acc3", name: "ROOF SHEET STANDARD", unitPrice: 185.75 },
  { id: "acc4", name: "RIDGE CAP STANDARD", unitPrice: 95.25 },
  { id: "acc5", name: "VALLEY GUTTER", unitPrice: 120.0 },
  { id: "acc6", name: "FLASHING STRIP", unitPrice: 65.5 },
  { id: "acc7", name: "FASTENERS PACK", unitPrice: 45.0 },
  { id: "acc8", name: "SEALANT TUBE", unitPrice: 12.75 },
]

export function AccessoriesSection({
  selectedAccessories,
  modalSelections,
  sheetOpen,
  expanded,
  onToggle,
  onQuantityChange,
  onRemoveAccessory,
  onModalSelectionChange,
  onAddAccessories,
  onSheetOpenChange,
}: AccessoriesSectionProps) {
  return (
    <Card>
      <CardHeader
        className="py-4 px-6 flex flex-row items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <CardTitle className="text-lg font-medium">Accessories</CardTitle>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">ACCESSORIES</th>
                  <th className="text-center py-3 px-2 font-medium">UNIT PRICE</th>
                  <th className="text-center py-3 px-2 font-medium">QUANTITY</th>
                  <th className="text-right py-3 px-2 font-medium">TOTAL</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {selectedAccessories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No accessories added yet. Click "Add Item" to select accessories.
                    </td>
                  </tr>
                ) : (
                  selectedAccessories.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">{item.name}</td>
                      <td className="text-center py-3 px-2">{item.unitPrice.toFixed(2)}</td>
                      <td className="text-center py-3 px-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => onQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-20 mx-auto text-center"
                        />
                      </td>
                      <td className="text-right py-3 px-2">{item.total.toFixed(2)}</td>
                      <td className="py-3 px-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveAccessory(item.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
                <tr>
                  <td colSpan={5} className="py-2">
                    <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <PlusCircle className="h-4 w-4" />
                          Add Item
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full sm:max-w-md">
                        <SheetHeader>
                          <SheetTitle>Select Accessories</SheetTitle>
                          <SheetDescription>
                            Choose the accessories you want to add to your invoice.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                          <ScrollArea className="h-[60vh]">
                            <div className="space-y-4 pr-4">
                              {availableAccessories.map((accessory) => (
                                <div key={accessory.id} className="flex items-center space-x-2 border-b pb-2">
                                  <Checkbox
                                    id={`accessory-${accessory.id}`}
                                    checked={modalSelections.includes(accessory.id)}
                                    onCheckedChange={(checked) => onModalSelectionChange(accessory.id, !!checked)}
                                  />
                                  <div className="flex flex-1 justify-between items-center">
                                    <Label
                                      htmlFor={`accessory-${accessory.id}`}
                                      className="flex-1 cursor-pointer"
                                    >
                                      {accessory.name}
                                    </Label>
                                    <span className="text-sm font-medium">${accessory.unitPrice.toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                        <SheetFooter className="mt-6 flex justify-between sm:justify-between">
                          <SheetClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </SheetClose>
                          <Button onClick={onAddAccessories} disabled={modalSelections.length === 0}>
                            Add Selected ({modalSelections.length})
                          </Button>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  )
}