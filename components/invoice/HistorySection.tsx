import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Eye, Pencil, Download, Trash2, ChevronDown } from "lucide-react"
import { SavedInvoice } from "@/types/invoice"

interface HistorySectionProps {
  savedInvoices: SavedInvoice[]
  onView: (invoice: SavedInvoice) => void
  onEdit: (invoice: SavedInvoice) => void
  onDownload: (invoice: SavedInvoice) => void
  onDelete: (id: string) => void
}

type SortOption = 
  | "date-newest"
  | "date-oldest"
  | "client-asc"
  | "client-desc"
  | "total-asc"
  | "total-desc"

export function HistorySection({ savedInvoices, onView, onEdit, onDownload, onDelete }: HistorySectionProps) {
  const [sortOption, setSortOption] = useState<SortOption>("date-newest")
  const [filter, setFilter] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setInvoiceToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (invoiceToDelete) {
      onDelete(invoiceToDelete)
      setDeleteDialogOpen(false)
      setInvoiceToDelete(null)
    }
  }

  const sortedAndFilteredInvoices = [...savedInvoices]
    .filter((invoice) =>
      invoice.clientInfo.client.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "date-newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "date-oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "client-asc":
          return a.clientInfo.client.localeCompare(b.clientInfo.client)
        case "client-desc":
          return b.clientInfo.client.localeCompare(a.clientInfo.client)
        case "total-asc":
          return a.totals.grandTotal - b.totals.grandTotal
        case "total-desc":
          return b.totals.grandTotal - a.totals.grandTotal
        default:
          return 0
      }
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Invoice History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Filter by client name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Sort: {sortOption.replace("-", " ")} <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOption("date-newest")}>
                Date (Newest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("date-oldest")}>
                Date (Oldest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("client-asc")}>
                Client (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("client-desc")}>
                Client (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("total-asc")}>
                Total (Low-High)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("total-desc")}>
                Total (High-Low)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {sortedAndFilteredInvoices.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {filter ? "No invoices match the filter." : "No invoices saved yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAndFilteredInvoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Invoice ID:</span>
                      <span>{invoice.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Client:</span>
                      <span>{invoice.clientInfo.client || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>
                        {invoice.clientInfo.date || new Date(invoice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Grand Total:</span>
                      <span>${invoice.totals.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-1 border-t pt-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(invoice)}
                      className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(invoice)}
                      className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50"
                      title="Edit Invoice"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownload(invoice)}
                      className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(invoice.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Delete Invoice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
