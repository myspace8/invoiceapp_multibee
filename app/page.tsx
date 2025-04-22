import CreateInvoice from "@/components/invoice/CreateInvoice"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export default function Home() {
  return (
    <ErrorBoundary>
      <CreateInvoice />
    </ErrorBoundary>
  )
}