import { Button } from "@/components/ui/button"
import { Printer, Download, Save } from "lucide-react"

interface InvoiceActionsProps {
  editingInvoiceId: string | null
  onPrint: () => void
  onDownload: () => void
  onSave: () => void
  onCancelEdit: () => void
  onSaveTemplate: () => void
  onExportCSV: () => void
  isSaveDisabled: boolean
}

export function InvoiceActions({
  editingInvoiceId,
  onPrint,
  onDownload,
  onSave,
  onCancelEdit,
  onSaveTemplate,
  onExportCSV,
  isSaveDisabled,
}: InvoiceActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={onPrint}>
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">Print</span>
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={onDownload}>
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Download PDF</span>
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={onExportCSV}>
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export CSV</span>
      </Button>
      {/* <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={onSaveTemplate}
        disabled={isSaveDisabled}
      >
        <Save className="h-4 w-4" />
        <span className="hidden sm:inline">Save Template</span>
      </Button> */}
      <Button
        size="sm"
        className="flex items-center gap-1"
        onClick={onSave}
        disabled={isSaveDisabled}
      >
        {editingInvoiceId ? "Update" : "Save"}
      </Button>
      {editingInvoiceId && (
        <Button variant="outline" size="sm" onClick={onCancelEdit}>
          Cancel Edit
        </Button>
      )}
    </div>
  )
}