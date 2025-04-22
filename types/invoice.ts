export interface Accessory {
  id: string
  name: string
  unitPrice: number
}

export interface SelectedAccessory extends Accessory {
  quantity: number
  total: number
}

export interface SavedInvoice {
  id: string
  clientInfo: {
    client: string
    location: string
    contact: string
    date: string
    gauge: string
    cmpPercentage: number
    paymentMethod: string
  }
  accessories: SelectedAccessory[]
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
  createdAt: string
}

export interface ClientInfo {
  client: string
  location: string
  contact: string
  date: string
}

export interface CompanyInfo {
  name: string
  description: string
  location: string
  contact: string
  website: string
}