"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast, { Toaster } from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"
import { useMediaQuery } from "@/hooks/use-mobile"
import { ClientInfoSection } from "./ClientInfoSection"
import { AccessoriesSection } from "./AccessoriesSection"
import { TotalsSection } from "./TotalsSection"
import { HistorySection } from "./HistorySection"
import { ViewInvoiceModal } from "./ViewInvoiceModal"
import { InvoiceActions } from "./InvoiceActions"
import { CompanyInfo } from "./CompanyInfo"
import { PrintInvoice } from "./PrintInvoice"
import { generateInvoicePDF } from "@/utils/pdfUtils"
import { calculateInvoiceTotals } from "@/utils/invoiceUtils"
import { SavedInvoice, SelectedAccessory, ClientInfo, CompanyInfo as CompanyInfoType } from "@/types/invoice"

export default function CreateInvoice() {
  // State definitions
  const [selectedAccessories, setSelectedAccessories] = useState<SelectedAccessory[]>([])
  const [modalSelections, setModalSelections] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState({
    clientInfo: true,
    accessories: true,
    totals: true,
  })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [installationPercentage, setInstallationPercentage] = useState(0)
  const [transportationCost, setTransportationCost] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash")
  const [gauge, setGauge] = useState<string>("0.30 MSL ALUZINC WRINKLINK")
  const [cmpPercentage, setCmpPercentage] = useState(1)
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    client: "",
    location: "",
    contact: "",
    date: "",
  })
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("invoices")
      return stored ? JSON.parse(stored) : []
    }
    return []
  })
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null)
  const [viewInvoice, setViewInvoice] = useState<SavedInvoice | null>(null)
  const [activeTab, setActiveTab] = useState<"invoice" | "history" | "settings">("invoice")
  const [errors, setErrors] = useState<Partial<Record<keyof ClientInfo, string>>>({})
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Company information
  const companyInfo: CompanyInfoType = {
    name: "ABC Roofing Ltd.",
    description: "Dealers in all kinds of roofing sheets",
    location: "123 Industrial Ave, Accra, Ghana",
    contact: "+233 123 456 7890",
    website: "www.abcroofing.com",
  }

  // Validation
  const validateInputs = () => {
    const newErrors: Partial<Record<keyof ClientInfo, string>> = {}
    if (!clientInfo.client.trim()) {
      newErrors.client = "Client name is required"
    }
    if (clientInfo.contact && !/^\+?\d{10,15}(-\d{3,4})?$/.test(clientInfo.contact)) {
      newErrors.contact = "Invalid phone number (e.g., +1234567890 or 123-456-7890)"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handlers
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({ ...expandedSections, [section]: !expandedSections[section] })
  }

  const handleClientInfoChange = (field: keyof ClientInfo, value: string) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleQuantityChange = (id: string, quantity: number) => {
    setSelectedAccessories((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, quantity)
          return { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
        }
        return item
      }),
    )
  }

  const handleRemoveAccessory = (id: string) => {
    setSelectedAccessories((prev) => prev.filter((item) => item.id !== id))
  }

  const handleModalSelectionChange = (id: string, checked: boolean) => {
    setModalSelections((prev) =>
      checked ? [...prev, id] : prev.filter((existingId) => existingId !== id),
    )
  }

  const handleAddAccessories = () => {
    const newAccessories = modalSelections
      .filter((id) => !selectedAccessories.some((item) => item.id === id))
      .map((id) => {
        const accessory = [
          { id: "acc1", name: "MB HIPCAP WRINKLING", unitPrice: 142.5 },
          { id: "acc2", name: "MB RAINGUTTER WRINKLING", unitPrice: 141.0 },
          { id: "acc3", name: "ROOF SHEET STANDARD", unitPrice: 185.75 },
          { id: "acc4", name: "RIDGE CAP STANDARD", unitPrice: 95.25 },
          { id: "acc5", name: "VALLEY GUTTER", unitPrice: 120.0 },
          { id: "acc6", name: "FLASHING STRIP", unitPrice: 65.5 },
          { id: "acc7", name: "FASTENERS PACK", unitPrice: 45.0 },
          { id: "acc8", name: "SEALANT TUBE", unitPrice: 12.75 },
        ].find((a) => a.id === id)!
        return { ...accessory, quantity: 1, total: accessory.unitPrice }
      })

    setSelectedAccessories((prev) => [...prev, ...newAccessories])
    setSheetOpen(false)
    setModalSelections([])
  }

  const resetForm = () => {
    setClientInfo({ client: "", location: "", contact: "", date: "" })
    setSelectedAccessories([])
    setDiscountPercentage(0)
    setInstallationPercentage(0)
    setTransportationCost(0)
    setGauge("0.30 MSL ALUZINC WRINKLINK")
    setCmpPercentage(1)
    setPaymentMethod("Cash")
    setEditingInvoiceId(null)
    setErrors({})
  }

  const saveInvoice = () => {
    if (!validateInputs()) {
      toast.error("Please fix the errors before saving")
      return
    }

    const totals = calculateInvoiceTotals(
      selectedAccessories,
      discountPercentage,
      transportationCost,
      installationPercentage,
    )
    const invoice: SavedInvoice = {
      id: editingInvoiceId || uuidv4(),
      clientInfo: {
        client: clientInfo.client,
        location: clientInfo.location,
        contact: clientInfo.contact,
        date: clientInfo.date,
        gauge,
        cmpPercentage,
        paymentMethod,
      },
      accessories: selectedAccessories,
      totals,
      createdAt: editingInvoiceId
        ? savedInvoices.find((inv) => inv.id === editingInvoiceId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    }

    let updatedInvoices: SavedInvoice[]
    if (editingInvoiceId) {
      updatedInvoices = savedInvoices.map((inv) => (inv.id === editingInvoiceId ? invoice : inv))
      toast.success("Invoice updated successfully")
    } else {
      updatedInvoices = [...savedInvoices, invoice]
      toast.success("Invoice saved successfully")
    }

    setSavedInvoices(updatedInvoices)
    if (typeof window !== "undefined") {
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
    }
    resetForm()
  }

  const deleteInvoice = (id: string) => {
    const updatedInvoices = savedInvoices.filter((invoice) => invoice.id !== id)
    setSavedInvoices(updatedInvoices)
    if (typeof window !== "undefined") {
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
    }
  }

  const editInvoice = (invoice: SavedInvoice) => {
    setEditingInvoiceId(invoice.id)
    setClientInfo(invoice.clientInfo)
    setSelectedAccessories(invoice.accessories)
    setDiscountPercentage((invoice.totals.discount / invoice.totals.subtotal) * 100 || 0)
    setInstallationPercentage((invoice.totals.installation / invoice.totals.subtotal) * 100 || 0)
    setTransportationCost(invoice.totals.transportation)
    setGauge(invoice.clientInfo.gauge)
    setCmpPercentage(invoice.clientInfo.cmpPercentage)
    setPaymentMethod(invoice.clientInfo.paymentMethod)
    setActiveTab("invoice")
    setErrors({})
  }

  const downloadInvoice = () => {
    const totals = calculateInvoiceTotals(
      selectedAccessories,
      discountPercentage,
      transportationCost,
      installationPercentage,
    )
    generateInvoicePDF(clientInfo, selectedAccessories, totals, companyInfo)
  }

  const downloadSavedInvoice = (invoice: SavedInvoice) => {
    generateInvoicePDF(invoice.clientInfo, invoice.accessories, invoice.totals, companyInfo)
  }

  const handlePrint = () => {
    window.print()
  }

  const totals = calculateInvoiceTotals(
    selectedAccessories,
    discountPercentage,
    transportationCost,
    installationPercentage,
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Toaster position="top-right" />
      <CompanyInfo companyInfo={companyInfo} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">PROFORMA INVOICE</h1>
        <InvoiceActions
          editingInvoiceId={editingInvoiceId}
          onPrint={handlePrint}
          onDownload={downloadInvoice}
          onSave={saveInvoice}
          onCancelEdit={resetForm}
          isSaveDisabled={!!errors.client || !!errors.contact}
        />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="invoice" className="space-y-6">
          <ClientInfoSection
            clientInfo={clientInfo}
            gauge={gauge}
            cmpPercentage={cmpPercentage}
            paymentMethod={paymentMethod}
            expanded={expandedSections.clientInfo}
            onToggle={() => toggleSection("clientInfo")}
            onClientInfoChange={handleClientInfoChange}
            onGaugeChange={setGauge}
            onCmpChange={setCmpPercentage}
            onPaymentMethodChange={setPaymentMethod}
            setErrors={setErrors}
          />
          <AccessoriesSection
            selectedAccessories={selectedAccessories}
            modalSelections={modalSelections}
            sheetOpen={sheetOpen}
            expanded={expandedSections.accessories}
            onToggle={() => toggleSection("accessories")}
            onQuantityChange={handleQuantityChange}
            onRemoveAccessory={handleRemoveAccessory}
            onModalSelectionChange={handleModalSelectionChange}
            onAddAccessories={handleAddAccessories}
            onSheetOpenChange={setSheetOpen}
          />
          <TotalsSection
            totals={totals}
            discountPercentage={discountPercentage}
            transportationCost={transportationCost}
            installationPercentage={installationPercentage}
            expanded={expandedSections.totals}
            onToggle={() => toggleSection("totals")}
            onDiscountChange={setDiscountPercentage}
            onTransportationChange={setTransportationCost}
            onInstallationChange={setInstallationPercentage}
          />
        </TabsContent>

        <TabsContent value="history">
          <HistorySection
            savedInvoices={savedInvoices}
            onView={setViewInvoice}
            onEdit={editInvoice}
            onDownload={downloadSavedInvoice}
            onDelete={deleteInvoice}
          />
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center text-muted-foreground py-6">
            Invoice settings will appear here
          </div>
        </TabsContent>
      </Tabs>

      <ViewInvoiceModal
        invoice={viewInvoice}
        companyInfo={companyInfo}
        onClose={() => setViewInvoice(null)}
        onDownload={downloadSavedInvoice}
      />

      <PrintInvoice
        companyInfo={companyInfo}
        clientInfo={{ ...clientInfo, gauge, cmpPercentage, paymentMethod }}
        accessories={selectedAccessories}
        totals={totals}
      />
    </div>
  )
}
