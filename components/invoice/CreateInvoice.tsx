"use client"

import { useState, useCallback, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import toast, { Toaster } from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"
import { useMediaQuery } from "@/hooks/use-mobile"
import { ClientInfoSection } from "./ClientInfoSection"
import { AccessoriesSection } from "./AccessoriesSection"
import { TotalsSection } from "./TotalsSection"
import { HistorySection } from "./HistorySection"
import { SettingsSection } from "./SettingsSection"
import { ViewInvoiceModal } from "./ViewInvoiceModal"
import { InvoiceActions } from "./InvoiceActions"
import { CompanyInfo } from "./CompanyInfo"
import { PrintInvoice } from "./PrintInvoice"
import { generateInvoicePDF } from "@/utils/pdfUtils"
import { calculateInvoiceTotals } from "@/utils/invoiceUtils"
import { generateCSV, downloadCSV } from "@/utils/exportUtils"
import { usePersistedState } from "@/hooks/usePersistedState"
import { useInvoiceTemplates } from "@/hooks/useInvoiceTemplates"
import { useSettings } from "@/hooks/useSettings"
import { SavedInvoice, InvoiceTemplate, Settings, SelectedAccessory, ClientInfo } from "@/types/invoice"
import { invoiceFormSchema } from "@/schemas/invoiceSchema"
import { z } from "zod"
import { Trash2 } from "lucide-react"

export type InvoiceFormData = z.infer<typeof invoiceFormSchema>

export default function CreateInvoice() {
  // State and hooks
  const [expandedSections, setExpandedSections] = useState({
    clientInfo: true,
    accessories: true,
    totals: true,
  })
  const [savedInvoices, setSavedInvoices] = usePersistedState<SavedInvoice[]>("invoices", [])
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null)
  const [viewInvoice, setViewInvoice] = useState<SavedInvoice | null>(null)
  const [activeTab, setActiveTab] = useState<"invoice" | "history" | "settings">("invoice")
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [deleteTemplateDialogOpen, setDeleteTemplateDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<InvoiceTemplate | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { templates, saveTemplate, deleteTemplate } = useInvoiceTemplates()

  const initialSettings: Settings = {
    companyInfo: {
      name: "ABC Roofing Ltd.",
      description: "Dealers in all kinds of roofing sheets",
      location: "123 Industrial Ave, Accra, Ghana",
      contact: "+2331234567890",
      website: "www.abcroofing.com",
    },
    defaultGauge: "0.30 MSL ALUZINC WRINKLINK",
    defaultTaxRates: {
      nihil: 2.5,
      getFund: 2.5,
      covid: 1,
      vat: 15,
    },
  }
  const { settings } = useSettings(initialSettings)

  // Form setup
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientInfo: {
        client: "",
        location: "",
        contact: "",
        date: "",
        gauge: settings.defaultGauge,
        cmpPercentage: 1,
        paymentMethod: "Cash",
      },
      accessories: [],
      discountPercentage: 0,
      transportationCost: 0,
      installationPercentage: 0,
    },
  })

  // Handlers
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({ ...expandedSections, [section]: !expandedSections[section] })
  }

  const resetForm = useCallback(() => {
    form.reset({
      clientInfo: {
        client: "",
        location: "",
        contact: "",
        date: "",
        gauge: settings.defaultGauge,
        cmpPercentage: 1,
        paymentMethod: "Cash",
      },
      accessories: [],
      discountPercentage: 0,
      transportationCost: 0,
      installationPercentage: 0,
    })
    setEditingInvoiceId(null)
  }, [form, settings.defaultGauge])

  const saveInvoice = useCallback(() => {
    form.handleSubmit((data) => {
      const totals = calculateInvoiceTotals(
        data.accessories,
        data.discountPercentage,
        data.transportationCost,
        data.installationPercentage
      )
      const invoice: SavedInvoice = {
        id: editingInvoiceId || uuidv4(),
        clientInfo: data.clientInfo,
        accessories: data.accessories,
        totals,
        createdAt: editingInvoiceId
          ? savedInvoices.find((inv) => inv.id === editingInvoiceId)?.createdAt || new Date().toISOString()
          : new Date().toISOString(),
      }

      const updatedInvoices = editingInvoiceId
        ? savedInvoices.map((inv) => (inv.id === editingInvoiceId ? invoice : inv))
        : [...savedInvoices, invoice]

      console.log("[CreateInvoice] Saving invoices:", updatedInvoices)
      setSavedInvoices(updatedInvoices)
      toast.success(editingInvoiceId ? "Invoice updated successfully" : "Invoice saved successfully")
      resetForm()
    })()
  }, [form, editingInvoiceId, savedInvoices, setSavedInvoices, resetForm])

  const deleteInvoice = useCallback(
    (id: string) => {
      const updatedInvoices = savedInvoices.filter((invoice) => invoice.id !== id)
      console.log("[CreateInvoice] Deleting invoice, new invoices:", updatedInvoices)
      setSavedInvoices(updatedInvoices)
    },
    [savedInvoices, setSavedInvoices]
  )

  const editInvoice = useCallback(
    (invoice: SavedInvoice) => {
      form.reset({
        clientInfo: invoice.clientInfo,
        accessories: invoice.accessories,
        discountPercentage: (invoice.totals.discount / invoice.totals.subtotal) * 100 || 0,
        transportationCost: invoice.totals.transportation,
        installationPercentage: (invoice.totals.installation / invoice.totals.subtotal) * 100 || 0,
      })
      setEditingInvoiceId(invoice.id)
      setActiveTab("invoice")
    },
    [form]
  )

  const downloadInvoice = useCallback(() => {
    const data = form.getValues()
    const totals = calculateInvoiceTotals(
      data.accessories,
      data.discountPercentage,
      data.transportationCost,
      data.installationPercentage
    )
    generateInvoicePDF(data.clientInfo, data.accessories, totals, settings.companyInfo)
  }, [form, settings.companyInfo])

  const downloadSavedInvoice = useCallback(
    (invoice: SavedInvoice) => {
      generateInvoicePDF(invoice.clientInfo, invoice.accessories, invoice.totals, settings.companyInfo)
    },
    [settings.companyInfo]
  )

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const exportCSV = useCallback(() => {
    const csvContent = generateCSV(savedInvoices)
    downloadCSV(csvContent, `invoices_${new Date().toISOString().slice(0, 10)}.csv`)
    toast.success("Invoices exported to CSV")
  }, [savedInvoices])

  const saveTemplateHandler = useCallback(() => {
    setTemplateDialogOpen(true)
  }, [])

  const confirmSaveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      toast.error("Template name is required")
      return
    }
    const data = form.getValues()
    saveTemplate(templateName, data.clientInfo, data.accessories)
    toast.success(`Template "${templateName}" saved`)
    setTemplateDialogOpen(false)
    setTemplateName("")
  }, [form, saveTemplate, templateName])

  const handleDeleteTemplateClick = (template: InvoiceTemplate) => {
    setTemplateToDelete(template)
    setDeleteTemplateDialogOpen(true)
  }

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete.id)
      toast.success(`Template "${templateToDelete.name}" deleted`)
      setDeleteTemplateDialogOpen(false)
      setTemplateToDelete(null)
    }
  }

  const applyTemplate = useCallback(
    (template: InvoiceTemplate) => {
      form.reset({
        ...form.getValues(),
        clientInfo: template.clientInfo,
        accessories: template.accessories,
      })
      toast.success(`Applied template "${template.name}"`)
    },
    [form]
  )

  const totals = useMemo(() => {
    const data = form.getValues()
    return calculateInvoiceTotals(
      data.accessories,
      data.discountPercentage,
      data.transportationCost,
      data.installationPercentage
    )
  }, [form])

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Toaster position="top-right" />
      <CompanyInfo companyInfo={settings.companyInfo} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">PROFORMA INVOICE</h1>
        <InvoiceActions
          editingInvoiceId={editingInvoiceId}
          onPrint={handlePrint}
          onDownload={downloadInvoice}
          onSave={saveInvoice}
          onCancelEdit={resetForm}
          onSaveTemplate={saveTemplateHandler}
          onExportCSV={exportCSV}
          isSaveDisabled={Object.keys(form.formState.errors).length > 0}
        />
      </div>

      <FormProvider {...form}>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="invoice" className="space-y-6">
            {/* When I enable templates, invoices in history misbehaves - refresh deletes from localstorage. */}
            {/* <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <h3 className="text-lg font-medium">Templates</h3>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template)}
                    className="flex items-center gap-2"
                  >
                    {template.name}
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTemplateClick(template)
                      }}
                      className="h-6 w-6 flex items-center justify-center cursor-pointer hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </span>
                  </Button>
                ))}
              </div>
            </div> */}
            <ClientInfoSection
              expanded={expandedSections.clientInfo}
              onToggle={() => toggleSection("clientInfo")}
            />
            <AccessoriesSection
              expanded={expandedSections.accessories}
              onToggle={() => toggleSection("accessories")}
            />
            <TotalsSection
              expanded={expandedSections.totals}
              onToggle={() => toggleSection("totals")}
            />
          </TabsContent>

          <TabsContent value="history">
            <HistorySection
              savedInvoices={savedInvoices}
              setSavedInvoices={setSavedInvoices}
              onView={setViewInvoice}
              onEdit={editInvoice}
              onDownload={downloadSavedInvoice}
              onDelete={deleteInvoice}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsSection initialSettings={initialSettings} />
          </TabsContent>
        </Tabs>
      </FormProvider>

      <ViewInvoiceModal
        invoice={viewInvoice}
        companyInfo={settings.companyInfo}
        onClose={() => setViewInvoice(null)}
        onDownload={downloadSavedInvoice}
      />

      <PrintInvoice
        companyInfo={settings.companyInfo}
        clientInfo={form.getValues().clientInfo}
        accessories={form.getValues().accessories}
        totals={totals}
      />

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSaveTemplate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteTemplateDialogOpen} onOpenChange={setDeleteTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Template Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the template{" "}
              <strong>{templateToDelete?.name || "N/A"}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteTemplateDialogOpen(false)
                setTemplateToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTemplate}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
