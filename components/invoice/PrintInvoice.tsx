import { ClientInfo, CompanyInfo as CompanyInfoType, SelectedAccessory } from "@/types/invoice"

interface PrintInvoiceProps {
  companyInfo: CompanyInfoType
  clientInfo: ClientInfo
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
}

export function PrintInvoice({ companyInfo, clientInfo, accessories, totals }: PrintInvoiceProps) {
  return (
    <div className="hidden print:block p-8 max-w-4xl mx-auto bg-white">
      <div className="border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold">{companyInfo.name}</h1>
        <p className="text-sm text-gray-600">{companyInfo.description}</p>
        <p className="text-sm">{companyInfo.location}</p>
        <p className="text-sm">{companyInfo.contact}</p>
        <a
          href={`https://${companyInfo.website}`}
          className="text-sm text-blue-600"
        >
          {companyInfo.website}
        </a>
      </div>

      <h2 className="text-xl font-semibold mb-4">PROFORMA INVOICE</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium">Client Information</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p><strong>Client:</strong> {clientInfo.client || "N/A"}</p>
            <p><strong>Location:</strong> {clientInfo.location || "N/A"}</p>
            <p><strong>Contact:</strong> {clientInfo.contact || "N/A"}</p>
          </div>
          <div>
            <p><strong>Date:</strong> {clientInfo.date || "N/A"}</p>
            <p><strong>Gauge:</strong> {clientInfo.gauge || "N/A"}</p>
            <p><strong>CMP:</strong> {clientInfo.cmpPercentage}%</p>
            <p><strong>Payment Method:</strong> {clientInfo.paymentMethod}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium">Accessories</h3>
        {accessories.length === 0 ? (
          <p className="text-sm text-gray-600">No accessories added.</p>
        ) : (
          <table className="w-full border-collapse mt-2">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-medium">Accessory</th>
                <th className="text-center py-2 px-2 font-medium">Unit Price</th>
                <th className="text-center py-2 px-2 font-medium">Quantity</th>
                <th className="text-right py-2 px-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {accessories.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-2">{item.name}</td>
                  <td className="text-center py-2 px-2">${item.unitPrice.toFixed(2)}</td>
                  <td className="text-center py-2 px-2">{item.quantity}</td>
                  <td className="text-right py-2 px-2">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium">Invoice Totals</h3>
        <div className="mt-2 space-y-1 max-w-md ml-auto">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">NIHIL (2.5%)</span>
            <span>${totals.nihil.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">GETFund (2.5%)</span>
            <span>${totals.getFund.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">COVID-19 (1%)</span>
            <span>${totals.covid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">VAT (15%)</span>
            <span>${totals.vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Discount</span>
            <span>-${totals.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Transportation</span>
            <span>${totals.transportation.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Installation</span>
            <span>${totals.installation.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-lg font-bold">
            <span>Grand Total</span>
            <span>${totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print:block, .print:block * {
            visibility: visible;
          }
          .print:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}