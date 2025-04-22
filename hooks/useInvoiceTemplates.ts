import { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { InvoiceTemplate, ClientInfo, SelectedAccessory } from "@/types/invoice"

export function useInvoiceTemplates() {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("invoiceTemplates")
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  const saveTemplate = useCallback(
    (name: string, clientInfo: ClientInfo, accessories: SelectedAccessory[]) => {
      const newTemplate: InvoiceTemplate = {
        id: uuidv4(),
        name,
        clientInfo,
        accessories,
      }
      const updatedTemplates = [...templates, newTemplate]
      setTemplates(updatedTemplates)
      if (typeof window !== "undefined") {
        localStorage.setItem("invoiceTemplates", JSON.stringify(updatedTemplates))
      }
      return newTemplate
    },
    [templates]
  )

  const deleteTemplate = useCallback(
    (id: string) => {
      const updatedTemplates = templates.filter((t) => t.id !== id)
      setTemplates(updatedTemplates)
      if (typeof window !== "undefined") {
        localStorage.setItem("invoiceTemplates", JSON.stringify(updatedTemplates))
      }
    },
    [templates]
  )

  return { templates, saveTemplate, deleteTemplate }
}